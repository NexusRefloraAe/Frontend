import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importado para navegação
import FormGeral from "../../../components/FormGeral/FormGeral";
import Input from "../../../components/Input/Input";
import { testeGerminacaoService } from "../../../services/testeGerminacaoService";
import { plantioService } from "../../../services/plantioService";
import { movimentacaoSementeService } from "../../../services/movimentacaoSementeService";
import { getBackendErrorMessage } from "../../../utils/errorHandler";

const CadastrarTestes = ({ dadosParaCorrecao }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lote: "",
    nomePopular: "",
    dataTeste: "",
    quantidade: 0, // Qtd amostra
    camaraFria: "",
    dataGerminacao: "",
    qntdGerminou: 0,
    taxaGerminou: "",
  });

  const [loading, setLoading] = useState(false);
  const [sugestoes, setSugestoes] = useState([]);
  const [estoqueAtual, setEstoqueAtual] = useState(null);
  const [unidadeMedida, setUnidadeMedida] = useState(""); // Novo estado

  // 1. Efeito para preencher dados ao vir de uma correção
  useEffect(() => {
    if (dadosParaCorrecao) {
      // Extrai o número: "3000 und" -> 3000
      const qtdOriginal = dadosParaCorrecao.quantidadeSaidaFormatada
        ? parseFloat(
            dadosParaCorrecao.quantidadeSaidaFormatada.replace(/[^\d.]/g, "")
          )
        : 0;

      // Extrai a unidade: "3000 und" -> "und"
      const unidade = dadosParaCorrecao.quantidadeSaidaFormatada
        ? dadosParaCorrecao.quantidadeSaidaFormatada.replace(/[0-9.\s]/g, "")
        : "";

      setUnidadeMedida(unidade);
      setFormData((prev) => ({
        ...prev,
        lote: dadosParaCorrecao.lote || "",
        nomePopular: dadosParaCorrecao.nomePopular || "",
        quantidade: qtdOriginal,
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

  // --- Cálculo automático da Taxa ---
  useEffect(() => {
    const total = Number(formData.quantidade);
    const germinou = Number(formData.qntdGerminou);

    if (total > 0 && germinou >= 0) {
      const taxa = ((germinou / total) * 100).toFixed(2);
      if (formData.taxaGerminou !== taxa) {
        setFormData((prev) => ({ ...prev, taxaGerminou: taxa }));
      }
    } else {
      setFormData((prev) => ({ ...prev, taxaGerminou: "" }));
    }
  }, [formData.quantidade, formData.qntdGerminou]);

  // 2. Função de Cancelar para voltar ao Banco
  const handleCancel = (confirmar = true) => {
    const resetForm = () => {
      // Se estivermos em modo de correção, voltamos para a listagem
      if (dadosParaCorrecao) {
        navigate("/banco-sementes");
      } else {
        // Se for cadastro comum, apenas limpamos os campos e ficamos na tela
        setFormData({
          lote: "",
          nomePopular: "",
          dataTeste: "",
          quantidade: 0,
          camaraFria: "",
          dataGerminacao: "",
          qntdGerminou: 0,
          taxaGerminou: "",
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
    let value = e.target.value;
    if (e.target.type === "number") {
      value = value === "" ? "" : Number(value);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIncrement = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (Number(prev[field]) || 0) + 1,
    }));
  };

  const handleDecrement = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(0, (Number(prev[field]) || 0) - 1),
    }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!formData.lote || !formData.nomePopular) {
      return alert("Por favor, selecione um Lote válido da lista.");
    }

    try {
      setLoading(true);

      if (dadosParaCorrecao?.idUltimoMovimentacao) {
        // ✅ MODO CORREÇÃO: Converte o registro e volta para o banco
        await movimentacaoSementeService.corrigir(
          dadosParaCorrecao.idUltimoMovimentacao,
          formData,
          "germinacao"
        );
        alert("Movimentação corrigida para Teste com sucesso!");
        navigate("/banco-sementes");
      } else {
        // ✅ MODO CADASTRO NORMAL: Cria o registro e permanece na tela
        const payload = { ...formData };
        if (payload.dataTeste && payload.dataTeste.includes("-")) {
          const [ano, mes, dia] = payload.dataTeste.split("-");
          payload.dataTeste = `${dia}/${mes}/${ano}`;
        }
        await testeGerminacaoService.create(payload);
        alert("Teste cadastrado com sucesso!");

        // Limpa o formulário para o próximo teste sem sair da página
        handleCancel(false);
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
    <div className="">
      <FormGeral
        title={
          dadosParaCorrecao
            ? "Corrigir para Teste de Germinação"
            : "Cadastro Teste de Germinação"
        }
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
          label="Data do Teste"
          name="dataTeste"
          type="date"
          value={formData.dataTeste}
          onChange={handleChange("dataTeste")}
          required={true}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <Input
              label="Qtd de sementes (Amostra)"
              name="quantidade"
              type="number"
              value={formData.quantidade}
              onChange={handleChange("quantidade")}
              onIncrement={() => handleIncrement("quantidade")}
              onDecrement={() => handleDecrement("quantidade")}
              required={true}
              placeholder="0"
              disabled={!!dadosParaCorrecao}
            />
          </div>
          {/* EXIBIÇÃO DA UNIDADE AO LADO DO INPUT */}
          {/* LÓGICA CONDICIONAL: Correção vs Disponibilidade */}
          {dadosParaCorrecao
            ? unidadeMedida && (
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
            : estoqueAtual && (
                <span style={{ color: "#666", marginTop: "15px" }}>
                  Disponível: <strong>{estoqueAtual}</strong>
                </span>
              )}
        </div>

        <Input
          label="Câmara fria"
          name="camaraFria"
          type="select"
          value={formData.camaraFria}
          onChange={handleChange("camaraFria")}
          required={true}
          placeholder="Sim/não"
          options={[
            { value: "Sim", label: "Sim" },
            { value: "Não", label: "Não" },
          ]}
        />

        <Input
          label="Data Germinação"
          name="dataGerminacao"
          type="date"
          value={formData.dataGerminacao}
          onChange={handleChange("dataGerminacao")}
          required={false}
        />

        <Input
          label="Qtd Germinou (und)"
          name="qntdGerminou"
          type="number"
          value={formData.qntdGerminou}
          onChange={handleChange("qntdGerminou")}
          onIncrement={() => handleIncrement("qntdGerminou")}
          onDecrement={() => handleDecrement("qntdGerminou")}
          required={false}
          placeholder="0"
        />

        <Input
          label="Taxa Germinação (%)"
          name="taxaGerminou"
          type="text"
          value={formData.taxaGerminou ? `${formData.taxaGerminou}%` : ""}
          disabled={true}
          placeholder="Calculado automaticamente..."
        />
      </FormGeral>
    </div>
  );
};

export default CadastrarTestes;
