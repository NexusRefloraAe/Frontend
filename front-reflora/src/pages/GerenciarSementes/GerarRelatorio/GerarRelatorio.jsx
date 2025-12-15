import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import PainelCard from "../../../components/PainelCard/PainelCard";
import FiltrosRelatorio from "../../../components/FiltrosRelatorio/FiltrosRelatorio";
import './GerarRelatorio.css';

// 1. Importe o serviço
import { relatorioService } from "../../../services/relatorioService";

// (Opcional) Botão simples para exportação se não tiver componente específico
const BotaoExportar = ({ label, onClick, cor }) => (
    <button 
        onClick={onClick} 
        style={{ padding: '8px 16px', backgroundColor: cor, color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' }}
    >
        {label}
    </button>
);

const GerarRelatorio = () => {
  // Estados de Dados
  const [relatorios, setRelatorios] = useState([]); // Lista da tabela
  const [loading, setLoading] = useState(false);
  
  // Estado dos Cards (Totais vindos do Backend)
  const [totais, setTotais] = useState({
      totalEntrada: 0,
      totalSaida: 0,
      saldoDoPeriodo: 0
  });

  // Estado de Paginação
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const [filtros, setFiltros] = useState({
    nomePopular: '',
    dataInicio: '',
    dataFim: ''
  });

  // 2. Função principal que busca dados na API
  const carregarDados = async (pagina = 0) => {
    try {
        setLoading(true);
        // Chama o serviço passando os filtros atuais e a página
        const data = await relatorioService.getPainel(filtros, pagina);

        // Atualiza Cards
        setTotais({
            totalEntrada: data.totalEntrada,
            totalSaida: data.totalSaida,
            saldoDoPeriodo: data.saldoDoPeriodo
        });

        // Atualiza Tabela (O backend retorna um Page no campo 'pageTabela' conforme seu Controller)
        // Verifique no controller: return new PainelMovimentacoesDTO(..., pageTabela)
        setRelatorios(data.pageTabela.content);
        setTotalPaginas(data.pageTabela.totalPages);
        setPaginaAtual(data.pageTabela.number);

    } catch (error) {
        console.error("Erro ao carregar relatório:", error);
        alert("Erro ao buscar dados do relatório.");
    } finally {
        setLoading(false);
    }
  };

  // Carrega na montagem inicial
  useEffect(() => {
    carregarDados(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFiltroChange = (name, value) => {
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  // Botão "Pesquisar" do Filtro
  const handleGerarRelatorio = () => {
    // Volta para página 0 ao filtrar
    carregarDados(0);
  };

  // Botões de Exportação
  const handleExportarPDF = async () => {
      try { await relatorioService.exportarPdf(filtros); } 
      catch (e) { alert("Erro ao baixar PDF"); }
  };

  const handleExportarCSV = async () => {
      try { await relatorioService.exportarCsv(filtros); } 
      catch (e) { alert("Erro ao baixar CSV"); }
  };

  // Cards Dinâmicos baseados no Estado 'totais'
  const painelItems = [
    { 
      id: 1, 
      titulo: 'Total Entrada', // (Unidade vem do dado ou fixa se for padrão)
      valor: totais.totalEntrada, // Usa o estado
      className: 'card-entrada'
    },
    { 
      id: 2, 
      titulo: 'Total Saída', 
      valor: totais.totalSaida, // Usa o estado
      className: 'card-saida'
    },
    { 
      id: 3, 
      titulo: 'Saldo do Período', 
      valor: totais.saldoDoPeriodo, // Usa o estado
      className: 'card-atual'
    },
  ];

  // 3. Colunas: Chaves devem ser iguais ao DTO do Java (RegistroMovimentacaoResponseDTO)
  // Campos: lote, nomePopular, data, tipoMovimento, quantidade
  const colunas = [
    { key: "lote", label: "Lote" },
    { key: "nomePopular", label: "Nome Popular" },
    { key: "data", label: "Data" }, // Backend envia Array [ano, mes, dia] ou String ISO dependendo do Jackson
    { key: "tipoMovimento", label: "Tipo" },
    { key: "quantidade", label: "Quantidade" },
  ];

  return (
    <div className="gerar-relatorio-container">
      <div className="gerar-relatorio-content">
        
        <section className="filtros-section">
          <h1>Gerar Relatório</h1>
          <FiltrosRelatorio
            filtros={filtros}
            onFiltroChange={handleFiltroChange}
            onPesquisar={handleGerarRelatorio}
          />
          {/* Adicione botões de exportar aqui ou no componente de filtros */}
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
             <BotaoExportar label="Baixar PDF" onClick={handleExportarPDF} cor="#d32f2f" />
             <BotaoExportar label="Baixar CSV" onClick={handleExportarCSV} cor="#1976d2" />
          </div>
        </section>

        <section className="cards-section">
          <div className="cards-container">
            {painelItems.map(item => (
              <PainelCard 
                key={item.id}
                titulo={item.titulo} 
                valor={item.valor} // Agora passa número real
                className={item.className}
              />
            ))}
          </div>
        </section>

        <section className="tabela-section">
          {loading ? <p>Carregando dados...</p> : (
              <TabelaComBuscaPaginacao
                titulo="Movimentações da Semente"
                dados={relatorios}
                colunas={colunas}
                
                // Desabilita busca interna do componente, pois já temos o FiltroRelatorio externo
                habilitarBusca={false} 
                mostrarAcoes={false}
                
                // Configuração de Paginação Real
                paginaAtual={paginaAtual + 1}
                totalPaginas={totalPaginas}
                onPaginaChange={(p) => carregarDados(p - 1)}
              />
          )}
        </section>
      </div>
    </div>
  );
};

export default GerarRelatorio;