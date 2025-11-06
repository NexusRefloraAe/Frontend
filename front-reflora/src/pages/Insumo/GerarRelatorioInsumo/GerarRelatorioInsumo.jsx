// GerarRelatorioInsumo.js atualizado
import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import PainelCard from "../../../components/PainelCard/PainelCard";
import FiltrosRelatorio from "../../../components/FiltrosRelatorio/FiltrosRelatorio";
import './GerarRelatorioInsumo.css';

const GerarRelatorioInsumo = () => {
  // Dados mock para materiais
  const DADOS_MATERIAIS_MOCK = [
    { NomeInsumo: 'Ecritifizante', Data: '11/09/2025', EstoqueAtual: '500 Kg', ConsumoPeriodo: '250 kg', EstoqueMinimo: '150 Kg', Status: 'Ok' },
    { NomeInsumo: 'Adubo Orgânico', Data: '11/09/2025', EstoqueAtual: '750 Kg', ConsumoPeriodo: '350 Kg', EstoqueMinimo: '300 Kg', Status: 'Ok' },
    { NomeInsumo: 'Bofertilizantes', Data: '11/09/2025', EstoqueAtual: '10 Kg', ConsumoPeriodo: '25 Kg', EstoqueMinimo: '50 Kg', Status: 'Baixo Estoque' },
    { NomeInsumo: 'Bonasumos', Data: '11/09/2025', EstoqueAtual: '5 Kg', ConsumoPeriodo: '4 Kg', EstoqueMinimo: '10 Kg', Status: 'Baixo Estoque' },
    { NomeInsumo: 'Corretivo', Data: '11/09/2025', EstoqueAtual: '0,5 Kg', ConsumoPeriodo: '0,25 Kg', EstoqueMinimo: '1 Kg', Status: 'Baixo Estoque' },
  ];

  // Dados mock para ferramentas
  const DADOS_FERRAMENTAS_MOCK = [
    { NomeInsumo: 'Aptitude', Data: '11/09/2025', EstoqueAtual: '5 unidades', Status: 'Ok' },
    { NomeInsumo: 'Pá Grande', Data: '11/09/2025', EstoqueAtual: '12 unidades', Status: 'Ok' },
    { NomeInsumo: 'Eusodia', Data: '11/09/2025', EstoqueAtual: '2 unidades', Status: 'Ok' },
    { NomeInsumo: 'Cavaderia', Data: '11/09/2025', EstoqueAtual: '15 unidades', Status: 'Ok' },
    { NomeInsumo: 'Resador', Data: '11/09/2025', EstoqueAtual: '0 unidades', Status: 'Falta de Estoque' },
  ];

  const [relatorios, setRelatorios] = useState([]);
  
  const [filtros, setFiltros] = useState({
    tipoInsumo: 'Material',
    dataInicio: '2025-01-01',
    dataFim: '2025-03-31',
    nomeInsumo: ''
  });

  // Dados para os cards de resumo
  const painelItems = [
    { 
      id: 1, 
      titulo: 'Total em Estoque', 
      valor: filtros.tipoInsumo === 'Material' ? '1.265,5 Kg' : '34 unidades',
      className: 'card-estoque'
    },
    { 
      id: 2, 
      titulo: filtros.tipoInsumo === 'Material' ? 'Consumo no Período' : 'Em Uso', 
      valor: filtros.tipoInsumo === 'Material' ? '629,25 Kg' : '12 unidades',
      className: 'card-consumo'
    },
    { 
      id: 3, 
      titulo: 'Status Crítico', 
      valor: filtros.tipoInsumo === 'Material' ? '3 insumos' : '1 ferramenta',
      className: 'card-critico'
    },
  ];

  useEffect(() => {
    // Carrega dados baseado no tipo de insumo selecionado
    if (filtros.tipoInsumo === 'Material') {
      setRelatorios(DADOS_MATERIAIS_MOCK);
    } else {
      setRelatorios(DADOS_FERRAMENTAS_MOCK);
    }
  }, [filtros.tipoInsumo]);

  const handleFiltroChange = (name, value) => {
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleGerarRelatorio = () => {
    // Filtragem básica - em um caso real, faria requisição à API
    let dadosFiltrados = [];
    
    if (filtros.tipoInsumo === 'Material') {
      dadosFiltrados = DADOS_MATERIAIS_MOCK;
    } else {
      dadosFiltrados = DADOS_FERRAMENTAS_MOCK;
    }

    // Aplica filtro por nome do insumo
    if (filtros.nomeInsumo) {
      dadosFiltrados = dadosFiltrados.filter(item =>
        item.NomeInsumo.toLowerCase().includes(filtros.nomeInsumo.toLowerCase())
      );
    }

    setRelatorios(dadosFiltrados);
  };

  // Define colunas baseado no tipo de insumo
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
          
          {/* Usando o componente FiltrosRelatorio com as novas props */}
          <FiltrosRelatorio
            filtros={filtros}
            onFiltroChange={handleFiltroChange}
            onPesquisar={handleGerarRelatorio}
            // Novas props específicas para relatório de insumos
            mostrarTipoInsumo={true}
            tipoInsumo={filtros.tipoInsumo}
            mostrarNomeInsumo={true}
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
            titulo={`Relatório de ${filtros.tipoInsumo === 'Material' ? 'Materiais' : 'Ferramentas'}`}
            dados={relatorios}
            colunas={colunas}
            chaveBusca="NomeInsumo"
            mostrarBusca={true}
            mostrarAcoes={false}
          />
        </section>
      </div>
    </div>
  );
};

export default GerarRelatorioInsumo;