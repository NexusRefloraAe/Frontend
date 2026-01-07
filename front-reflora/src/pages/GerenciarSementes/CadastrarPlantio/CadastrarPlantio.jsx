import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormGeral from "../../../components/FormGeral/FormGeral";
import Input from "../../../components/Input/Input";
import { plantioService } from "../../../services/plantioService";
import { movimentacaoSementeService } from "../../../services/movimentacaoSementeService";
import { getBackendErrorMessage } from "../../../utils/errorHandler";
import "./CadastrarPlantio.css";

const CadastrarPlantio = ({ dadosParaCorrecao }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lote: "",
    nomePopular: "",
    qtdSemente: 0,
    dataPlantio: "",
    tipoPlantio: "",
    quantidadePlantada: 0,
  });

  const [loading, setLoading] = useState(false);
  const [sugestoes, setSugestoes] = useState([]);
  const [estoqueAtual, setEstoqueAtual] = useState(null);
  const [unidadeMedida, setUnidadeMedida] = useState("");

  const converterParaDataInput = (dataStr) => {
    if (!dataStr || dataStr === "-" || !dataStr.includes("/")) return "";
    const [dia, mes, ano] = dataStr.split("/");
    return `${ano}-${mes}-${dia}`; // Converte para yyyy-MM-dd
  };

  // 1. Efeito para preencher dados ao vir de uma correção
  useEffect(() => {
    if (dadosParaCorrecao) {
      const textoQtd = dadosParaCorrecao.quantidadeSaidaFormatada || "";
      const qtdNumerica = parseFloat(textoQtd.replace(/[^\d.]/g, "")) || 0;

      // Extrai a unidade (ex: "kg" ou "und")
      const unidade = textoQtd.replace(/[0-9.\s]/g, "");
      setUnidadeMedida(unidade);

      setFormData((prev) => ({
        ...prev,
        lote: dadosParaCorrecao.lote || "",
        nomePopular: dadosParaCorrecao.nomePopular || "",
        qtdSemente: qtdNumerica,

        dataPlantio: converterParaDataInput(
          dadosParaCorrecao.dataTeste ||
            dadosParaCorrecao.dataPlantio ||
            dadosParaCorrecao.dataDeCadastro
        ),

        tipoPlantio: dadosParaCorrecao.tipoPlantio || "Sementeira",

        // MAPEAMENTO ESSENCIAL:
        // O que germinou no teste vira a 'quantidadePlantada' no plantio
        quantidadePlantada:
          dadosParaCorrecao.quantidadePlantada ||
          dadosParaCorrecao.numSementesGerminaram ||
          0,
      }));
    }
  }, [dadosParaCorrecao]);

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

  const handleCancel = (confirmar = true) => {
    const resetForm = () => {
      if (dadosParaCorrecao) {
        navigate("/banco-sementes");
      } else {
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
      if (window.confirm("Deseja cancelar? As alterações não salvas serão perdidas.")) {
        resetForm();
      }
    } else {
      resetForm();
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === "number"
        ? e.target.value === "" ? "" : Number(e.target.value)
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
        await movimentacaoSementeService.corrigir(
          dadosParaCorrecao.idUltimoMovimentacao,
          formData,
          "muda"
        );
        alert("Movimentação corrigida com sucesso!");
        navigate("/banco-sementes");
      } else {
        const payload = { ...formData };
        if (payload.dataPlantio && payload.dataPlantio.includes("-")) {
          const [ano, mes, dia] = payload.dataPlantio.split("-");
          payload.dataPlantio = `${dia}/${mes}/${ano}`;
        }
        await plantioService.create(payload);
        alert("Plantio cadastrado com sucesso!");
        setFormData({
          lote: "",
          nomePopular: "",
          qtdSemente: 0,
          dataPlantio: "",
          tipoPlantio: "",
          quantidadePlantada: 0,
        });
      }
    } catch (error) {
      console.error(error);
      const msg = getBackendErrorMessage(error);
      alert(`Erro: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-plantio-container">
      {/* REMOVIDO O DIV cadastro-plantio-card AQUI */}
      <FormGeral
        title={dadosParaCorrecao ? "Corrigir para Plantio" : "Cadastro Plantio"}
        onSubmit={handleSubmit}
        useGrid={true}
      >
        {/* LOTE + AUTOCOMPLETE */}
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
          placeholder="Automático"
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
              name="qtdSemente"
              type="number"
              value={formData.qtdSemente}
              onChange={handleChange("qtdSemente")}
              onIncrement={() => handleIncrement("qtdSemente")}
              onDecrement={() => handleDecrement("qtdSemente")}
              required={true}
              disabled={!!dadosParaCorrecao}
            />
          </div>
          {dadosParaCorrecao ? (
            unidadeMedida && (
              <span style={{ marginTop: "15px", fontWeight: "bold", color: "#555", fontSize: "13px" }}>
                Unid: {unidadeMedida}
              </span>
            )
          ) : (
            estoqueAtual && (
              <span style={{ color: "#666", marginTop: "15px", fontSize: "13px" }}>
                Disp: <strong>{estoqueAtual}</strong>
              </span>
            )
          )}
        </div>

        <Input
          label="Qtd Mudas/Buracos (unid)"
          name="quantidadePlantada"
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
          placeholder="Selecione..."
          options={[
            { value: "Sementeira", label: "Sementeira" },
            { value: "Saquinho", label: "Saquinho" },
            { value: "Chão", label: "Chão" },
          ]}
        />

        {/* --- BOTÕES ALINHADOS À DIREITA --- */}
        <div className="plantio-actions">
          <button 
            type="button" 
            className="plantio-btn btn-cancelar" 
            onClick={() => handleCancel(true)}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="plantio-btn btn-salvar"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Cadastro"}
          </button>
        </div>

      </FormGeral>
    </div>
  );
};

export default CadastrarPlantio;