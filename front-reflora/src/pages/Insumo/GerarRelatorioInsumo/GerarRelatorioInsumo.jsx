import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import FiltrosRelatorio from "../../../components/FiltrosRelatorio/FiltrosRelatorio";
import './GerarRelatorioInsumo.css';

const GerarRelatorioInsumo = () => {
  // Dados mock CORRIGIDOS conforme a imagem
  const DADOS_MATERIAIS_MOCK = [
    { NomeInsumo: 'Ecritifizante', Data: '11/09/2025', EstoqueAtual: '800 Kg', ConsumoPeriodo: '250 Kg', EstoqueMinimo: '150 Kg', Status: 'OK' },
    { NomeInsumo: 'Adubo Orgânico', Data: '11/09/2025', EstoqueAtual: '750 Kg', ConsumoPeriodo: '350 Kg', EstoqueMinimo: '300 Kg', Status: 'OK' },
    { NomeInsumo: 'Bofertilizantes', Data: '11/09/2025', EstoqueAtual: '10 Kg', ConsumoPeriodo: '25 Kg', EstoqueMinimo: '50 Kg', Status: 'Baixo Estoque' },
    { NomeInsumo: 'Bioinsumos', Data: '11/09/2025', EstoqueAtual: '5 Kg', ConsumoPeriodo: '4 Kg', EstoqueMinimo: '10 Kg', Status: 'Baixo Estoque' },
    { NomeInsumo: 'Corretivo', Data: '11/09/2025', EstoqueAtual: '0,5 Kg', ConsumoPeriodo: '0,25 Kg', EstoqueMinimo: '1 Kg', Status: 'Baixo Estoque' },
    // Adicionando mais dados para testar paginação
    { NomeInsumo: 'Fertilizante A', Data: '12/09/2025', EstoqueAtual: '100 Kg', ConsumoPeriodo: '50 Kg', EstoqueMinimo: '20 Kg', Status: 'OK' },
    { NomeInsumo: 'Fertilizante B', Data: '13/09/2025', EstoqueAtual: '200 Kg', ConsumoPeriodo: '100 Kg', EstoqueMinimo: '50 Kg', Status: 'OK' },
    { NomeInsumo: 'Fertilizante C', Data: '14/09/2025', EstoqueAtual: '50 Kg', ConsumoPeriodo: '30 Kg', EstoqueMinimo: '10 Kg', Status: 'Baixo Estoque' },
  ];

  const DADOS_FERRAMENTAS_MOCK = [
    { NomeInsumo: 'Ancinho', Data: '11/09/2025', EstoqueAtual: '8 unidades', Status: 'Ok' },
    { NomeInsumo: 'Pá Grande', Data: '11/09/2025', EstoqueAtual: '12 unidades', Status: 'Ok' },
    { NomeInsumo: 'Enxada', Data: '11/09/2025', EstoqueAtual: '2 unidades', Status: 'Ok' },
    { NomeInsumo: 'Cavadeira', Data: '11/09/2025', EstoqueAtual: '15 unidades', Status: 'Ok' },
    { NomeInsumo: 'Resador', Data: '11/09/2025', EstoqueAtual: '0 unidades', Status: 'Falta de Estoque' },
    // Adicionando mais dados para testar paginação
    { NomeInsumo: 'Martelo', Data: '12/09/2025', EstoqueAtual: '8 unidades', Status: 'Ok' },
    { NomeInsumo: 'Serrote', Data: '13/09/2025', EstoqueAtual: '6 unidades', Status: 'Ok' },
    { NomeInsumo: 'Alicate', Data: '14/09/2025', EstoqueAtual: '4 unidades', Status: 'Ok' },
  ];

  // Estados principais
  const [relatorios, setRelatorios] = useState([]);
  const [filtros, setFiltros] = useState({
    tipoInsumo: 'Material',
    dataInicio: '',
    dataFim: '',
    nomeInsumo: ''
  });

  // ✅ ESTADOS DE PAGINAÇÃO ADICIONADOS
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(5);
  const [termoBusca, setTermoBusca] = useState('');

  useEffect(() => {
    if (filtros.tipoInsumo === 'Material') {
      setRelatorios(DADOS_MATERIAIS_MOCK);
    } else {
      setRelatorios(DADOS_FERRAMENTAS_MOCK);
    }
    setPaginaAtual(1); // Reset para primeira página ao mudar tipo
  }, [filtros.tipoInsumo]);

  // ✅ Função para lidar com a busca
  const handleBuscaChange = (termo) => {
    setTermoBusca(termo);
    setPaginaAtual(1);
  };

  const handleFiltroChange = (name, value) => {
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleGerarRelatorio = () => {
    const { nomeInsumo, dataInicio, dataFim } = filtros;

    let dadosFiltrados = [];
    
    if (filtros.tipoInsumo === 'Material') {
      dadosFiltrados = DADOS_MATERIAIS_MOCK;
    } else {
      dadosFiltrados = DADOS_FERRAMENTAS_MOCK;
    }

    // Filtro por nome do insumo (case-insensitive)
    const dadosFiltradosPorNome = !nomeInsumo ? dadosFiltrados : 
      dadosFiltrados.filter(item =>
        item.NomeInsumo.toLowerCase().includes(nomeInsumo.toLowerCase())
      );

    // Filtro por data
    const dadosFiltradosFinal = dadosFiltradosPorNome.filter(item => {
      let matchesData = true;

      if (dataInicio || dataFim) {
        const [day, month, year] = item.Data.split('/');
        const itemDate = new Date(`${year}-${month}-${day}`);

        const startDate = dataInicio ? new Date(dataInicio) : null;
        const endDate = dataFim ? new Date(dataFim) : null;

        if (startDate && (isNaN(itemDate) || itemDate < startDate)) {
          matchesData = false;
        }
        if (endDate && (isNaN(itemDate) || itemDate > endDate)) {
          matchesData = false;
        }
      }

      return matchesData;
    });

    setRelatorios(dadosFiltradosFinal);
    setPaginaAtual(1); // Reset para primeira página após filtrar
  };

  // Colunas SIMPLES
  const colunas = filtros.tipoInsumo === 'Material' 
    ? [
        { key: "NomeInsumo", label: "Nome do Insumo" },
        { key: "Data", label: "Data" },
        { key: "EstoqueAtual", label: "Estoque Atual" },
        { key: "ConsumoPeriodo", label: "Consumo no Período" },
        { key: "EstoqueMinimo", label: "Estoque Mínimo" },
        { key: "Status", label: "Status" },
      ]
    : [
        { key: "NomeInsumo", label: "Nome do Insumo" },
        { key: "Data", label: "Data" },
        { key: "EstoqueAtual", label: "Estoque Atual" },
        { key: "Status", label: "Status" },
      ];

  return (
    <div className="gerar-relatorio-insumo-container">
      <div className="gerar-relatorio-insumo-content">
        
        {/* Seção de Filtros */}
        <section className="filtros-section">
          <h1>Gerar Relatório</h1>
          
          {/* Seletor de Tipo de Insumo */}
          <div className="tipo-insumo-selector">
            <label>Tipo de Insumo:</label>
            <div className="tipo-insumo-buttons">
              <button 
                className={filtros.tipoInsumo === 'Material' ? 'active' : ''}
                onClick={() => handleFiltroChange('tipoInsumo', 'Material')}
              >
                Materiais
              </button>
              <button 
                className={filtros.tipoInsumo === 'Ferramenta' ? 'active' : ''}
                onClick={() => handleFiltroChange('tipoInsumo', 'Ferramenta')}
              >
                Ferramentas
              </button>
            </div>
          </div>

          {/* Filtros Comuns usando FiltrosRelatorio */}
          <FiltrosRelatorio
            filtros={filtros}
            onFiltroChange={handleFiltroChange}
            onPesquisar={handleGerarRelatorio}
          />
        </section>

        {/* ✅ SEÇÃO DE CARDS REMOVIDA */}

        {/* Seção da Tabela COM PAGINAÇÃO */}
        <section className="tabela-section">
          <TabelaComBuscaPaginacao
            titulo={`Relatório de ${filtros.tipoInsumo === 'Material' ? 'Materiais' : 'Ferramentas'}`}
            dados={relatorios}
            colunas={colunas}
            chaveBusca="NomeInsumo"
            habilitarBusca={false}
            mostrarAcoes={false}
            // ✅ PROPS DE PAGINAÇÃO ADICIONADAS
            paginaAtual={paginaAtual}
            itensPorPagina={itensPorPagina}
            onPaginaChange={setPaginaAtual}
            onItensPorPaginaChange={setItensPorPagina}
            onBuscaChange={handleBuscaChange}
            termoBusca={termoBusca}
          />
        </section>
      </div>
    </div>
  );
};

export default GerarRelatorioInsumo;