import React, { useState, useEffect } from "react";
import TabelaResponsiva from "../../../components/TabelaResponsiva/TabelaResponsiva";
import PainelCard from "../../../components/PainelCard/PainelCard";
import FiltrosRelatorio from "../../../components/FiltrosRelatorio/FiltrosRelatorio";
import Paginacao from "../../../components/Paginacao/Paginacao";
import './RelatorioCanteiro.css';
// import LayoutScroll from "../../../components/LayoutScroll/LayoutScroll"; // Se não for usado diretamente aqui, pode ser removido, ou mantido se fizer parte do layout pai

const RelatorioCanteiro = () => {
  // --- MOCK DATA (Simulação do Backend) ---
  const DADOS_RELATORIO = [
    { id: 1, Lote: 'A001', NomePopular: 'Ipê-amarelo', DataEntrada: '01/01/2025', QuantidadeEntrada: 350, DataSaida: '20/01/2025', QuantidadeSaida: 100, TempoNoCanteiro: '20 dias' },
    { id: 2, Lote: 'B002', NomePopular: 'Jacarandá', DataEntrada: '05/01/2025', QuantidadeEntrada: 200, DataSaida: '-', QuantidadeSaida: 0, TempoNoCanteiro: '15 dias' },
    // Adicione mais dados mock aqui se quiser testar a paginação
  ];

  // Estados
  const [relatorios, setRelatorios] = useState([]);
  const [filtros, setFiltros] = useState({ nomePopular: '', dataInicio: '', dataFim: '' });
  const [paginaAtual, setPaginaAtual] = useState(1);
  
  // Objeto que faltava para preencher os Cards
  const [dadosPainel, setDadosPainel] = useState({
    totalEntrada: 0,
    totalSaida: 0,
    totalAtual: 0
  });

  const itensPorPagina = 5;

  // Carrega os dados iniciais
  useEffect(() => { 
    setRelatorios(DADOS_RELATORIO); 
    
    // Simulação de cálculo de totais para o painel
    // Num cenário real, isso viria do backend ou seria um reduce no array
    setDadosPainel({
        totalEntrada: 100000, 
        totalSaida: 50000,
        totalAtual: 50000
    });
  }, []);

  const handleFiltroChange = (name, value) => { 
    setFiltros(prev => ({ ...prev, [name]: value })); 
  };
  
  const handleGerarRelatorio = () => { 
    // Lógica de filtro aqui 
    console.log("Filtrando com:", filtros);
  };

  // --- CONFIGURAÇÃO DE UI (Agora corrigido) ---
  // Apenas UMA declaração de painelItems e usando o estado dadosPainel
  const painelItems = [
    { id: 1, titulo: 'Total Entrada', valor: dadosPainel.totalEntrada.toLocaleString(), className: 'card-entrada' },
    { id: 2, titulo: 'Total Saída', valor: dadosPainel.totalSaida.toLocaleString(), className: 'card-saida' },
    { id: 3, titulo: 'Saldo Atual', valor: dadosPainel.totalAtual.toLocaleString(), className: 'card-atual' },
  ];

  const colunas = [
    { key: "Lote", label: "Lote" },
    { key: "NomePopular", label: "Nome Popular" },
    { key: "DataEntrada", label: "Data Entrada" },
    { key: "QuantidadeEntrada", label: "Qtd Entrada" },
    { key: "DataSaida", label: "Data Saída" },
    { key: "QuantidadeSaida", label: "Qtd Saída" },
    { key: "TempoNoCanteiro", label: "Tempo" },
  ];

  // Paginação Frontend
  const totalPaginas = Math.ceil(relatorios.length / itensPorPagina);
  const dadosPaginados = relatorios.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina);

  return (
    <div className="relatorio-canteiro-container auth-scroll-fix">
      <div className="relatorio-canteiro-content">
        
        {/* Filtros */}
        <section className="filtros-section">
          <h1>Gerar Relatório</h1>
          <FiltrosRelatorio 
            filtros={filtros} 
            onFiltroChange={handleFiltroChange} 
            onPesquisar={handleGerarRelatorio} 
          />
        </section>

        {/* Cards */}
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

        {/* Tabela */}
        <section className="tabela-section">
          <TabelaResponsiva
            titulo="Movimentações dos Canteiros"
            dados={dadosPaginados}
            colunas={colunas}
            footerContent={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <Paginacao 
                        paginaAtual={paginaAtual} 
                        totalPaginas={totalPaginas} 
                        onPaginaChange={setPaginaAtual} 
                      />
                      <button 
                        className="btn-exportar" 
                        onClick={() => alert('Exportar')}
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