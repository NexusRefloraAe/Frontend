import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import FiltrosRelatorio from "../../../components/FiltrosRelatorio/FiltrosRelatorio";
import "./HistoricoFerramenta.css";
import insumoService from "../../../services/insumoService"; // Importação do service

import ModalDetalheGenerico from "../../../components/ModalDetalheGenerico/ModalDetalheGenerico";
import EditarFerramenta from "../EditarFerramenta/EditarFerramenta";
import ModalExcluir from "../../../components/ModalExcluir/ModalExcluir";
import DetalhesFerramenta from "./DetalhesFerramenta/DetalhesFerramenta";

const HistoricoFerramenta = () => {
  const [ferramentas, setFerramentas] = useState([]);
  const [dadosOriginais, setDadosOriginais] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtros, setFiltros] = useState({
    nomeInsumo: "",
    dataInicio: "",
    dataFim: "",
  });

  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [modalDetalheAberto, setModalDetalheAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);

  const formatarData = (data) => {
    if (!data) return "-";

    // 1. Se o Back-end enviou como Array [2025, 2, 2] (Padrão Java LocalDate)
    if (Array.isArray(data)) {
      const [ano, mes, dia] = data;
      return `${dia.toString().padStart(2, "0")}/${mes
        .toString()
        .padStart(2, "0")}/${ano}`;
    }

    // 2. Se for uma String
    if (typeof data === "string") {
      // Se já tiver barras (ex: 02/02/2025), retorna ela mesma
      if (data.includes("/")) return data;

      // Se for formato ISO com hífens (ex: 2025-02-02)
      if (data.includes("-")) {
        const parts = data.split("T")[0].split("-"); // Remove o tempo se houver
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }

    return data.toString();
  };

  const carregarDados = async () => {
    try {
      setLoading(true);
      const dadosBackend = await insumoService.getHistorico("FERRAMENTA");

      const dadosFormatados = dadosBackend.map((item) => ({
        id: item.id,
        NomeInsumo: item.nomeInsumo,
        Data: formatarData(item.data),
        Status: item.status,
        Quantidade: item.quantidade,
        UnidadeMedida: item.unidadeMedida,
        ResponsavelEntrega: item.responsavelEntrega,
        ResponsavelRecebe: item.responsavelRecebe,
        imagem: item.imagem,
      }));

      setFerramentas(dadosFormatados);
      setDadosOriginais(dadosFormatados);
    } catch (error) {
      console.error("Erro ao carregar histórico de ferramentas:", error);
      alert("Não foi possível carregar o histórico de ferramentas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleFiltroChange = (name, value) => {
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handlePesquisar = () => {
    const { nomeInsumo, dataInicio, dataFim } = filtros;

    const dadosFiltrados = dadosOriginais.filter((item) => {
      const matchesNome =
        !nomeInsumo ||
        item.NomeInsumo.toLowerCase().includes(nomeInsumo.toLowerCase());

      let matchesData = true;
      if (dataInicio || dataFim) {
        const [day, month, year] = item.Data.split("/");
        const itemDate = new Date(`${year}-${month}-${day}`);

        const startDate = dataInicio ? new Date(dataInicio) : null;
        const endDate = dataFim ? new Date(dataFim) : null;

        if (endDate) endDate.setDate(endDate.getDate() + 1);

        if (startDate) startDate.setHours(0, 0, 0, 0);
        if (itemDate) itemDate.setHours(0, 0, 0, 0);

        if (startDate && (isNaN(itemDate) || itemDate < startDate))
          matchesData = false;
        if (endDate && (isNaN(itemDate) || itemDate >= endDate))
          matchesData = false;
      }
      return matchesNome && matchesData;
    });
    setFerramentas(dadosFiltrados);
  };

  const handleVisualizar = (item) => {
    setItemSelecionado(item);
    setModalDetalheAberto(true);
  };

  const handleEditar = (item) => {
    setItemSelecionado(item);
    setModalDetalheAberto(false);
    setModalEdicaoAberto(true);
  };

  const handleExcluir = (item) => {
    setItemSelecionado(item);
    setModalDetalheAberto(false);
    setModalExclusaoAberto(true);
  };

  const handleFecharModalDetalhe = () => {
    setModalDetalheAberto(false);
    setItemSelecionado(null);
  };

  const handleSalvarEdicao = (dadosAtualizados) => {
    const atualizarLista = (lista) =>
      lista.map((item) =>
        item.id === dadosAtualizados.id ? dadosAtualizados : item
      );

    setFerramentas((prev) => atualizarLista(prev));
    setDadosOriginais((prev) => atualizarLista(prev));

    setModalEdicaoAberto(false);
    setItemSelecionado(null);
  };

  // --- FUNÇÃO DE EXCLUSÃO CORRIGIDA ---
  const handleConfirmarExclusao = async () => {
    if (itemSelecionado) {
      try {
        // Chama o backend
        await insumoService.excluirMovimentacao(itemSelecionado.id);

        // Atualiza o estado local
        const removerDaLista = (lista) =>
          lista.filter((item) => item.id !== itemSelecionado.id);

        setFerramentas((prev) => removerDaLista(prev));
        setDadosOriginais((prev) => removerDaLista(prev));

        alert("Movimentação excluída com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir o registro. Tente novamente.");
      }
    }
    setModalExclusaoAberto(false);
    setItemSelecionado(null);
  };

  const handleExportar = async (formato) => {
    // Prepara os parâmetros baseados nos seus estados de filtro
    const params = {
      tipoInsumo: "FERRAMENTA", // Hardcoded pois este é o histórico de ferramentas
      dataInicio: filtros.dataInicio || null,
      dataFim: filtros.dataFim || null,
    };

    try {
      if (formato === "pdf") {
        await insumoService.downloadPdf(params);
      } else {
        await insumoService.downloadCsv(params);
      }
    } catch (error) {
      console.error(`Erro ao exportar ${formato}:`, error);
      alert("Erro ao gerar o arquivo. Verifique a conexão com o servidor.");
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

  const colunas = [
    { key: "NomeInsumo", label: "Nome do Insumo" },
    { key: "Data", label: "Data" },
    { key: "Status", label: "Status" },
    { key: "Quantidade", label: "Quantidade" },
    { key: "UnidadeMedida", label: "Unidade de Medida" },
    { key: "ResponsavelEntrega", label: "Responsável pela Entrega" },
    { key: "ResponsavelRecebe", label: "Responsável por Receber" },
  ];

  return (
    <div className="layout-scroll">
    <div className="historico-ferramenta-container">
      <div className="header-filtros">
        <h1>Histórico de Movimentação</h1>
        <FiltrosRelatorio
          filtros={filtros}
          onFiltroChange={handleFiltroChange}
          onPesquisar={handlePesquisar}
          buttonText="Pesquisar"
          buttonVariant="success"
          mostrarNomeInsumo={true}
          campoTexto={{
              label: "Nome do Insumo",
              name: "nomeInsumo",
              placeholder: "Digite o nome do insumo",

            }}
          camposFiltro={[
            { name: "nomeInsumo", label: "Nome da Ferramenta", type: "text" },
            { name: "dataInicio", label: "Data Início", type: "date" },
            { name: "dataFim", label: "Data Fim", type: "date" },
          ]}
        />
      </div>

      <div className="tabela-wrapper">
        {loading ? (
          <p>Carregando dados...</p>
        ) : (
          <TabelaComBuscaPaginacao
            titulo="Histórico de Movimentação de Ferramentas"
            dados={ferramentas}
            colunas={colunas}
            chaveBusca="NomeInsumo"
            mostrarBusca={true}
            mostrarAcoes={true}
            onEditar={handleEditar}
            onConfirmar={handleVisualizar}
            onExcluir={handleExcluir}
            onExportPDF={() => handleExportar("pdf")}
            onExportCSV={() => handleExportar("csv")}
          />
        )}
      </div>

      <ModalDetalheGenerico
        isOpen={modalDetalheAberto}
        item={itemSelecionado}
        titulo="Detalhes da Movimentação"
        camposDetalhes={[]}
        onClose={handleFecharModalDetalhe}
        onEditar={() => handleEditar(itemSelecionado)}
        onExcluir={() => handleExcluir(itemSelecionado)}
        mostrarHistorico={false}
        mostrarExportar={false}
        mostrarAcoes={true}
        mostrarImagem={false}
      >
        <DetalhesFerramenta item={itemSelecionado} />
      </ModalDetalheGenerico>

      <EditarFerramenta
        isOpen={modalEdicaoAberto}
        onClose={handleCancelarEdicao}
        onSalvar={handleSalvarEdicao}
        itemParaEditar={itemSelecionado}
      />

      <ModalExcluir
        isOpen={modalExclusaoAberto}
        onClose={handleCancelarExclusao}
        onConfirm={handleConfirmarExclusao}
        nomeItem={itemSelecionado?.NomeInsumo}
        titulo="Excluir Ferramenta"
        mensagem={`Tem certeza que deseja excluir "${itemSelecionado?.NomeInsumo}" do histórico? Esta ação não pode ser desfeita.`}
        textoConfirmar="Excluir"
        textoCancelar="Cancelar"
      />
    </div>
    </div>
  );
};

export default HistoricoFerramenta;
