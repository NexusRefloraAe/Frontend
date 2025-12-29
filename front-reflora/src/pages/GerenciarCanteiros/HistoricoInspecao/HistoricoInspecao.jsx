import React, { useState, useEffect, useCallback } from "react";
import TabelaResponsiva from "../../../components/TabelaResponsiva/TabelaResponsiva";
import EditarInspecao from "../EditarInspecao/EditarInspecao";
import ModalExcluir from "../../../components/ModalExcluir/ModalExcluir";
import Paginacao from "../../../components/Paginacao/Paginacao";
import ModalDetalheGenerico from "../../../components/ModalDetalheGenerico/ModalDetalheGenerico";
import DetalheInspecao from "./DetalheInspecao/DetalheInspecao";
import ExportButton from "../../../components/ExportButton/ExportButton"; // Assumindo que você tem este componente
import { inspecaoService } from "../../../services/inspecaoMudaService";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const HistoricoInspecao = () => {
  // 1. Estados de Dados e UI
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);

  // 2. Estados de Modais
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [modalDetalheAberto, setModalDetalheAberto] = useState(false);
  const [inspecaoEditando, setInspecaoEditando] = useState(null);
  const [inspecaoExcluindo, setInspecaoExcluindo] = useState(null);

  // 3. Estados de Filtro, Ordenação e Paginação
  const [paginaAtual, setPaginaAtual] = useState(1); // UI usa 1-based
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [termoBusca, setTermoBusca] = useState("");
  const [ordem, setOrdem] = useState("dataInspecao");
  const [direcao, setDirecao] = useState("desc");
  const itensPorPagina = 5;

  // 4. Função para carregar dados da API
  const carregarDados = useCallback(
    async (
      pagina = paginaAtual,
      campoOrdem = ordem,
      dir = direcao,
      busca = termoBusca
    ) => {
      setLoading(true);
      try {
        // API Spring usa 0-based, por isso (pagina - 1)
        const response = await inspecaoService.getAll(
          pagina - 1,
          itensPorPagina,
          busca,
          campoOrdem,
          dir
        );

        setDados(response.content || []);
        setTotalPaginas(response.totalPages || 0);
      } catch (error) {
        console.error("Erro ao carregar inspeções:", error);
      } finally {
        setLoading(false);
      }
    },
    [itensPorPagina, paginaAtual, ordem, direcao, termoBusca]
  );

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // 5. Handlers de Ação
  const handleVisualizar = async (item) => {
    try {
      setLoading(true);
      const dadosCompletos = await inspecaoService.getById(item.id);
      setItemSelecionado(dadosCompletos);
      setModalDetalheAberto(true);
    } catch (error) {
      alert("Não foi possível carregar os detalhes.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (inspecao) => {
    setInspecaoEditando(inspecao);
    setModalEdicaoAberto(true);
    setModalDetalheAberto(false);
  };

  const handleExcluir = (inspecao) => {
    setInspecaoExcluindo(inspecao);
    setModalExclusaoAberto(true);
    setModalDetalheAberto(false);
  };

  const handleSalvarEdicao = async (dadosDoForm) => {
    try {
      setLoading(true);
      await inspecaoService.update(inspecaoEditando.id, dadosDoForm);
      setModalEdicaoAberto(false);
      carregarDados();
      alert("Atualizado com sucesso!");
    } catch (error) {
      alert("Erro ao atualizar.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmarExclusao = async () => {
    try {
      setLoading(true);
      await inspecaoService.delete(inspecaoExcluindo.id);
      setModalExclusaoAberto(false);
      carregarDados();
      alert("Excluído com sucesso!");
    } catch (error) {
      alert("Erro ao excluir.");
    } finally {
      setLoading(false);
    }
  };

  const handleOrdenar = (campo) => {
    const novaDirecao = campo === ordem && direcao === "asc" ? "desc" : "asc";
    setOrdem(campo);
    setDirecao(novaDirecao);
    setPaginaAtual(1); // Reseta para primeira página ao ordenar
  };

  // 6. Lógica de Exportação (vinda do código antigo)
  const realizarDownload = (response, defaultName) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", defaultName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleExportarPDF = async () => {
    try {
      setLoading(true);
      const response = await inspecaoService.exportarHistoricoPdf(termoBusca);
      realizarDownload(response, "historico_inspecoes.pdf");
    } catch (error) {
      alert("Erro ao exportar PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportarCSV = async () => {
    try {
      setLoading(true);
      const response = await inspecaoService.exportarHistoricoCsv(termoBusca);
      realizarDownload(response, "historico_inspecoes.csv");
    } catch (error) {
      alert("Erro ao exportar CSV.");
    } finally {
      setLoading(false);
    }
  };

  // 7. Definição das Colunas para a TabelaResponsiva
  const colunas = [
    {
      key: "loteMuda",
      label: "Lote",
      sortable: true,
      sortKey: "plantioCanteiro.plantioOrigem.lote",
    },
    {
      key: "nomePopular",
      label: "Nome Popular",
      sortable: true,
      sortKey: "plantioCanteiro.plantioOrigem.sementes.nomePopular",
    },
    {
      key: "nomeCanteiro",
      label: "Local",
      sortable: true,
      sortKey: "plantioCanteiro.canteiro.nome",
    },
    { key: "dataInspecao", label: "Data", sortable: true },
    { key: "estadoSaude", label: "Saúde", sortable: true },
    { key: "estimativaMudasProntas", label: "Qntd", sortable: true },
    {
      key: "acoes",
      label: "Ações",
      align: "center",
      render: (item) => (
        <div className="container-acoes-estavel" style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          {/* <button onClick={() => handleEditar(item)} title="Editar" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                        <FaEdit color="#fbc02d" size={16} />
                    </button>
                    <button onClick={() => handleVisualizar(item)} title="Visualizar" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                        <FaEye color="#1976d2"/>
                    </button>
                    <button onClick={() => handleExcluir(item)} title="Excluir" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                        <FaTrash color="#d32f2f" size={16} />
                    </button> */}
          <button
            className="btn-icone btn-editar"
            onClick={() => handleEditar(item)}
            title="Editar"
          >
            <FaEdit className="icone" />
          </button>
          <button
            type="button"
            className="btn-icone btn-confirmar"
            onClick={() => handleVisualizar(item)}
            title="Visualizar"
          >
            <FaEye className="icone" />
          </button>
          <button
            className="btn-icone btn-excluir"
            onClick={() => handleExcluir(item)}
            title="Excluir"
          >
            <FaTrash className="icone" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="historico-container-banco">
      {/* Modais */}
      {modalEdicaoAberto && (
        <EditarInspecao
          isOpen={modalEdicaoAberto}
          onClose={() => setModalEdicaoAberto(false)}
          inspecao={inspecaoEditando}
          onSalvar={handleSalvarEdicao}
        />
      )}

      {modalDetalheAberto && itemSelecionado && (
        <ModalDetalheGenerico
          isOpen={modalDetalheAberto}
          item={itemSelecionado}
          titulo="Detalhes da Inspeção"
          onClose={() => setModalDetalheAberto(false)}
          onEditar={() => handleEditar(itemSelecionado)}
          onExcluir={() => handleExcluir(itemSelecionado)}
          mostrarHistorico={false}
          mostrarExportar={false}
          mostrarAcoes={true}
        >
          <DetalheInspecao item={itemSelecionado} />
        </ModalDetalheGenerico>
      )}

      <ModalExcluir
        isOpen={modalExclusaoAberto}
        onClose={() => setModalExclusaoAberto(false)}
        onConfirm={handleConfirmarExclusao}
        nomeItem={`${inspecaoExcluindo?.loteMuda} - ${inspecaoExcluindo?.nomePopular}`}
        titulo="Excluir Inspeção"
        mensagem="Tem certeza que deseja excluir esta inspeção?"
      />

      <main>
        <TabelaResponsiva
          titulo="Histórico de Inspeção"
          dados={dados}
          colunas={colunas}
          termoBusca={termoBusca}
          onPesquisar={(valor) => {
            setTermoBusca(valor);
            setPaginaAtual(1);
          }}
          placeholderBusca="Buscar por nome ou lote..."
          onOrdenar={handleOrdenar}
          ordemAtual={ordem}
          direcaoAtual={direcao}
          isLoading={loading}
          footerContent={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Paginacao
                paginaAtual={paginaAtual}
                totalPaginas={totalPaginas}
                onPaginaChange={setPaginaAtual}
              />
              <ExportButton
                onExportPDF={handleExportarPDF}
                onExportCSV={handleExportarCSV}
              />
            </div>
          }
        />
      </main>
    </div>
  );
};

export default HistoricoInspecao;
