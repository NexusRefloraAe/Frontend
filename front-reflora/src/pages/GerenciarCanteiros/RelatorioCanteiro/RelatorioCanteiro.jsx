import React, { useState, useEffect, useCallback } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import PainelCard from "../../../components/PainelCard/PainelCard";
import FiltrosRelatorio from "../../../components/FiltrosRelatorio/FiltrosRelatorio";
import { registroCanteiroService } from "../../../services/registroCanteiroService";
import "./RelatorioCanteiro.css";

const RelatorioCanteiro = () => {
  // --- ESTADOS ---
  const [loading, setLoading] = useState(false);
  const [itensPorPagina] = useState(9);
  const [ordem, setOrdem] = useState('data'); 
  const [direcao, setDirecao] = useState('desc');
  
  // Estados de paginação (Adicionados para bater com o JSX)
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const [dadosPainel, setDadosPainel] = useState({
    totalEntrada: 0,
    totalSaida: 0,
    totalAtual: 0,
    tabela: { 
      content: [],
      page: { totalPages: 0, number: 0, totalElements: 0 }
    },
  });

  const [filtros, setFiltros] = useState({
    nomePopular: "",
    dataInicio: "",
    dataFim: "",
  });

  // --- FUNÇÕES DE CARREGAMENTO ---
  const carregarDados = useCallback(
    async (pagina = 0, ordemArg = ordem, direcaoArg = direcao) => {
      setLoading(true);
      try {
        const data = await registroCanteiroService.getPainel(filtros, pagina, itensPorPagina, ordemArg, direcaoArg);
        setDadosPainel(data);
        
        // Sincroniza estados de paginação baseados no objeto 'page' do Postman
        if (data.tabela && data.tabela.page) {
            setTotalPaginas(data.tabela.page.totalPages);
            setPaginaAtual(data.tabela.page.number);
        }
      } catch (error) {
        console.error("Erro ao carregar relatório:", error);
        alert("Erro ao carregar relatório");
      } finally {
        setLoading(false);
      }
    },
    [filtros, itensPorPagina, ordem, direcao]
  );

  useEffect(() => {
    carregarDados();
  }, [itensPorPagina]);

  // --- ORDENAÇÃO ---
  const handleOrdenar = (novoCampo) => {
    let novaDirecao = 'asc';
    if (novoCampo === ordem) {
        novaDirecao = direcao === 'asc' ? 'desc' : 'asc';
    }
    setOrdem(novoCampo);
    setDirecao(novaDirecao);
    setPaginaAtual(0);
    carregarDados(0, novoCampo, novaDirecao);
  };

  const handleFiltroChange = (name, value) => {
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleGerarRelatorio = () => {
    carregarDados(0); 
  };

  // --- LÓGICA DE EXPORTAÇÃO (Adicionada conforme seu modelo preferido) ---
  const realizarDownload = (response, defaultName) => {
      const disposition = response.headers['content-disposition'];
      let fileName = defaultName;

      if (disposition) {
          const filenameRegex = /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/i;
          const matches = filenameRegex.exec(disposition);
          if (matches && matches[1]) { 
              fileName = decodeURIComponent(matches[1].replace(/['"]/g, '')); 
          }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
  };

  const handleExportarPDF = async () => {
      try { 
        const response = await registroCanteiroService.exportarPdf(filtros); 
        realizarDownload(response, 'relatorio_canteiro.pdf');
      } catch (e) { alert("Erro ao baixar PDF"); }
  };

  const handleExportarCSV = async () => {
      try { 
        const response = await registroCanteiroService.exportarCsv(filtros); 
        realizarDownload(response, 'relatorio_canteiro.csv');
      } catch (e) { alert("Erro ao baixar CSV"); }
  };

  // --- CONFIGURAÇÃO DE UI ---
  const painelItems = [
    { id: 1, titulo: 'Total Entrada', valor: dadosPainel.totalEntrada.toLocaleString(), className: 'card-entrada' },
    { id: 2, titulo: 'Total Saída', valor: dadosPainel.totalSaida.toLocaleString(), className: 'card-saida' },
    { id: 3, titulo: 'Saldo Atual', valor: dadosPainel.totalAtual.toLocaleString(), className: 'card-atual' },
  ];

  const colunas = [
    { key: "nomeCanteiro", label: "Canteiro", sortable: true },
    { key: "lote", label: "Lote Origem", sortable: true },
    { key: "nomePopular", label: "Espécie", sortable: true },
    { 
        key: "data", 
        label: "Data", 
        sortable: true,
        render: (item) => {
            if (!item.data) return '-';
            // Formata data ISO (yyyy-mm-dd) para PT-BR
            if (typeof item.data === 'string' && item.data.includes('-')) {
                const [ano, mes, dia] = item.data.split('-');
                return `${dia}/${mes}/${ano}`;
            }
            return item.data;
        }
    },
    { key: "tipoMovimento", label: "Movimento", sortable: true },
    { key: "quantidade", label: "Qtd (und)", sortable: true },
  ];

  return (
    <div className="relatorio-canteiro-container">
      <div className="relatorio-canteiro-content">
        <section className="filtros-section">
          <h1>Gerar Relatório</h1>
          <FiltrosRelatorio
            filtros={filtros}
            onFiltroChange={handleFiltroChange}
            onPesquisar={handleGerarRelatorio}
          />
        </section>

        <section className="cards-section">
          <div className="cards-container">
            {painelItems.map((item) => (
              <PainelCard key={item.id} {...item} />
            ))}
          </div>
        </section>

        <section className="tabela-section">
          {loading ? (
            <p>Carregando dados...</p>
          ) : (
            <TabelaComBuscaPaginacao
              titulo="Movimentações dos Canteiros"
              dados={dadosPainel.tabela.content}
              colunas={colunas}
              habilitarBusca={false}
              mostrarAcoes={false}
              
              // Paginação
              totalPaginas={totalPaginas}
              paginaAtual={paginaAtual + 1}
              onPaginaChange={(proximaPagina) => carregarDados(proximaPagina - 1)}
              itensPorPagina={itensPorPagina}
              onPesquisar={handleGerarRelatorio}

              // Exportação
              onExportPDF={handleExportarPDF}
              onExportCSV={handleExportarCSV}

              // Ordenação
              onOrdenar={handleOrdenar}
              ordemAtual={ordem}
              direcaoAtual={direcao}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default RelatorioCanteiro;