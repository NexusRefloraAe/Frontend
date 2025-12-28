import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importado para navegação
import FormGeral from "../../../components/FormGeral/FormGeral";
import Input from "../../../components/Input/Input";
import { plantioService } from "../../../services/plantioService";
import { movimentacaoSementeService } from "../../../services/movimentacaoSementeService";

const CadastrarPlantio = ({ dadosParaCorrecao }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lote: "",
    nomePopular: "",
    qtdSemente: 0, // Sementes usadas (kg/g/und)
    dataPlantio: "",
    tipoPlantio: "",
    quantidadePlantada: 0, // Qtd de mudas/buracos
  });

  const [loading, setLoading] = useState(false);
  const [sugestoes, setSugestoes] = useState([]);
  const [estoqueAtual, setEstoqueAtual] = useState(null);

  // 1. Efeito para preencher dados ao vir de uma correção
  useEffect(() => {
    if (dadosParaCorrecao) {
      // Extrai apenas o número da string "1500 g" -> 1500
      const qtdOriginal = dadosParaCorrecao.quantidadeSaidaFormatada
        ? parseFloat(
            dadosParaCorrecao.quantidadeSaidaFormatada.replace(/[^\d.]/g, "")
          )
        : 0;

      setFormData((prev) => ({
        ...prev,
        lote: dadosParaCorrecao.lote || "",
        nomePopular: dadosParaCorrecao.nomePopular || "",
        qtdSemente: qtdOriginal,
      }));
    }
  }, [dadosParaCorrecao]);

  // --- Lógica do Autocomplete ---
  const handleLoteChange = async (e) => {
    const valor = e.target.value;
    setFormData((prev) => ({ ...prev, lote: valor }));

    if (valor.length > 1) {
      try {
        const resultados = await plantioService.pesquisarSementes(valor);
        setSugestoes(resultados);
      } catch (error) {
        console.error("Erro ao buscar sugestões:", error);
      }
    } else {
      setSugestoes([]);
    }
  };

  const handleBlurLote = () => {
    setTimeout(() => setSugestoes([]), 200);
  };

  const selecionarSugestao = (semente) => {
    setEstoqueAtual(semente.quantidadeAtualFormatada);
    setFormData((prev) => ({
      ...prev,
      lote: semente.lote,
      nomePopular: semente.nomePopular,
    }));
    setSugestoes([]);
  };

  // 2. Função de Cancelar corrigida para voltar ao Banco
  const handleCancel = (confirmar = true) => {
    if (
      confirmar &&
      !window.confirm("Deseja cancelar e voltar ao Banco de Sementes?")
    )
      return;
    navigate("/banco-sementes");
  };

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "number"
        ? e.target.value === ""
          ? ""
          : Number(e.target.value)
        : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIncrement = (field) =>
    setFormData((prev) => ({ ...prev, [field]: Number(prev[field] || 0) + 1 }));

  const handleDecrement = (field) =>
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(0, Number(prev[field] || 0) - 1),
    }));

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!formData.lote || !formData.nomePopular) {
      return alert("Selecione um Lote válido.");
    }

    try {
      setLoading(true);

      if (dadosParaCorrecao?.idUltimoMovimentacao) {
        // ✅ MODO CORREÇÃO
        await movimentacaoSementeService.corrigir(
          dadosParaCorrecao.idUltimoMovimentacao,
          formData,
          "muda"
        );
        alert("Movimentação corrigida com sucesso!");
      } else {
        // ✅ MODO CADASTRO NORMAL
        const payload = { ...formData };
        if (payload.dataPlantio && payload.dataPlantio.includes("-")) {
          const [ano, mes, dia] = payload.dataPlantio.split("-");
          payload.dataPlantio = `${dia}/${mes}/${ano}`;
        }
        await plantioService.create(payload);
        alert("Plantio cadastrado com sucesso!");
      }

      navigate("/banco-sementes"); // Volta ao banco após sucesso
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.message || "Erro ao processar a solicitação.";
      alert(`Erro: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    {
      type: "button",
      variant: "action-secondary",
      children: "Cancelar",
      onClick: () => handleCancel(true),
      disabled: loading,
    },
    {
      type: "submit",
      variant: "primary",
      children: loading ? "Salvando..." : "Salvar Cadastro",
      disabled: loading,
    },
  ];

  return (
    <FormGeral
      title={dadosParaCorrecao ? "Corrigir para Plantio" : "Cadastro Plantio"}
      actions={actions}
      onSubmit={handleSubmit}
      useGrid={true}
    >
      <div style={{ position: "relative" }}>
        <Input
          label="Lote"
          name="lote"
          type="text"
          value={formData.lote}
          onChange={handleLoteChange}
          onBlur={handleBlurLote}
          required={true}
          placeholder="Digite para buscar..."
          autoComplete="off"
          disabled={!!dadosParaCorrecao} // Bloqueia o lote se for correção
        />

        {sugestoes.length > 0 && (
          <ul
            className="autocomplete-list"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 1000,
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              listStyle: "none",
              padding: 0,
              margin: 0,
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            {sugestoes.map((s) => (
              <li
                key={s.id || s.lote}
                onClick={() => selecionarSugestao(s)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
              >
                <strong>{s.lote}</strong> - {s.nomePopular}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Input
        label="Nome Popular"
        name="nomePopular"
        type="text"
        value={formData.nomePopular}
        required={true}
        disabled={true}
        placeholder="Selecionado automaticamente"
      />

      <Input
        label="Data do Plantio"
        name="dataPlantio"
        type="date"
        value={formData.dataPlantio}
        onChange={handleChange("dataPlantio")}
        required={true}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ flex: 1 }}>
          <Input
            label="Quantidade de sementes"
            name="qtdSemente" // Nome corrigido para bater com o estado
            type="number"
            value={formData.qtdSemente}
            onChange={handleChange("qtdSemente")}
            onIncrement={() => handleIncrement("qtdSemente")}
            onDecrement={() => handleDecrement("qtdSemente")}
            required={true}
          />
        </div>
        {estoqueAtual && (
          <small style={{ color: "#666", marginTop: "15px" }}>
            Disponível: <strong>{estoqueAtual}</strong>
          </small>
        )}
      </div>

      <Input
        label="Qtd Mudas/Buracos (unid)"
        name="quantidadePlantada" // Nome único
        type="number"
        value={formData.quantidadePlantada}
        onChange={handleChange("quantidadePlantada")}
        onIncrement={() => handleIncrement("quantidadePlantada")}
        onDecrement={() => handleDecrement("quantidadePlantada")}
        required={true}
        placeholder="Ex: 100"
      />

      <Input
        label="Onde está sendo plantado?"
        name="tipoPlantio"
        type="select"
        value={formData.tipoPlantio}
        onChange={handleChange("tipoPlantio")}
        required={true}
        placeholder="Selecione o tipo de plantio"
        options={[
          { value: "Sementeira", label: "Sementeira" },
          { value: "Saquinho", label: "Saquinho" },
          { value: "Chão", label: "Chão" },
        ]}
      />
    </FormGeral>
  );
};

export default CadastrarPlantio;
