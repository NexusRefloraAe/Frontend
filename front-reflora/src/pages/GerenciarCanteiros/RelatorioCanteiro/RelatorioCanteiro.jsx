import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import PainelCard from "../../../components/PainelCard/PainelCard";
import FiltrosRelatorio from "../../../components/FiltrosRelatorio/FiltrosRelatorio";
import './RelatorioCanteiro.css';

const RelatorioCanteiro = () => {
  const DADOS_RELATORIO_CANTEIRO_MOCK = [
    { Lote: 'A001', NomePopular: 'Ipê-amarelo', DataEntrada: '01/01/2025', QuantidadeEntrada: 350, DataSaida: '20/01/2025', QuantidadeSaida: 100, TempoNoCanteiro: '20 dias' },
    { Lote: 'A001', NomePopular: 'Ipê-amarelo', DataEntrada: '01/01/2025', QuantidadeEntrada: 100, DataSaida: '05/01/2025', QuantidadeSaida: 50, TempoNoCanteiro: '5 dias' },
    { Lote: 'A001', NomePopular: 'Ipê-amarelo', DataEntrada: '01/01/2025', QuantidadeEntrada: 200, DataSaida: '10/01/2025', QuantidadeSaida: 100, TempoNoCanteiro: '10 dias' },
    { Lote: 'A001', NomePopular: 'Ipê-amarelo', DataEntrada: '01/01/2025', QuantidadeEntrada: 50, DataSaida: '01/02/2025', QuantidadeSaida: 50, TempoNoCanteiro: '31 dias' },
    { Lote: 'A001', NomePopular: 'Ipê-amarelo', DataEntrada: '01/01/2025', QuantidadeEntrada: 900, DataSaida: '15/01/2025', QuantidadeSaida: 400, TempoNoCanteiro: '15 dias' },
    { Lote: 'A001', NomePopular: 'Ipê-amarelo', DataEntrada: '01/01/2025', QuantidadeEntrada: 400, DataSaida: '25/01/2025', QuantidadeSaida: 200, TempoNoCanteiro: '25 dias' },
    { Lote: 'A001', NomePopular: 'Ipê-amarelo', DataEntrada: '01/01/2025', QuantidadeEntrada: 100, DataSaida: '01/02/2025', QuantidadeSaida: 100, TempoNoCanteiro: '31 dias' },
    { Lote: 'A001', NomePopular: 'Ipê-amarelo', DataEntrada: '01/01/2025', QuantidadeEntrada: 100, DataSaida: '01/02/2025', QuantidadeSaida: 100, TempoNoCanteiro: '31 dias' },
    { Lote: 'A001', NomePopular: 'Ipê-amarelo', DataEntrada: '01/01/2025', QuantidadeEntrada: 100, DataSaida: '01/02/2025', QuantidadeSaida: 100, TempoNoCanteiro: '31 dias' },
  ];

  const [relatorios, setRelatorios] = useState([]);
  const [filtros, setFiltros] = useState({
    nomePopular: '',
    dataInicio: '',
    dataFim: ''
  });

  // Dados para os cards de resumo (conforme imagem)
  const painelItems = [
    { 
      id: 1, 
      titulo: 'Total Entrada (und)', 
      valor: '100.000',
      className: 'card-entrada'
    },
    { 
      id: 2, 
      titulo: 'Total Saída (und)', 
      valor: '5.000',
      className: 'card-saida'
    },
    { 
      id: 3, 
      titulo: 'Total Atual (und)', 
      valor: '10.000',
      className: 'card-atual'
    },
  ];

  useEffect(() => {
    setRelatorios(DADOS_RELATORIO_CANTEIRO_MOCK);
  }, []);

  const handleFiltroChange = (name, value) => {
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleGerarRelatorio = () => {
    const { nomePopular, dataInicio, dataFim } = filtros;

    const dadosFiltrados = DADOS_RELATORIO_CANTEIRO_MOCK.filter(item => {
      // ✅ Filtro por nome popular
      const matchesNome = !nomePopular || 
        (item.NomePopular && item.NomePopular.toLowerCase().includes(nomePopular.toLowerCase()));

      // ✅ Filtro por data (considerando DataEntrada)
      let matchesData = true;
      if ((dataInicio || dataFim) && item.DataEntrada) {
        const parts = item.DataEntrada.split('/');
        if (parts.length === 3) {
          const [day, month, year] = parts;
          const itemDate = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
          
          if (isNaN(itemDate.getTime())) return false;

          const startDate = dataInicio ? new Date(dataInicio) : null;
          const endDate = dataFim ? new Date(dataFim) : null;

          if (startDate && itemDate < startDate) matchesData = false;
          if (endDate && itemDate > endDate) matchesData = false;
        }
      }

      return matchesNome && matchesData;
    });

    setRelatorios(dadosFiltrados);
  };

  // Colunas conforme a imagem (Movimentações dos Canteiros)
  const colunas = [
    { key: "Lote", label: "Lote" },
    { key: "NomePopular", label: "Nome Popular" },
    { key: "DataEntrada", label: "Data Entrada" },
    { key: "QuantidadeEntrada", label: "Qtd Entrada" },
    { key: "DataSaida", label: "Data Saída" },
    { key: "QuantidadeSaida", label: "Qtd Saída" },
    { key: "TempoNoCanteiro", label: "Tempo no Canteiro" },
  ];

  return (
    <div className="relatorio-canteiro-container">
      <div className="relatorio-canteiro-content">
        
        {/* Seção de Filtros */}
        <section className="filtros-section">
          <h1>Gerar Relatório</h1>
          <FiltrosRelatorio
            filtros={filtros}
            onFiltroChange={handleFiltroChange}
            onPesquisar={handleGerarRelatorio}
          />
        </section>

        {/* Seção de Cards de Resumo */}
        <section className="cards-section">
          <div className="cards-container">
            {painelItems.map(item => (
              <PainelCard 
                key={item.id}
                titulo={item.titulo} 
                valor={item.valor}
                className={item.className}
              />
            ))}
          </div>
        </section>

        {/* Seção da Tabela */}
        <section className="tabela-section">
          <TabelaComBuscaPaginacao
            titulo="Movimentações dos Canteiros"
            dados={relatorios}
            colunas={colunas}
            chaveBusca="NomePopular"
            mostrarBusca={false}
            mostrarAcoes={false}
            footerContent={
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button 
                  className="btn-exportar"
                  onClick={() => alert('Relatório exportado com sucesso!')}
                >
                  Exportar ↑
                </button>
              </div>
            }
          />
        </section>
      </div>
    </div>
  );
};

export default RelatorioCanteiro;