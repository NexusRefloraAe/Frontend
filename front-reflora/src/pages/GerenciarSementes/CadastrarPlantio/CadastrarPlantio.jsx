import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importado para navegação
import FormGeral from "../../../components/FormGeral/FormGeral";
import Input from "../../../components/Input/Input";
import { plantioService } from "../../../services/plantioService";
import { movimentacaoSementeService } from "../../../services/movimentacaoSementeService";
import { getBackendErrorMessage } from "../../../utils/errorHandler";

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
  const [unidadeMedida, setUnidadeMedida] = useState("");

  // 1. Efeito para preencher dados ao vir de uma correção
  useEffect(() => {
    if (dadosParaCorrecao) {
      const qtdOriginal = dadosParaCorrecao.quantidadeSaidaFormatada
        ? parseFloat(
            dadosParaCorrecao.quantidadeSaidaFormatada.replace(/[^\d.]/g, "")
          )
        : 0;

      const unidade = dadosParaCorrecao.quantidadeSaidaFormatada
        ? dadosParaCorrecao.quantidadeSaidaFormatada.replace(/[0-9.\s]/g, "")
        : "";

      setUnidadeMedida(unidade);
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

    const unidade = semente.quantidadeAtualFormatada.replace(/[0-9.\s]/g, "");
    setUnidadeMedida(unidade);

    setFormData((prev) => ({
      ...prev,
      lote: semente.lote,
      nomePopular: semente.nomePopular,
    }));
    setSugestoes([]);
  };

  // 2. Função de Cancelar corrigida para voltar ao Banco
  const handleCancel = (confirmar = true) => {
    const resetForm = () => {
      // 1. Se houver dados de correção, voltamos para a listagem principal
      if (dadosParaCorrecao) {
        navigate("/banco-sementes");
      } else {
        // 2. Caso contrário, apenas limpamos o formulário e ficamos na página
        setFormData({
          lote: "",
          nomePopular: "",
          qtdSemente: 0,
          dataPlantio: "",
          tipoPlantio: "",
          quantidadePlantada: 0,
        });
        setSugestoes([]);
        setEstoqueAtual(null);
      }
    };

    if (confirmar) {
      if (
        window.confirm(
          "Deseja cancelar? As alterações não salvas serão perdidas."
        )
      ) {
        resetForm();
      }
    } else {
      resetForm();
    }
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
        // ✅ MODO CORREÇÃO: Converte de um tipo para outro
        await movimentacaoSementeService.corrigir(
          dadosParaCorrecao.idUltimoMovimentacao,
          formData,
          "muda"
        );
        alert("Movimentação corrigida com sucesso!");

        // Como é uma correção, voltamos para a listagem principal
        navigate("/banco-sementes");
      } else {
        // ✅ MODO CADASTRO NORMAL
        const payload = { ...formData };
        if (payload.dataPlantio && payload.dataPlantio.includes("-")) {
          const [ano, mes, dia] = payload.dataPlantio.split("-");
          payload.dataPlantio = `${dia}/${mes}/${ano}`;
        }
        await plantioService.create(payload);
        alert("Plantio cadastrado com sucesso!");

        // 💡 Se você quer que o formulário limpe após cadastrar e permanecer na página:
        setFormData({
          lote: "",
          nomePopular: "",
          qtdSemente: 0,
          dataPlantio: "",
          tipoPlantio: "",
          quantidadePlantada: 0,
        });
        // O navigate NÃO é chamado aqui, mantendo o usuário na página
      }
    } catch (error) {
      console.error(error);
      const msg = getBackendErrorMessage(error);
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
            disabled={!!dadosParaCorrecao}
          />
        </div>
        {/* UNIDADE EXIBIDA AQUI */}
        {/* LÓGICA CONDICIONAL: Correção vs Disponibilidade */}
        {dadosParaCorrecao
          ? // Se for correção, exibe apenas a unidade de medida
            unidadeMedida && (
              <span
                style={{
                  marginTop: "15px",
                  fontWeight: "bold",
                  color: "#555",
                  fontSize: "14px",
                }}
              >
                Unidade de medida: {unidadeMedida}
              </span>
            )
          : // Se for cadastro normal, exibe o estoque disponível
            estoqueAtual && (
              <span style={{ color: "#666", marginTop: "15px" }}>
                Disponível: <strong>{estoqueAtual}</strong>
              </span>
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
