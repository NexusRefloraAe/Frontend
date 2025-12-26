import React, { useState, useEffect, useCallback } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import FiltrosRelatorio from "../../../components/FiltrosRelatorio/FiltrosRelatorio";
import "./Historico.css";
import { vistoriaService } from "../../../services/vistoriaService";

import { getBackendErrorMessage } from "../../../utils/errorHandler";
import ModalDetalheGenerico from "../../../components/ModalDetalheGenerico/ModalDetalheGenerico";
import DetalheVistoria from "../DetalheVistoria/DetalheVistoria";
import EditarVistoria from "../EditarVistoria/EditarVistoria";
import ModalExcluir from "../../../components/ModalExcluir/ModalExcluir";

const Historico = () => {
  const [filtros, setFiltros] = useState({
    nomePopular: "",
    dataInicio: "",
    dataFim: "",
  });

  // Estados unificados para controlar os modais
  const [dados, setDados] = useState([]);
  const [vistoriaEditando, setVistoriaEditando] = useState(null);
  const [vistoriaExcluindo, setVistoriaExcluindo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [modalDetalheAberto, setModalDetalheAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [itensPorPagina, setItensPorPagina] = useState(5);
  const [termoBusca, setTermoBusca] = useState("");

  const carregarDados = useCallback(
    async (paginaDestino) => {
      setLoading(true);
      try {
        const response = await vistoriaService.getAll(
          paginaDestino - 1,
          itensPorPagina
        );
        setDados(response.content || []);

        if (response.page) {
          setTotalPaginas(response.page.totalPages);
          setPaginaAtual(response.page.number + 1);
        }
      } catch (error) {
        console.error("Erro ao carregar vistorias:", error);
        const msg = getBackendErrorMessage(error);
        alert(msg);
      } finally {
        setLoading(false);
      }
    },
    [itensPorPagina]
  );

  useEffect(() => {
    carregarDados(paginaAtual);
  }, [paginaAtual, carregarDados]);

  const handleFiltroChange = (name, value) => {
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  // const handlePesquisar = () => {
  //   const { nomePopular, dataInicio, dataFim } = filtros;
  //   const dadosFiltrados = DADOS_VISTORIAS_MOCK.filter(item => {
  //     const matchesNome = !nomePopular ||
  //       item.NomePopular.toLowerCase().includes(nomePopular.toLowerCase());

  //     let matchesData = true;
  //     if (dataInicio || dataFim) {
  //       const [day, month, year] = item.DataVistoria.split('/');
  //       const itemDate = new Date(`${year}-${month}-${day}`);
  //       const startDate = dataInicio ? new Date(dataInicio) : null;
  //       const endDate = dataFim ? new Date(dataFim) : null;
  //       if (startDate && (isNaN(itemDate) || itemDate < startDate)) matchesData = false;
  //       if (endDate && (isNaN(itemDate) || itemDate > endDate)) matchesData = false;
  //     }
  //     return matchesNome && matchesData;
  //   });
  //   setVistorias(dadosFiltrados);
  // };

  // Handlers unificados para abrir os modais
  const handleVisualizar = async (item) => {
    try {
      setLoading(true);
      const dadosCompletos = await vistoriaService.getById(item.id);
      setItemSelecionado(dadosCompletos);
      setModalDetalheAberto(true);
    } catch (error) {
      console.error("Erro ao carregar detalhes:", error);
      alert("Não foi possível carregar os detalhes da vistoria.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (item) => {
    setVistoriaEditando(item);
    setModalEdicaoAberto(true);

    setModalDetalheAberto(false);
  };

  const handleExcluir = (item) => {
    setVistoriaExcluindo(item);
    setModalExclusaoAberto(true);

    setModalDetalheAberto(false);
  };

  // Handlers para fechar/salvar
  const handleFecharModalDetalhe = () => {
    setModalDetalheAberto(false);
    setItemSelecionado(null);
  };

  const handlePesquisar = (termo) => {
    setTermoBusca(termo);
    setPaginaAtual(1);
    // Aqui você poderia chamar carregarDados(1, termo) se o back aceitasse busca
  };

  const handleSalvarEdicao = async (dadosAtualizados) => {
    try {
      setLoading(true);
      await vistoriaService.update(vistoriaEditando.id, dadosAtualizados);

      setModalEdicaoAberto(false);
      carregarDados(paginaAtual);
      alert("Vistoria atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      const msg = getBackendErrorMessage(error);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmarExclusao = async () => {
    if (!vistoriaExcluindo) return;

    try {
      setLoading(true);
      await vistoriaService.delete(vistoriaExcluindo.id);

      alert("Vistoria removida com sucesso!");

      // Lógica para retroceder página se deletar o último item
      if (dados.length === 1 && paginaAtual > 1) {
        setPaginaAtual((prev) => prev - 1); // O useEffect chamará carregarDados
      } else {
        await carregarDados(paginaAtual); // Recarrega a mesma página
      }

      setModalExclusaoAberto(false);
      setVistoriaExcluindo(null);
    } catch (error) {
      console.error("Erro ao excluir: ", error);
      alert("Erro ao excluir.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarEdicao = () => {
    setModalEdicaoAberto(false);
    setItemSelecionado(null);
  };

  const handleCancelarExclusao = () => {
    setModalExclusaoAberto(false);
    setItemSelecionado(null);
  };

  // const handleBuscaChange = (termo) => {
  //   setTermoBusca(termo);
  //   setPaginaAtual(1);
  // };

  const handleMudarPagina = (novaPagina) => {
    setPaginaAtual(novaPagina);
  };

  const colunas = [
    { key: "loteMuda", label: "Lote" },
    { key: "nomeCanteiro", label: "Nome do Local" },
    { key: "dataVistoria", label: "Data da Vistoria" },
    { key: "tratosCulturais", label: "Tratos Culturais" },
    { key: "doencasPragas", label: "Pragas/Doenças" },
    { key: "estadoSaude", label: "Estado de Saúde" },
    { key: "estimativaMudasProntas", label: "Qntd" },
    { key: "nomeResponsavel", label: "Nome do Responsável" },
  ];

  return (
    <div className="historico-container">
      <div className="header-filtros">
        <h1>Histórico de Vistorias</h1>
        <FiltrosRelatorio
          filtros={filtros}
          onFiltroChange={handleFiltroChange}
          //onPesquisar={handlePesquisar}
          buttonText="Pesquisar"
          buttonVariant="success"
        />
      </div>

      <div className="tabela-wrapper">
        <TabelaComBuscaPaginacao
          titulo="Histórico de Vistorias"
          dados={dados}
          colunas={colunas}
          chaveBusca="nomePopular"
          habilitarBusca={true}
          isLoading={loading}
          mostrarBusca={true}
          mostrarAcoes={true}
          onPesquisar={handlePesquisar}
          onEditar={handleEditar}
          onExcluir={handleExcluir}
          onVisualizar={handleVisualizar} // 👈 'onConfirmar' chama 'handleVisualizar'
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          onPaginaChange={handleMudarPagina}
          itensPorPagina={itensPorPagina}
          onItensPorPaginaChange={setItensPorPagina}
          termoBusca={termoBusca}
        />
      </div>

      {/* Renderização dos 3 modais */}

      {/* MODAL DE DETALHES (Visualizar) */}
      {modalDetalheAberto && itemSelecionado && (
        <ModalDetalheGenerico
          isOpen={modalDetalheAberto}
          item={itemSelecionado} // Passa o item (para pegar a 'item.imagem')
          titulo="Detalhes da Vistoria"
          camposDetalhes={[]} // Deixamos vazio para usar o 'children'
          onClose={handleFecharModalDetalhe}
          onEditar={() => handleEditar(itemSelecionado)}
          onExcluir={() => handleExcluir(itemSelecionado)}
          // Configurado como na imagem
          mostrarHistorico={false}
          mostrarExportar={false}
          mostrarAcoes={true}
        >
          {/* Passa o componente customizado como 'children' */}
          <DetalheVistoria item={itemSelecionado} />
        </ModalDetalheGenerico>
      )}

      {/* MODAL DE EDIÇÃO */}
      {modalEdicaoAberto && (
        <EditarVistoria
          isOpen={modalEdicaoAberto}
          onClose={handleCancelarEdicao}
          onSave={handleSalvarEdicao}
          itemParaEditar={vistoriaEditando}
        />
      )}

      {/* MODAL DE EXCLUSÃO */}
      <ModalExcluir
        isOpen={modalExclusaoAberto}
        onClose={handleCancelarExclusao}
        onConfirm={handleConfirmarExclusao}
        nomeItem={vistoriaExcluindo?.loteMuda}
        titulo="Confirmar Exclusão"
        mensagem={`Tem certeza que deseja excluir a vistoria do lote "${vistoriaExcluindo?.loteMuda}"?`}
        textoConfirmar="Excluir"
        textoCancelar="Cancelar"
      />
    </div>
  );
};

export default Historico;
