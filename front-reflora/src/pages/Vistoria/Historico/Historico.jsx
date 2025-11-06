import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import FiltrosRelatorio from "../../../components/FiltrosRelatorio/FiltrosRelatorio";
import './Historico.css';

const Historico = () => {
  const DADOS_VISTORIAS_MOCK = [
    { Lote: 'A001', NomePopular: 'Ipê-amarelo', DataVistoria: '20/05/2025', Status: 'Vistoria Cadastrada', Usuario: 'Antônio Bezerra Santos', Responsavel: 'Carlos Silva', LocalizacaoColeta: 'Araruna (-6.558, -35.742)' },
    { Lote: 'A001', NomePopular: 'Ipê-amarelo', DataVistoria: '15/05/2025', Status: 'Vistoria Atualizada', Usuario: 'Maria Silva', Responsavel: 'Ana Costa', LocalizacaoColeta: 'Araruna (-6.558, -35.742)' },
    { Lote: 'A002', NomePopular: 'Ipê-rosa', DataVistoria: '18/05/2025', Status: 'Vistoria Cadastrada', Usuario: 'João Pereira', Responsavel: 'Pedro Santos', LocalizacaoColeta: 'Campina Grande (-7.230, -35.881)' },
    { Lote: 'A003', NomePopular: 'Ipê-branco', DataVistoria: '22/05/2025', Status: 'Vistoria Cadastrada', Usuario: 'Ana Costa', Responsavel: 'Mariana Lima', LocalizacaoColeta: 'Solânea (-6.755, -35.699)' },
    { Lote: 'A002', NomePopular: 'Ipê-rosa', DataVistoria: '25/05/2025', Status: 'Vistoria Atualizada', Usuario: 'Carlos Santos', Responsavel: 'Pedro Santos', LocalizacaoColeta: 'Campina Grande (-7.230, -35.881)' },
    { Lote: 'A004', NomePopular: 'Pau-brasil', DataVistoria: '28/05/2025', Status: 'Vistoria Cadastrada', Usuario: 'Fernanda Lima', Responsavel: 'Roberto Alves', LocalizacaoColeta: 'Bananeiras (-6.750, -35.633)' },
    { Lote: 'A003', NomePopular: 'Ipê-branco', DataVistoria: '30/05/2025', Status: 'Vistoria Atualizada', Usuario: 'Roberto Alves', Responsavel: 'Mariana Lima', LocalizacaoColeta: 'Solânea (-6.755, -35.699)' },
    { Lote: 'A005', NomePopular: 'Jacarandá', DataVistoria: '02/06/2025', Status: 'Vistoria Cadastrada', Usuario: 'Patrícia Souza', Responsavel: 'José Oliveira', LocalizacaoColeta: 'Cuité (-6.483, -36.153)' },
    { Lote: 'A001', NomePopular: 'Ipê-amarelo', DataVistoria: '05/06/2025', Status: 'Vistoria Finalizada', Usuario: 'Antônio Bezerra Santos', Responsavel: 'Carlos Silva', LocalizacaoColeta: 'Araruna (-6.558, -35.742)' },
    { Lote: 'A004', NomePopular: 'Pau-brasil', DataVistoria: '08/06/2025', Status: 'Vistoria Atualizada', Usuario: 'Fernanda Lima', Responsavel: 'Roberto Alves', LocalizacaoColeta: 'Bananeiras (-6.750, -35.633)' },
    { Lote: 'A006', NomePopular: 'Cedro-rosa', DataVistoria: '10/06/2025', Status: 'Vistoria Cadastrada', Usuario: 'Ricardo Oliveira', Responsavel: 'Paula Torres', LocalizacaoColeta: 'Dona Inês (-6.615, -35.621)' },
    { Lote: 'A002', NomePopular: 'Ipê-rosa', DataVistoria: '12/06/2025', Status: 'Vistoria Finalizada', Usuario: 'Carlos Santos', Responsavel: 'Pedro Santos', LocalizacaoColeta: 'Campina Grande (-7.230, -35.881)' },
    { Lote: 'A007', NomePopular: 'Jatobá', DataVistoria: '15/06/2025', Status: 'Vistoria Cadastrada', Usuario: 'Mariana Torres', Responsavel: 'Lucas Fernandes', LocalizacaoColeta: 'Remígio (-6.867, -35.800)' },
    { Lote: 'A005', NomePopular: 'Jacarandá', DataVistoria: '18/06/2025', Status: 'Vistoria Atualizada', Usuario: 'Patrícia Souza', Responsavel: 'José Oliveira', LocalizacaoColeta: 'Cuité (-6.483, -36.153)' },
    { Lote: 'A003', NomePopular: 'Ipê-branco', DataVistoria: '20/06/2025', Status: 'Vistoria Finalizada', Usuario: 'Roberto Alves', Responsavel: 'Mariana Lima', LocalizacaoColeta: 'Solânea (-6.755, -35.699)' }
  ];

  const [vistorias, setVistorias] = useState([]);
  const [filtros, setFiltros] = useState({
    nomePopular: '',
    dataInicio: '',
    dataFim: ''
  });

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
      {/* ✅ Cabeçalho com título e filtros */}
      <div className="header-filtros">
        <h1>Histórico de Vistorias</h1>
        <FiltrosRelatorio
          filtros={filtros}
          onFiltroChange={handleFiltroChange}
          onPesquisar={handlePesquisar}
          buttonText="Pesquisar"
          buttonVariant="success" // 👈 botão verde
        />
      </div>

      {/* ✅ Tabela com título interno e botão Exportar */}
      <div className="tabela-wrapper">
        <TabelaComBuscaPaginacao
          titulo="Histórico de Vistorias"
          dados={vistorias}
          colunas={colunas}
          chaveBusca="NomePopular"
          mostrarBusca={true} // 👈 habilitado conforme mock
          mostrarAcoes={true}
          onEditar={(item) => console.log("Editar:", item)}
          onConfirmar={(item) => console.log("Confirmar:", item)}
          onExcluir={(item) => console.log("Excluir:", item)}
        />

      </div>
    </div>
  );
};

export default Historico;