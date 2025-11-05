import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import Input from "../../../components/Input/Input";
import PainelCard from "../../../components/PainelCard/PainelCard";
import Button from "../../../components/Button/Button";
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

  const handleFiltroChange = (field) => (e) => {
    const value = e.target.value;
    setFiltros(prev => ({ ...prev, [field]: value }));
  };

  const handleGerarRelatorio = (e) => {
    e.preventDefault();
    
    // Filtra os dados baseado nos filtros aplicados
    const dadosFiltrados = DADOS_RELATORIO_MOCK.filter(item => {
      const matchesNome = !filtros.nomePopular || 
        item.Nomepopular.toLowerCase().includes(filtros.nomePopular.toLowerCase());
      
      // Aqui você pode adicionar lógica para filtrar por data também
      return matchesNome;
    });
    
    setRelatorios(dadosFiltrados);
  };

  // Colunas atualizadas conforme a imagem
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
        
        {/* Seção de Filtros */}
        <section className="filtros-section">
          <h1>Gerar Relatório</h1>
          <div className="filtros-container">
            <div className="filtro-group">
              <label className="filtro-label">Nome Popular</label>
              <Input
                name="nomePopular"
                type="text"
                value={filtros.nomePopular}
                onChange={handleFiltroChange('nomePopular')}
                placeholder="Ipê-amarelo"
                className="filtro-input"
              />
            </div>
            
            <div className="filtro-group">
              <label className="filtro-label">Data início</label>
              <Input
                name="dataInicio"
                type="date"
                value={filtros.dataInicio}
                onChange={handleFiltroChange('dataInicio')}
                placeholder="01/01/2025"
                className="filtro-input"
              />
            </div>
            
            <div className="filtro-group">
              <label className="filtro-label">Data fim</label>
              <Input
                name="dataFim"
                type="date"
                value={filtros.dataFim}
                onChange={handleFiltroChange('dataFim')}
                placeholder="31/03/2025"
                className="filtro-input"
              />
            </div>
            
            <div className="botoes-container">
              <Button 
                variant="primary" 
                onClick={handleGerarRelatorio}
                className="btn-gerar"
                type="submit"
              >
                Pesquisar
              </Button>
            </div>
          </div>
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

        {/* Seção da Tabela - Título integrado na tabela */}
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