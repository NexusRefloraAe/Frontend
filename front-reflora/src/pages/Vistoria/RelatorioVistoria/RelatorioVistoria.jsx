import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import FiltrosRelatorio from "../../../components/FiltrosRelatorio/FiltrosRelatorio";
import './RelatorioVistoria.css';

const RelatorioVistoria = () => {
  const DADOS_RELATORIO_VISTORIA_MOCK = [
    { DataColeta: '01/01/2025', Especie: 'Eucalipto', Quantidade: 750, Data: '01/01/2025', LocalBeneficiario: 'AFINK' },
    { DataColeta: '01/05/2025', Especie: 'Eucalipto', Quantidade: 750, Data: '01/05/2025', LocalBeneficiario: 'AFINK' },
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

  // Estados para paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(5);
  const [termoBusca, setTermoBusca] = useState('');

  useEffect(() => {
    setRelatorios(DADOS_RELATORIO_VISTORIA_MOCK);
  }, []);

  // ✅ Atualiza filtros genéricos
  const handleFiltroChange = (name, value) => {
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Aplica filtros
  const handleGerarRelatorio = () => {
    const { loteMuda, dataInicio, dataFim, beneficiario } = filtros;

    const dadosFiltrados = DADOS_RELATORIO_VISTORIA_MOCK.filter(item => {
      // 🟢 Lote da Muda (se for um dropdown, pode ser exato)
      const matchesLote = !loteMuda || item.Lote === loteMuda;

      // 🟢 Beneficiário
      const matchesBeneficiario = !beneficiario ||
        item.LocalBeneficiario.toLowerCase().includes(beneficiario.toLowerCase());

      // 🟢 Data
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
    setPaginaAtual(1); // Reset para primeira página após filtrar
  };

  // Função para lidar com a busca
  const handleBuscaChange = (termo) => {
    setTermoBusca(termo);
    setPaginaAtual(1);
  };

  // Colunas da tabela — conforme imagem
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

        {/* Seção da Tabela */}
        <section className="tabela-section">
          <TabelaComBuscaPaginacao
            titulo="Relatório de Vistorias"
            dados={relatorios}
            colunas={colunas}
            chaveBusca="Especie"
            mostrarBusca={true}
            mostrarAcoes={false}
            onEditar={() => {}}
            onConfirmar={() => {}}
            onExcluir={() => {}}
            // Props de paginação adicionadas
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

export default RelatorioVistoria;