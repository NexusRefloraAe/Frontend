import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import FiltrosRelatorio from "../../../components/FiltrosRelatorio/FiltrosRelatorio";
import './Historico.css';

import ModalDetalheGenerico from "../../../components/ModalDetalheGenerico/ModalDetalheGenerico";
import DetalheVistoria from "../DetalheVistoria/DetalheVistoria";
import EditarVistoria from "../EditarVistoria/EditarVistoria";
import ModalExcluir from "../../../components/ModalExcluir/ModalExcluir";

const Historico = () => {

  const DADOS_VISTORIAS_MOCK = [
    {
      id: 1, 
      Lote: 'A001',
      NomePopular: 'Ipê-amarelo',
      DataVistoria: '20/05/2025',
      Status: 'Vistoria Cadastrada',
      Usuario: 'Antônio Bezerra Santos',
      Responsavel: 'Carlos Silva',
      LocalizacaoColeta: 'Araruna (-6.558, -35.742)',
      EstimativaMudas: 700,
      TratosCulturais: 'Adubação, Regação',
      PragasDoencas: 'Nenhuma',
      Observacoes: 'Lorem ipsum dolor sit amet...',
      imagem: '' // 👈 URL da imagem
    },
    {
      id: 2, 
      Lote: 'A001',
      NomePopular: 'Ipê-amarelo',
      DataVistoria: '15/05/2025',
      Status: 'Vistoria Atualizada',
      Usuario: 'Maria Silva',
      Responsavel: 'Ana Costa',
      LocalizacaoColeta: 'Araruna (-6.558, -35.742)',
      EstimativaMudas: 650,
      TratosCulturais: 'Rega',
      PragasDoencas: 'Nenhuma',
      Observacoes: 'Vistoria de acompanhamento.',
      imagem: '' // 👈 URL da imagem
    },
    {
      id: 3, // 👈 id adicionado
      Lote: 'A002',
      NomePopular: 'Ipê-rosa',
      DataVistoria: '18/05/2025',
      Status: 'Vistoria Cadastrada',
      Usuario: 'João Pereira',
      Responsavel: 'Pedro Santos',
      LocalizacaoColeta: 'Campina Grande (-7.230, -35.881)',
      EstimativaMudas: 500,
      TratosCulturais: 'Rega',
      PragasDoencas: 'Nenhuma',
      Observacoes: 'Lote inicial.',
      imagem: '' // 👈 URL da imagem
    },
    {
      id: 4, // 👈 id adicionado
      Lote: 'A003',
      NomePopular: 'Ipê-branco',
      DataVistoria: '22/05/2025',
      Status: 'Vistoria Cadastrada',
      Usuario: 'Ana Costa',
      Responsavel: 'Mariana Lima',
      LocalizacaoColeta: 'Solânea (-6.755, -35.699)',
      EstimativaMudas: 800,
      TratosCulturais: 'Adubação',
      PragasDoencas: 'Nenhuma',
      Observacoes: 'Aguardando desenvolvimento.',
      imagem: '' // 👈 URL da imagem
    },
    {
      id: 5, // 👈 id adicionado
      Lote: 'A002',
      NomePopular: 'Ipê-rosa',
      DataVistoria: '25/05/2025',
      Status: 'Vistoria Atualizada',
      Usuario: 'Carlos Santos',
      Responsavel: 'Pedro Santos',
      LocalizacaoColeta: 'Campina Grande (-7.230, -35.881)',
      EstimativaMudas: 480,
      TratosCulturais: 'Rega',
      PragasDoencas: 'Pulgão',
      Observacoes: 'Perda de 20 mudas.',
      imagem: '' // 👈 URL da imagem
    },
    {
      id: 6, // 👈 id adicionado
      Lote: 'A004',
      NomePopular: 'Pau-brasil',
      DataVistoria: '28/05/2025',
      Status: 'Vistoria Cadastrada',
      Usuario: 'Fernanda Lima',
      Responsavel: 'Roberto Alves',
      LocalizacaoColeta: 'Bananeiras (-6.750, -35.633)',
      EstimativaMudas: 300,
      TratosCulturais: 'Adubação e Rega',
      PragasDoencas: 'Nenhuma',
      Observacoes: 'Ok.',
      imagem: '' // 👈 URL da imagem
    },
    {
      id: 7, // 👈 id adicionado
      Lote: 'A003',
      NomePopular: 'Ipê-branco',
      DataVistoria: '30/05/2025',
      Status: 'Vistoria Atualizada',
      Usuario: 'Roberto Alves',
      Responsavel: 'Mariana Lima',
      LocalizacaoColeta: 'Solânea (-6.755, -35.699)',
      EstimativaMudas: 750,
      TratosCulturais: 'Adubação',
      PragasDoencas: 'Nenhuma',
      Observacoes: 'Desenvolvimento bom.',
      imagem: '' // 👈 URL da imagem
    },
    {
      id: 8, // 👈 id adicionado
      Lote: 'A005',
      NomePopular: 'Jacarandá',
      DataVistoria: '02/06/2025',
      Status: 'Vistoria Cadastrada',
      Usuario: 'Patrícia Souza',
      Responsavel: 'José Oliveira',
      LocalizacaoColeta: 'Cuité (-6.483, -36.153)',
      EstimativaMudas: 1000,
      TratosCulturais: 'Rega',
      PragasDoencas: 'Nenhuma',
      Observacoes: 'Lote novo.',
      imagem: '' // 👈 URL da imagem
    },
    {
      id: 9, // 👈 id adicionado
      Lote: 'A001',
      NomePopular: 'Ipê-amarelo',
      DataVistoria: '05/06/2025',
      Status: 'Vistoria Finalizada',
      Usuario: 'Antônio Bezerra Santos',
      Responsavel: 'Carlos Silva',
      LocalizacaoColeta: 'Araruna (-6.558, -35.742)',
      EstimativaMudas: 640,
      TratosCulturais: 'Rega',
      PragasDoencas: 'Nenhuma',
      Observacoes: 'Lote finalizado.',
      imagem: '' // 👈 URL da imagem
    },
    {
      id: 10, // 👈 id adicionado
      Lote: 'A004',
      NomePopular: 'Pau-brasil',
      DataVistoria: '08/06/2025',
      Status: 'Vistoria Atualizada',
      Usuario: 'Fernanda Lima',
      Responsavel: 'Roberto Alves',
      LocalizacaoColeta: 'Bananeiras (-6.750, -35.633)',
      EstimativaMudas: 290,
      TratosCulturais: 'Adubação',
      PragasDoencas: 'Nenhuma',
      Observacoes: 'Ok.',
      imagem: '' // 👈 URL da imagem
    },
    {
      id: 11, // 👈 id adicionado
      Lote: 'A006',
      NomePopular: 'Cedro-rosa',
      DataVistoria: '10/06/2025',
      Status: 'Vistoria Cadastrada',
      Usuario: 'Ricardo Oliveira',
      Responsavel: 'Paula Torres',
      LocalizacaoColeta: 'Dona Inês (-6.615, -35.621)',
      EstimativaMudas: 500,
      TratosCulturais: 'Rega',
      PragasDoencas: 'Nenhuma',
      Observacoes: 'Novo lote.',
      imagem: '' // 👈 URL da imagem
    },
    {
      id: 12, // 👈 id adicionado
      Lote: 'A002',
      NomePopular: 'Ipê-rosa',
      DataVistoria: '12/06/2025',
      Status: 'Vistoria Finalizada',
      Usuario: 'Carlos Santos',
      Responsavel: 'Pedro Santos',
      LocalizacaoColeta: 'Campina Grande (-7.230, -35.881)',
      EstimativaMudas: 450,
      TratosCulturais: 'Rega',
      PragasDoencas: 'Nenhuma',
      Observacoes: 'Lote finalizado.',
      imagem: '' // 👈 URL da imagem
    },
  
  ];

  const [vistorias, setVistorias] = useState([]);
  const [filtros, setFiltros] = useState({
    nomePopular: '',
    dataInicio: '',
    dataFim: ''
  });

  // Estados unificados para controlar os modais
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [modalDetalheAberto, setModalDetalheAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);

  useEffect(() => {
    setVistorias(DADOS_VISTORIAS_MOCK);
  }, []);

  const handleFiltroChange = (name, value) => {
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handlePesquisar = () => {
    const { nomePopular, dataInicio, dataFim } = filtros;
    const dadosFiltrados = DADOS_VISTORIAS_MOCK.filter(item => {
      const matchesNome = !nomePopular ||
        item.NomePopular.toLowerCase().includes(nomePopular.toLowerCase());

      let matchesData = true;
      if (dataInicio || dataFim) {
        const [day, month, year] = item.DataVistoria.split('/');
        const itemDate = new Date(`${year}-${month}-${day}`);
        const startDate = dataInicio ? new Date(dataInicio) : null;
        const endDate = dataFim ? new Date(dataFim) : null;
        if (startDate && (isNaN(itemDate) || itemDate < startDate)) matchesData = false;
        if (endDate && (isNaN(itemDate) || itemDate > endDate)) matchesData = false;
      }
      return matchesNome && matchesData;
    });
    setVistorias(dadosFiltrados);
  };

  // Handlers unificados para abrir os modais
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

  // Handlers para fechar/salvar
  const handleFecharModalDetalhe = () => {
    setModalDetalheAberto(false);
    setItemSelecionado(null);
  };

  const handleSalvarEdicao = (dadosAtualizados) => {
    setVistorias(prev =>
      prev.map(item =>
        item.id === dadosAtualizados.id ? dadosAtualizados : item
      )
    );
    setModalEdicaoAberto(false);
    setItemSelecionado(null);
  };

  const handleConfirmarExclusao = () => {
    if (itemSelecionado) {
      setVistorias(prev =>
        prev.filter(item => item.id !== itemSelecionado.id)
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
    { key: "Lote", label: "Lote" },
    { key: "NomePopular", label: "Nome Popular" },
    { key: "DataVistoria", label: "Data da Vistoria" },
    { key: "Status", label: "Status" },
    { key: "Usuario", label: "Usuário" },
    { key: "Responsavel", label: "Responsável" },
    { key: "LocalizacaoColeta", label: "Localização da Coleta" }
  ];

  return (
    <div className="historico-container">
      <div className="header-filtros">
        <h1>Histórico de Vistorias</h1>
        <FiltrosRelatorio
          filtros={filtros}
          onFiltroChange={handleFiltroChange}
          onPesquisar={handlePesquisar}
          buttonText="Pesquisar"
          buttonVariant="success"
        />
      </div>

      <div className="tabela-wrapper">
        <TabelaComBuscaPaginacao
          titulo="Histórico de Vistorias"
          dados={vistorias}
          colunas={colunas}
          chaveBusca="NomePopular"
          mostrarBusca={true}
          mostrarAcoes={true}

          onEditar={handleEditar}
          onExcluir={handleExcluir}
          onConfirmar={handleVisualizar} // 👈 'onConfirmar' chama 'handleVisualizar'
        />
      </div>

      {/* Renderização dos 3 modais */}

      {/* MODAL DE DETALHES (Visualizar) */}
      {modalDetalheAberto && itemSelecionado && (
        <ModalDetalheGenerico
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
      <EditarVistoria
        isOpen={modalEdicaoAberto}
        onClose={handleCancelarEdicao}
        onSave={handleSalvarEdicao}
        itemParaEditar={itemSelecionado}
      />

      {/* MODAL DE EXCLUSÃO */}
      <ModalExcluir
        isOpen={modalExclusaoAberto}
        onClose={handleCancelarExclusao}
        onConfirm={handleConfirmarExclusao}
        nomeItem={itemSelecionado?.Lote}
        titulo="Confirmar Exclusão"
        mensagem={`Tem certeza que deseja excluir a vistoria do lote "${itemSelecionado?.Lote}"?`}
        textoConfirmar="Excluir"
        textoCancelar="Cancelar"
      />
    </div>
  );
};

export default Historico;