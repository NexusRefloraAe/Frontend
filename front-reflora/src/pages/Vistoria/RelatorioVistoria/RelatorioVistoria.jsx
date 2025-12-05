import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import PainelCard from "../../../components/PainelCard/PainelCard"; // 1. Importado
import FiltrosRelatorio from "../../../components/FiltrosRelatorio/FiltrosRelatorio";
import './RelatorioVistoria.css'; // 2. CSS será atualizado

const RelatorioVistoria = () => {
  const DADOS_RELATORIO_VISTORIA_MOCK = [
    { DataColeta: '01/01/2025', Especie: 'Eucalipto', Quantidade: 750, Data: '01/01/2025', LocalBeneficiario: 'AFINK' },
    { DataColeta: '01/05/2025', Especie: 'Eucalipto', Quantidade: 750, Data: '01/05/2025', LocalBeneficiario: 'AFINK' },
    { DataColeta: '31/03/2025', Especie: 'Eucalipto', Quantidade: 2250, Data: '31/03/2025', LocalBeneficiario: 'AFINK' },
    { DataColeta: '01/01/2025', Especie: 'Pinus', Quantidade: 500, Data: '01/01/2025', LocalBeneficiario: 'CIFOR' },
    { DataColeta: '02/01/2025', Especie: 'Pinus', Quantidade: 500, Data: '02/01/2025', LocalBeneficiario: 'CIFOR' },
    { DataColeta: '05/01/2025', Especie: 'Mogno', Quantidade: 300, Data: '05/01/2025', LocalBeneficiario: 'FUNDAÇÃO VERDE' },
    { DataColeta: '10/01/2025', Especie: 'Mogno', Quantidade: 300, Data: '10/01/2025', LocalBeneficiario: 'FUNDAÇÃO VERDE' },
    { DataColeta: '15/01/2025', Especie: 'Ipê-amarelo', Quantidade: 200, Data: '15/01/2025', LocalBeneficiario: 'AFINK' },
  ];

  const [relatorios, setRelatorios] = useState([]);
  const [filtros, setFiltros] = useState({
    loteMuda: '',
    dataInicio: '',
    dataFim: '',
    beneficiario: ''
  });

  // 3. Dados para os cards de resumo (Mockados)
  const painelItems = [
    { 
      id: 1, 
      titulo: 'Total Vistorias', 
      valor: '10', // Valor mockado
      className: 'card-total' // Classe CSS
    },
    { 
      id: 2, 
      titulo: 'Vistorias Finalizadas', 
      valor: '3', // Valor mockado
      className: 'card-finalizadas' // Classe CSS
    },
    { 
      id: 3, 
      titulo: 'Vistorias Cadastradas', 
      valor: '7', // Valor mockado
      className: 'card-cadastradas' // Classe CSS
    },
  ];

  useEffect(() => {
    setRelatorios(DADOS_RELATORIO_VISTORIA_MOCK);
  }, []);

  const handleFiltroChange = (name, value) => {
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleGerarRelatorio = () => {
    const { loteMuda, dataInicio, dataFim, beneficiario } = filtros;

    const dadosFiltrados = DADOS_RELATORIO_VISTORIA_MOCK.filter(item => {
      const matchesLote = !loteMuda || item.Lote === loteMuda;
      const matchesBeneficiario = !beneficiario ||
        item.LocalBeneficiario.toLowerCase().includes(beneficiario.toLowerCase());

      let matchesData = true;
      if (dataInicio || dataFim) {
        const [day, month, year] = item.DataColeta.split('/');
        const itemDate = new Date(`${year}-${month}-${day}`);
        const startDate = dataInicio ? new Date(dataInicio) : null;
        const endDate = dataFim ? new Date(dataFim) : null;
        if (startDate && (isNaN(itemDate) || itemDate < startDate)) matchesData = false;
        if (endDate && (isNaN(itemDate) || itemDate > endDate)) matchesData = false;
      }
      return matchesLote && matchesBeneficiario && matchesData;
    });

    setRelatorios(dadosFiltrados);
    // 4. Remove o reset de página, já que a tabela não tem mais busca/paginação externa
  };

  // 5. Remove 'handleBuscaChange' e estados de paginação/busca

  const colunas = [
    { key: "DataColeta", label: "Data Coleta" },
    { key: "Especie", label: "Espécie" },
    { key: "Quantidade", label: "Quantidade" },
    { key: "Data", label: "Data" },
    { key: "LocalBeneficiario", label: "Local / Beneficiário" }
  ];

  return (
    <div className="relatorio-vistoria-container">
      <div className="relatorio-vistoria-content">
        
        {/* Seção de Filtros */}
        <section className="filtros-section">
          <h1>Gerar Relatório</h1>
          <FiltrosRelatorio
            filtros={filtros}
            onFiltroChange={handleFiltroChange}
            onPesquisar={handleGerarRelatorio}
            buttonText="Pesquisar"
            buttonVariant="success" 
          />
        </section>

        {/* 6. Seção de Cards de Resumo (Adicionada) */}
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
            titulo="Relatório de Vistorias"
            dados={relatorios}
            colunas={colunas}
            chaveBusca="Especie"
            habilitarBusca={false} // 7. Alterado para false
            mostrarAcoes={false}
            // 8. Remove props de paginação e busca externa
            
            // 9. Adiciona footer com botão de exportar
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

export default RelatorioVistoria;