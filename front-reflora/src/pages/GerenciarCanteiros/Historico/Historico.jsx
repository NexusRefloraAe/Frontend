import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// Components
import TabelaResponsiva from "../../../components/TabelaResponsiva/TabelaResponsiva";
import ModalDetalheGenerico from "../../../components/ModalDetalheGenerico/ModalDetalheGenerico";
import EditarPlantioCanteiro from "../EditarPlantioCanteiro/EditarPlantioCanteiro";
import Paginacao from "../../../components/Paginacao/Paginacao";

// Services
import { canteiroService } from "../../../services/canteiroService";
import { plantioCanteiroService } from "../../../services/plantioCanteiroService";
import { getBackendErrorMessage } from "../../../utils/errorHandler";

// Styles
import "./Historico.css";

// Função utilitária para formatar datas (Evita o erro de Invalid Date)
const formatarDataTabela = (data) => {
  if (!data) return "-";
  if (Array.isArray(data)) {
    const [ano, mes, dia] = data;
    return `${String(dia).padStart(2, "0")}/${String(mes).padStart(
      2,
      "0"
    )}/${ano}`;
  }
  if (typeof data === "string") {
    if (data.includes("/")) return data;
    if (data.includes("-")) {
      const [ano, mes, dia] = data.split("T")[0].split("-");
      return `${dia}/${mes}/${ano}`;
    }
  }
  return data.toString();
};

