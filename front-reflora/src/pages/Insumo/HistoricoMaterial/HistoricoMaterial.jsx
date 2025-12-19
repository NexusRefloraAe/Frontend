import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import FiltrosRelatorio from "../../../components/FiltrosRelatorio/FiltrosRelatorio"; // 👈 Importado
import insumoService from "../../../services/insumoService";
import './HistoricoMaterial.css';

import ModalDetalheGenerico from "../../../components/ModalDetalheGenerico/ModalDetalheGenerico"; // 👈 Importado
import EditarMaterial from "../EditarMaterial/EditarMaterial";
import ModalExcluir from "../../../components/ModalExcluir/ModalExcluir";
import DetalhesMaterial from "./DetalhesMaterial/DetalhesMaterial";

const HistoricoMaterial = () => {
  const [materiais, setMateriais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    nomeInsumo: '', // 👈 Filtro específico
    dataInicio: '',
    dataFim: ''
  });

  // Estados unificados para controlar os modais (padrão Historico.jsx)
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [modalDetalheAberto, setModalDetalheAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  
  // Carregar dados do backend
  const carregarDados = async () => {
    try {
      setLoading(true);
      const dados = await insumoService.getHistorico('MATERIAL');
      setMateriais(dados);
    } catch (error) {
      console.error("Erro ao carregar histórico de materiais:", error);
      alert("Não foi possível carregar o histórico de materiais.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  // Lógica de Filtro (padrão Historico.jsx)
  const handleFiltroChange = (name, value) => {
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handlePesquisar = () => {
    const { nomeInsumo, dataInicio, dataFim } = filtros;
    const dadosFiltrados = materiais.filter(item => {
      const matchesNome = !nomeInsumo ||
        item.NomeInsumo.toLowerCase().includes(nomeInsumo.toLowerCase());

      let matchesData = true;
      if (dataInicio || dataFim) {
        // Assume formato DD/MM/AAAA. Ajuste se necessário.
        const [day, month, year] = item.Data.split('/');
        const itemDate = new Date(`${year}-${month}-${day}`);
        const startDate = dataInicio ? new Date(dataInicio) : null;
        const endDate = dataFim ? new Date(dataFim) : null;

        // Adiciona 1 dia ao endDate para incluir o dia final na busca
        if (endDate) endDate.setDate(endDate.getDate() + 1);

        if (startDate && (isNaN(itemDate) || itemDate < startDate)) matchesData = false;
        if (endDate && (isNaN(itemDate) || itemDate >= endDate)) matchesData = false;
      }
      return matchesNome && matchesData;
    });
    setMateriais(dadosFiltrados);
  };

  // Handlers unificados para abrir os modais (padrão Historico.jsx)
  const handleVisualizar = (item) => {
    setItemSelecionado(item);
    setModalDetalheAberto(true);
  };

  const handleEditar = (item) => {
    setItemSelecionado(item);
    setModalDetalheAberto(false); // Fecha o de detalhe se estiver aberto
    setModalEdicaoAberto(true);
  };

  const handleExcluir = (item) => {
    setItemSelecionado(item);
    setModalDetalheAberto(false); // Fecha o de detalhe se estiver aberto
    setModalExclusaoAberto(true);
  };

  // Handlers para fechar/salvar (padrão Historico.jsx)
  const handleFecharModalDetalhe = () => {
    setModalDetalheAberto(false);
    setItemSelecionado(null);
  };

  const handleSalvarEdicao = (dadosAtualizados) => {
    setMateriais(prev =>
      prev.map(item =>
        // Assume que 'dadosAtualizados' contém o 'id'
        item.id === dadosAtualizados.id ? dadosAtualizados : item
      )
    );
    setModalEdicaoAberto(false);
    setItemSelecionado(null);
  };

  const handleConfirmarExclusao = () => {
    if (itemSelecionado) {
      setMateriais(prev =>
        prev.filter(item => item.id !== itemSelecionado.id) // Usa o ID
      );
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
    { key: "ResponsavelEntrega", label: "Responsável pela Entrega" },
    { key: "ResponsavelRecebe", label: "Responsável por Receber" },
  ];



  return (
    <div className="historico-material-container">
      {/* Layout de Filtros (padrão Historico.jsx) */}
      <div className="header-filtros">
        <h1>Histórico de Movimentação</h1>
        <FiltrosRelatorio
          filtros={filtros}
          onFiltroChange={handleFiltroChange}
          onPesquisar={handlePesquisar}
          buttonText="Pesquisar"
          buttonVariant="success"
          // Passa os campos de filtro específicos para este componente
          camposFiltro={[
             { name: 'nomeInsumo', label: 'Nome do Insumo', type: 'text' },
             { name: 'dataInicio', label: 'Data Início', type: 'date' },
             { name: 'dataFim', label: 'Data Fim', type: 'date' },
          ]}
        />
      </div>

      <div className="tabela-wrapper">
        <TabelaComBuscaPaginacao
          titulo="Histórico de Movimentação de Materiais"
          dados={materiais}
          colunas={colunas}
          chaveBusca="NomeInsumo"
          mostrarBusca={true}
          mostrarAcoes={true}

          // Handlers atualizados
          onEditar={handleEditar}
          onExcluir={handleExcluir}
          onConfirmar={handleVisualizar} // 👈 'onConfirmar' chama 'handleVisualizar'
        />
      </div>

      {/* Renderização dos 3 modais */}

      {/* MODAL DE DETALHES (Visualizar) - (padrão Historico.jsx) */}
      
        <ModalDetalheGenerico
          isOpen={modalDetalheAberto}
          item={itemSelecionado} 
          titulo="Detalhes da Movimentação"
          
          // Usa 'camposDetalhes' para renderizar os dados
          camposDetalhes={[]} 

          onClose={handleFecharModalDetalhe}
          onEditar={() => handleEditar(itemSelecionado)}
          onExcluir={() => handleExcluir(itemSelecionado)}

          // Configurações visuais
          mostrarHistorico={false}
          mostrarExportar={false}
          mostrarAcoes={true}
        >
          <DetalhesMaterial item={itemSelecionado} />
        </ModalDetalheGenerico>
     
      {/* MODAL DE EDIÇÃO */}
      <EditarMaterial
        isOpen={modalEdicaoAberto}
        onClose={handleCancelarEdicao}
        onSave={handleSalvarEdicao}
        // Prop renomeada para consistência (antes era 'material')
        itemParaEditar={itemSelecionado} 
      />

      {/* MODAL DE EXCLUSÃO */}
      <ModalExcluir
        isOpen={modalExclusaoAberto}
        onClose={handleCancelarExclusao}
        onConfirm={handleConfirmarExclusao}
        nomeItem={itemSelecionado?.NomeInsumo} // Usa 'itemSelecionado'
        titulo="Confirmar Exclusão"
        mensagem={`Tem certeza que deseja excluir a movimentação do insumo "${itemSelecionado?.NomeInsumo}"?`}
        textoConfirmar="Excluir"
        textoCancelar="Cancelar"
      />
    </div>
  );
};

export default HistoricoMaterial;