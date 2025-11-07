import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import PainelCard from "../../../components/PainelCard/PainelCard";
import FiltrosRelatorio from "../../../components/FiltrosRelatorio/FiltrosRelatorio"; 
import './GerarRelatorio.css';

const GerarRelatorio = () => {
  const DADOS_RELATORIO_MOCK = [
    { Lote: 'A001', Nomepopular: 'Ipê-amarelo', Data: '01/01/2025', TipoMovimento: 'Entrada', Quantidade: 350 },
    { Lote: 'A001', Nomepopular: 'Ipê-amarelo', Data: '01/01/2025', TipoMovimento: 'Saída', Quantidade: 100 },
    { Lote: 'A001', Nomepopular: 'Ipê-amarelo', Data: '01/01/2025', TipoMovimento: 'Saída', Quantidade: 200 },
    { Lote: 'A001', Nomepopular: 'Ipê-amarelo', Data: '01/01/2025', TipoMovimento: 'Saída', Quantidade: 50 },
    { Lote: 'A001', Nomepopular: 'Ipê-amarelo', Data: '01/01/2025', TipoMovimento: 'Entrada', Quantidade: 900 },
    { Lote: 'A001', Nomepopular: 'Ipê-amarelo', Data: '01/01/2025', TipoMovimento: 'Saída', Quantidade: 400 },
    { Lote: 'A001', Nomepopular: 'Ipê-amarelo', Data: '01/01/2025', TipoMovimento: 'Saída', Quantidade: 100 },
    { Lote: 'A001', Nomepopular: 'Ipê-amarelo', Data: '01/01/2025', TipoMovimento: 'Saída', Quantidade: 100 },
    { Lote: 'A001', Nomepopular: 'Ipê-amarelo', Data: '01/01/2025', TipoMovimento: 'Entrada', Quantidade: 100 },
  ];

  const [relatorios, setRelatorios] = useState([]);
  const [filtros, setFiltros] = useState({
    nomePopular: '',
    dataInicio: '',
    dataFim: ''
  });

  // Dados para os cards de resumo
  const painelItems = [
    { 
      id: 1, 
      titulo: 'Total Entrada (kg)', 
      valor: '1.000',
      className: 'card-entrada'
    },
    { 
      id: 2, 
      titulo: 'Total Saída (und)', 
      valor: '500',
      className: 'card-saida'
    },
    { 
      id: 3, 
      titulo: 'Total Atual (kg)', 
      valor: '10.000',
      className: 'card-atual'
    },
  ];

  useEffect(() => {
    setRelatorios(DADOS_RELATORIO_MOCK);
  }, []);

  // ✅ Nova função: genérica, recebe name + value
  const handleFiltroChange = (name, value) => {
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Nova função: sem evento — chamada via form ou botão
  const handleGerarRelatorio = () => {
    const { nomePopular, dataInicio, dataFim } = filtros;

    const dadosFiltrados = DADOS_RELATORIO_MOCK.filter(item => {
      // ✅ Filtro por nome popular (case-insensitive)
      const matchesNome = !nomePopular || 
        item.Nomepopular.toLowerCase().includes(nomePopular.toLowerCase());

      // ✅ Filtro por data
      let matchesData = true;

      if (dataInicio || dataFim) {
        // Converter "DD/MM/YYYY" → Date (ex: "01/01/2025" → new Date("2025-01-01"))
        const [day, month, year] = item.Data.split('/');
        const itemDate = new Date(`${year}-${month}-${day}`);

        const startDate = dataInicio ? new Date(dataInicio) : null;
        const endDate = dataFim ? new Date(dataFim) : null;

        // Garantir que as datas estejam válidas
        if (startDate && (isNaN(itemDate) || itemDate < startDate)) {
          matchesData = false;
        }
        if (endDate && (isNaN(itemDate) || itemDate > endDate)) {
          matchesData = false;
        }
      }

      return matchesNome && matchesData;
    });

    setRelatorios(dadosFiltrados);
  };

  const colunas = [
    { key: "Lote", label: "Lote" },
    { key: "Nomepopular", label: "Nome Popular" },
    { key: "Data", label: "Data" },
    { key: "TipoMovimento", label: "Tipo de Movimento" },
    { key: "Quantidade", label: "Quantidade" },
  ];

  return (
    <div className="gerar-relatorio-container">
      <div className="gerar-relatorio-content">
        
        {/* Seção de Filtros — agora com componente genérico */}
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
            titulo="Movimentações da Semente"
            dados={relatorios}
            colunas={colunas}
            chaveBusca="Nomepopular"
            mostrarBusca={false}
            mostrarAcoes={false}
          />
        </section>
      </div>
    </div>
  );
};

export default GerarRelatorio;