import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import FiltrosRelatorio from "../../../components/FiltrosRelatorio/FiltrosRelatorio";
import insumoService from "../../../services/insumoService";
import './HistoricoMaterial.css';

import ModalDetalheGenerico from "../../../components/ModalDetalheGenerico/ModalDetalheGenerico";
import EditarMaterial from "../EditarMaterial/EditarMaterial";
import ModalExcluir from "../../../components/ModalExcluir/ModalExcluir";
import DetalhesMaterial from "./DetalhesMaterial/DetalhesMaterial";

const HistoricoMaterial = () => {
  const [materiais, setMateriais] = useState([]);
  const [dadosOriginais, setDadosOriginais] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [filtros, setFiltros] = useState({
    nomeInsumo: '',
    dataInicio: '',
    dataFim: ''
  });

  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [modalDetalheAberto, setModalDetalheAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  
  const formatarData = (dataIso) => {
    if (!dataIso) return '-';
    const [ano, mes, dia] = dataIso.toString().split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const carregarDados = async () => {
    try {
      setLoading(true);
      const dadosBackend = await insumoService.getHistorico('MATERIAL');
      
      const dadosFormatados = dadosBackend.map(item => ({
        id: item.id,
        NomeInsumo: item.nomeInsumo,
        Data: formatarData(item.data),
        Status: item.status,
        Quantidade: item.quantidade,
        UnidadeMedida: item.unidadeMedida,
        ResponsavelEntrega: item.responsavelEntrega,
        ResponsavelRecebe: item.responsavelRecebe,
        imagem: item.imagem,
        EstoqueMinimo: item.estoqueMinimo // Garanta que o Backend envia isso
      }));

      setMateriais(dadosFormatados);
      setDadosOriginais(dadosFormatados);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      alert("Não foi possível carregar o histórico.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const handleFiltroChange = (name, value) => {
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handlePesquisar = () => {
    const { nomeInsumo, dataInicio, dataFim } = filtros;
    
    const dadosFiltrados = dadosOriginais.filter(item => {
      const matchesNome = !nomeInsumo ||
        item.NomeInsumo.toLowerCase().includes(nomeInsumo.toLowerCase());

      let matchesData = true;
      if (dataInicio || dataFim) {
        const [day, month, year] = item.Data.split('/');
        const itemDate = new Date(`${year}-${month}-${day}`);
        const startDate = dataInicio ? new Date(dataInicio) : null;
        const endDate = dataFim ? new Date(dataFim) : null;

        if (endDate) endDate.setDate(endDate.getDate() + 1);
        
        if(startDate) startDate.setHours(0,0,0,0);
        if(itemDate) itemDate.setHours(0,0,0,0);

        if (startDate && (isNaN(itemDate) || itemDate < startDate)) matchesData = false;
        if (endDate && (isNaN(itemDate) || itemDate >= endDate)) matchesData = false;
      }
      return matchesNome && matchesData;
    });
    setMateriais(dadosFiltrados);
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
    // Atualiza a lista visualmente comparando Strings de ID
    const atualizarLista = (lista) => lista.map(item => {
      if (String(item.id) === String(dadosAtualizados.id)) {
        return { ...item, ...dadosAtualizados };
      }
      return item;
    });

    setMateriais(prev => atualizarLista(prev));
    setDadosOriginais(prev => atualizarLista(prev));
    
    setModalEdicaoAberto(false);
    setItemSelecionado(null);
  };

  const handleConfirmarExclusao = async () => {
    if (itemSelecionado) {
      try {
        await insumoService.excluirMovimentacao(itemSelecionado.id);

        const removerDaLista = (lista) => lista.filter(item => item.id !== itemSelecionado.id);
        setMateriais(prev => removerDaLista(prev));
        setDadosOriginais(prev => removerDaLista(prev));
        
        alert("Movimentação excluída com sucesso!");

      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir o registro.");
      }
    }
    setModalExclusaoAberto(false);
    setItemSelecionado(null);
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
    { key: "ResponsavelEntrega", label: "Resp. Entrega" },
    { key: "ResponsavelRecebe", label: "Resp. Recebe" },
  ];

  return (
    <div className="historico-material-container">
      <div className="header-filtros">
        <h1>Histórico de Movimentação</h1>
        <FiltrosRelatorio
          filtros={filtros}
          onFiltroChange={handleFiltroChange}
          onPesquisar={handlePesquisar}
          buttonText="Pesquisar"
          buttonVariant="success"
          camposFiltro={[
             { name: 'nomeInsumo', label: 'Nome do Insumo', type: 'text' },
             { name: 'dataInicio', label: 'Data Início', type: 'date' },
             { name: 'dataFim', label: 'Data Fim', type: 'date' },
          ]}
        />
      </div>

      <div className="tabela-wrapper">
        {loading ? (
            <p>Carregando dados...</p>
        ) : (
            <TabelaComBuscaPaginacao
              titulo="Histórico de Movimentação de Materiais"
              dados={materiais}
              colunas={colunas}
              chaveBusca="NomeInsumo"
              mostrarBusca={true}
              mostrarAcoes={true}
              onEditar={handleEditar}
              onExcluir={handleExcluir}
              onConfirmar={handleVisualizar}
            />
        )}
      </div>

      <ModalDetalheGenerico
        isOpen={modalDetalheAberto}
        item={itemSelecionado} 
        titulo="Detalhes"
        camposDetalhes={[]} 
        onClose={handleFecharModalDetalhe}
        onEditar={() => handleEditar(itemSelecionado)}
        onExcluir={() => handleExcluir(itemSelecionado)}
        mostrarHistorico={false}
        mostrarExportar={false}
        mostrarAcoes={true}
      >
        <DetalhesMaterial item={itemSelecionado} />
      </ModalDetalheGenerico>
     
      <EditarMaterial
        isOpen={modalEdicaoAberto}
        onClose={handleCancelarEdicao}
        // --- AQUI ESTAVA O ERRO: mudado de onSave para onSalvar ---
        onSalvar={handleSalvarEdicao} 
        itemParaEditar={itemSelecionado} 
      />

      <ModalExcluir
        isOpen={modalExclusaoAberto}
        onClose={handleCancelarExclusao}
        onConfirm={handleConfirmarExclusao}
        nomeItem={itemSelecionado?.NomeInsumo}
        titulo="Confirmar Exclusão"
        mensagem="Deseja excluir esta movimentação?"
        textoConfirmar="Excluir"
        textoCancelar="Cancelar"
      />
    </div>
  );
};

export default HistoricoMaterial;