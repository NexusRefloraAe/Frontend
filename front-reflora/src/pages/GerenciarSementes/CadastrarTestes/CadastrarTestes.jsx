import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormGeral from "../../../components/FormGeral/FormGeral";
import Input from "../../../components/Input/Input";
import { testeGerminacaoService } from "../../../services/testeGerminacaoService";
import { plantioService } from "../../../services/plantioService";
import { movimentacaoSementeService } from "../../../services/movimentacaoSementeService";
import { getBackendErrorMessage } from "../../../utils/errorHandler";

// Importando o novo CSS
import "./CadastrarTestes.css";

const CadastrarTestes = ({ dadosParaCorrecao }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lote: "",
    nomePopular: "",
    dataTeste: "",
    quantidade: 0, // Qtd amostra
    camaraFria: "",
    dataGerminacao: "",
    numSementesPlantadas: 0, // NOVO: Amostra técnica
    numSementesGerminaram: 0, // NOVO: Antigo qntdGerminou
    taxaGerminou: "",
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
    const totalAmostra = Number(formData.numSementesPlantadas);
    const germinou = Number(formData.numSementesGerminaram);

    if (totalAmostra > 0 && germinou >= 0) {
      const taxa = ((germinou / totalAmostra) * 100).toFixed(2);
      setFormData((prev) => ({ ...prev, taxaGerminou: taxa }));
    } else {
      setFormData((prev) => ({ ...prev, taxaGerminou: "" }));
    }
  }, [formData.numSementesPlantadas, formData.numSementesGerminaram]);

  // 2. Função de Cancelar
  const handleCancel = (confirmar = true) => {
    const resetForm = () => {
      if (dadosParaCorrecao) {
        navigate("/banco-sementes");
      } else {
        setFormData({
          lote: "",
          nomePopular: "",
          dataTeste: "",
          quantidade: 0,
          camaraFria: "",
          dataGerminacao: "",
          numSementesPlantadas: 0,
          numSementesGerminaram: 0,
          taxaGerminou: "",
        });
        setSugestoes([]);
        setEstoqueAtual(null);
      }
    };

    if (confirmar) {
      if (window.confirm("Deseja cancelar? As alterações não salvas serão perdidas.")) {
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
        await movimentacaoSementeService.corrigir(
          dadosParaCorrecao.idUltimoMovimentacao,
          formData,
          "germinacao"
        );
        alert("Movimentação corrigida para Teste com sucesso!");
        navigate("/banco-sementes");
      } else {
        const payload = { ...formData };
        if (payload.dataTeste && payload.dataTeste.includes("-")) {
          const [ano, mes, dia] = payload.dataTeste.split("-");
          payload.dataTeste = `${dia}/${mes}/${ano}`;
        }
        await testeGerminacaoService.create(payload);
        alert("Teste cadastrado com sucesso!");
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

  // REMOVIDO: const actions = [...]

  return (
    <div className="cadastro-testes-container">
      <FormGeral
        title={
          dadosParaCorrecao
            ? "Corrigir para Teste de Germinação"
            : "Cadastro Teste de Germinação"
        }
        // actions={actions} REMOVIDO
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
            disabled={!!dadosParaCorrecao}
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
          label="Qtd Amostra para o Teste (unidades)"
          type="number"
          value={formData.numSementesPlantadas}
          onChange={handleChange("numSementesPlantadas")}
          onIncrement={() => handleIncrement("numSementesPlantadas")}
          onDecrement={() => handleDecrement("numSementesPlantadas")}
          required={true}
        />
        
        <Input
          label="Qtd que Germinou (unidades)"
          type="number"
          value={formData.numSementesGerminaram}
          onChange={handleChange("numSementesGerminaram")}
          onIncrement={() => handleIncrement("numSementesGerminaram")}
          onDecrement={() => handleDecrement("numSementesGerminaram")}
        />

        <Input
          label="Taxa Germinação (%)"
          name="taxaGerminou"
          type="text"
          value={formData.taxaGerminou ? `${formData.taxaGerminou}%` : ""}
          disabled={true}
          placeholder="Calculado automaticamente..."
        />

        {/* --- BOTÕES MANUAIS ALINHADOS À DIREITA --- */}
        <div className="testes-actions">
          <button 
            type="button" 
            className="testes-btn btn-cancelar" 
            onClick={() => handleCancel(true)}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="testes-btn btn-salvar"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Cadastro"}
          </button>
        </div>

      </FormGeral>
    </div>
  );
};

export default CadastrarTestes;