const Historico = () => {
  // --- ESTADOS ---
  const [canteiros, setCanteiros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const [selecionados, setSelecionados] = useState([]);
  const [valoresSaida, setValoresSaida] = useState({});

  const [modalDetalheAberto, setModalDetalheAberto] = useState(false);
  const [canteiroSelecionado, setCanteiroSelecionado] = useState(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);

  const [historicoEntradas, setHistoricoEntradas] = useState([]);
  const [historicoSaidas, setHistoricoSaidas] = useState([]);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [termoBusca, setTermoBusca] = useState("");
  const itensPorPagina = 10;
  const [ordem, setOrdem] = useState("nomeCanteiro");
  const [direcao, setDirecao] = useState("asc");

  // --- CARREGAMENTO ---
  const fetchCanteiros = useCallback(async () => {
    setLoading(true);
    try {
      const data = await canteiroService.getAll(
        termoBusca,
        paginaAtual - 1,
        itensPorPagina,
        ordem,
        direcao
      );
      const dadosFormatados = data.content.map((c) => ({
        id: c.id,
        NomeCanteiro: c.nomeCanteiro,
        NomePopular: c.nomePopularSemente,
        Quantidade: c.quantidadePlantada,
        ...c,
      }));
      setCanteiros(dadosFormatados);
      setTotalPaginas(data.totalPages || 1);
      setErro("");
    } catch (error) {
      setErro(getBackendErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [termoBusca, paginaAtual, ordem, direcao]);

  useEffect(() => {
    fetchCanteiros();
  }, [fetchCanteiros]);

  // --- INTERAÇÕES DA TABELA ---
  const toggleSelecao = (id) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleChangeQuantidade = (id, valor) => {
    setValoresSaida((prev) => ({ ...prev, [id]: valor }));
  };

  // Localize e substitua esta função no seu Historico.jsx
  const handleAdicionarDistribuicao = () => {
    if (selecionados.length === 0)
      return alert("Selecione ao menos um canteiro.");

    // Mapeia os canteiros marcados com suas respectivas quantidades de saída
    const mudasParaDistribuir = selecionados.map((id) => {
      const canteiro = canteiros.find((c) => c.id === id);
      return {
        canteiroId: canteiro.id, // UUID do Canteiro para o Back-end
        nome: canteiro.NomePopular, // Nome da espécie para exibir na lista
        quantidade: Number(valoresSaida[id] || 0),
      };
    });

    // Validação: impede avançar se algum campo estiver zerado
    if (mudasParaDistribuir.some((m) => m.quantidade <= 0)) {
      return alert("Informe uma quantidade válida para os itens selecionados.");
    }

    // ✅ NAVEGAÇÃO CORRETA: Aponta para a rota existente no AppRoutes.js
    navigate("/distribuicao-mudas", {
      state: {
        mudasSelecionadas: mudasParaDistribuir,
        tabDestino: "revisao-distribuicao", // Informa ao Layout qual aba ativar
      },
    });
  };

  // --- MODAL DETALHES ---
  const handleDetalheCanteiro = async (canteiro) => {
    try {
      const detalhes = await canteiroService.getById(canteiro.id);
      const hist = await canteiroService.getHistoricoDetalhado(canteiro.id);

      const detalhesNormalizados = {
        ...detalhes,
        nomeCanteiro:
          detalhes.nomeCanteiro ||
          detalhes.nome ||
          canteiro.NomeCanteiro ||
          "-",
      };

      const fmtHist = (arr) =>
        (arr?.content || []).map((i) => ({
          nomePopular: i.nomePopularMuda || "-",
          data: formatarDataTabela(i.data),
          quantidade: i.quantidade,
        }));

      setHistoricoEntradas(fmtHist(hist?.entradas));
      setHistoricoSaidas(fmtHist(hist?.saidas));
      setCanteiroSelecionado(detalhesNormalizados);
      setModalDetalheAberto(true);
    } catch (e) {
      alert("Erro ao carregar detalhes.");
    }
  };

  // --- AÇÕES DE EDIÇÃO E EXCLUSÃO (Migradas do Antigo) ---
  const handleSalvarEdicao = async (dadosParaAtualizar) => {
    setLoading(true);
    try {
      await plantioCanteiroService.update(dadosParaAtualizar.id, {
        quantidade: dadosParaAtualizar.quantidade,
        data: dadosParaAtualizar.dataPlantio,
      });
      alert("Lote atualizado com sucesso!");
      setModalEdicaoAberto(false);
      setCanteiroSelecionado(null);
      fetchCanteiros();
    } catch (error) {
      alert(getBackendErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirCanteiro = async () => {
    if (!canteiroSelecionado || !canteiroSelecionado.id) return;
    if (
      !window.confirm(
        `Deseja realmente excluir o canteiro ${
          canteiroSelecionado.nomeCanteiro || ""
        }?`
      )
    )
      return;

    try {
      await canteiroService.delete(canteiroSelecionado.id);
      alert("Canteiro excluído com sucesso!");
      fetchCanteiros();
      setModalDetalheAberto(false);
      setCanteiroSelecionado(null);
    } catch (error) {
      alert(`Erro ao excluir: ${getBackendErrorMessage(error)}`);
    }
  };

  // --- EXPORTAÇÃO ---
  const downloadArquivo = (blob, nomeArquivo) => {
    const url = window.URL.createObjectURL(new Blob([blob.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", nomeArquivo);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleExportarPdf = async (item) => {
    try {
      setLoading(true);
      const blob = await canteiroService.exportarHistoricoPdf(item.id);
      downloadArquivo(blob, `Historico_${item.nomeCanteiro || "Canteiro"}.pdf`);
    } catch (error) {
      alert("Erro ao exportar PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportarCsv = async (item) => {
    try {
      setLoading(true);
      const blob = await canteiroService.exportarHistoricoCsv(item.id);
      downloadArquivo(blob, `Historico_${item.nomeCanteiro || "Canteiro"}.csv`);
    } catch (error) {
      alert("Erro ao exportar CSV.");
    } finally {
      setLoading(false);
    }
  };

  // --- COLUNAS ---
  const colunas = [
    {
      key: "select",
      label: "",
      width: "40px",
      align: "center",
      render: (item) => (
        <input
          type="checkbox"
          className="checkbox-selecao"
          checked={selecionados.includes(item.id)}
          onChange={() => toggleSelecao(item.id)}
        />
      ),
    },
    {
      key: "NomeCanteiro",
      label: "Nome do Canteiro",
      sortable: true,
      sortKey: "nomeCanteiro",
      render: (item) => (
        <span
          className="link-detalhes"
          onClick={() => handleDetalheCanteiro(item)}
          title="Ver Detalhes"
        >
          {item.NomeCanteiro}
        </span>
      ),
    },
    {
      key: "NomePopular",
      label: "Espécie",
      sortable: true,
      sortKey: "nomePopularSemente",
    },
    {
      key: "Quantidade",
      label: "Qtd Atual",
      sortable: true,
      sortKey: "quantidadePlantada",
    },
    {
      key: "capacidadeMaxima",
      label: "Capacidade Máxima",
      sortable: true,
      sortKey: "capacidadeMaxima",
    },
    {
      key: "qtdSaida",
      label: "Qtd Saída",
      width: "140px",
      align: "center",
      render: (item) => (
        <input
          type="number"
          className="input-qtd-saida"
          placeholder="0"
          value={valoresSaida[item.id] || ""}
          onChange={(e) => handleChangeQuantidade(item.id, e.target.value)}
          disabled={!selecionados.includes(item.id)}
          onKeyDown={(e) => {
            if (["e", "E", ",", "."].includes(e.key)) e.preventDefault();
          }}
        />
      ),
    },
  ];

  const colModal = [
    { key: "nomePopular", label: "Nome Popular" },
    { key: "data", label: "Data" },
    { key: "quantidade", label: "Qtd" },
  ];

  return (
    <div className="historico-page-container">
      <div className="historico-content-wrapper">
        {erro && <p style={{ color: "red" }}>{erro}</p>}

        <TabelaResponsiva
          titulo="Histórico de Canteiro"
          colunas={colunas}
          dados={canteiros}
          termoBusca={termoBusca}
          onPesquisar={(t) => {
            setTermoBusca(t);
            setPaginaAtual(1);
          }}
          onOrdenar={(key) => {
            if (key === ordem) setDirecao(direcao === "asc" ? "desc" : "asc");
            else {
              setOrdem(key);
              setDirecao("asc");
            }
          }}
          ordemAtual={ordem}
          direcaoAtual={direcao}
          placeholderBusca="Pesquisar canteiro..."
          footerContent={
            <div
              className="table-footer-container"
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Paginacao
                paginaAtual={paginaAtual}
                totalPaginas={totalPaginas}
                onPaginaChange={setPaginaAtual}
              />
              <button
                className="btn-adicionar"
                onClick={handleAdicionarDistribuicao}
              >
                Adicionar
              </button>
            </div>
          }
        />
      </div>

      {/* MODAL DETALHES (Propriedades restauradas do antigo) */}
      {modalDetalheAberto && canteiroSelecionado && (
        <ModalDetalheGenerico
          isOpen={modalDetalheAberto}
          onClose={() => setModalDetalheAberto(false)}
          item={canteiroSelecionado}
          titulo="Detalhes do Canteiro"
          camposDetalhes={[
            { label: "Nome:", chave: "nomeCanteiro" },
            {
              label: "Data de cadastro:",
              chave: "dataCriacao",
              formatar: (d) => formatarDataTabela(d),
            },
            { label: "Quantidade atual:", chave: "quantidadePlantada" },
            { label: "Espaço disponível:", chave: "espacoDisponivel" },
            {
              label: "Capacidade de armazenamento:",
              chave: "capacidadeMaxima",
            },
          ]}
          colunasEntrada={colModal}
          dadosEntrada={historicoEntradas}
          colunasSaida={colModal}
          dadosSaida={historicoSaidas}
          onEditar={() => {
            setModalDetalheAberto(false);
            setModalEdicaoAberto(true);
          }}
          onExcluir={handleExcluirCanteiro}
          onExportarPdf={() => handleExportarPdf(canteiroSelecionado)}
          onExportarCsv={() => handleExportarCsv(canteiroSelecionado)}
          textoExclusao="o canteiro"
          mostrarAcoes={true}
          mostrarHistorico={true}
          mostrarExportar={true}
          mostrarImagem={false}
        />
      )}

      {/* MODAL EDIÇÃO */}
      {modalEdicaoAberto && canteiroSelecionado && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            zIndex: 99999,
            background: "rgba(0,0,0,0.5)",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              width: "95%",
              maxWidth: 700,
              position: "relative",
            }}
          >
            <button
              onClick={() => setModalEdicaoAberto(false)}
              style={{
                position: "absolute",
                right: 15,
                top: 10,
                border: "none",
                background: "none",
                fontSize: 20,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
            <EditarPlantioCanteiro
              itemParaEditar={canteiroSelecionado}
              onSave={handleSalvarEdicao}
              onCancel={() => setModalEdicaoAberto(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Historico;
