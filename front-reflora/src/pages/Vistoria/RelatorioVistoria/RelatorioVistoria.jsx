import React, { useState, useEffect, useCallback } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import PainelCard from "../../../components/PainelCard/PainelCard"; // 1. Importado
import FiltrosRelatorio from "../../../components/FiltrosRelatorio/FiltrosRelatorio";
import './RelatorioVistoria.css'; // 2. CSS será atualizado
import { vistoriaService } from "../../../services/vistoriaService";

const RelatorioVistoria = () => {
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalVistoriasGeral, setTotalVistoriasGeral] = useState(0);
  const [ordem, setOrdem] = useState('dataVistoria'); // Campo inicial de ordenação
  const [direcao, setDirecao] = useState('desc'); // Direção inicial
  
  // Estados de Paginação
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [itensPorPagina, setItensPorPagina] = useState(5);

  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    beneficiario: ''
  });

  // --- FUNÇÃO PARA CARREGAR DADOS ---
  const carregarDadosRelatorio = useCallback(async (pagina = 0, ordemArg = ordem, direcaoArg = direcao) => {
    setLoading(true);
    try {
      // O Back-end espera a página começando em 0
      const data = await vistoriaService.getRelatorio(filtros, pagina, itensPorPagina, ordemArg, direcaoArg);
      
      // Mapeamento baseado na sua resposta do Postman
      setRelatorios(data.itens.content || []);
      setTotalVistoriasGeral(data.totalVistorias);
      
      if (data.itens.page) {
        setTotalPaginas(data.itens.page?.totalPages);
        setPaginaAtual(data.itens.page?.number || 0); // Volta para base 1 para o Front
      }
    } catch (error) {
      console.error("Erro ao carregar relatório:", error);
    } finally {
      setLoading(false);
    }
  }, [filtros, itensPorPagina, ordem, direcao]);

  // useEffect monitora a paginaAtual. 
  // Sempre que ela mudar (via paginação ou reset do botão pesquisar), carrega os dados.
  useEffect(() => {
    carregarDadosRelatorio(0);
  }, []);

  const handleOrdenar = (novoCampo) => {
    let novaDirecao = 'asc';
    
    // Se clicar na mesma coluna que já está ordenada, inverte a direção
    if (novoCampo === ordem) {
        novaDirecao = direcao === 'asc' ? 'desc' : 'asc';
    }

    setOrdem(novoCampo);
    setDirecao(novaDirecao);
    setPaginaAtual(0); // Volta para a primeira página ao reordenar
    
    // Chama a busca imediatamente com os novos valores
    carregarDadosRelatorio(0, novoCampo, novaDirecao);
  };

  // --- LÓGICA DE EXPORTAÇÃO ---
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
          const response = await vistoriaService.exportarRelatorioPdf(filtros);
          realizarDownload(response, 'relatorio_vistorias.pdf');
      } catch (error) {
          alert("Erro ao exportar PDF.");
      }
  };

  const handleExportarCsv = async () => {
    try{
      const response = await vistoriaService.exportarRelatorioCsv(filtros);
      realizarDownload(response, 'relatorio_vistorias.csv')
    } catch (error) {
      alert("Erro ao exportar CSV.")
    }
  }

  const handleFiltroChange = (name, value) => {
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

// --- BOTÃO PESQUISAR ---
  const handleGerarRelatorio = () => {
    carregarDadosRelatorio(0);
  };

  // 5. Remove 'handleBuscaChange' e estados de paginação/busca

  const colunas = [
    { key: "local", label: "Local / Canteiro", sortable: true, sortKey: "plantioCanteiro.canteiro.nome" },
    { key: "especie", label: "Espécie", sortable: true, sortKey: "plantioCanteiro.plantioOrigem.sementes.nomePopular" },
    { key: "quantidade", label: "Quantidade", sortable: true, sortKey: "estimativaMudasProntas" },
    { key: "data", label: "Data", sortable: true, sortKey: "dataVistoria" },
    { key: "nomeResponsavel", label: "Nome do Responsável", sortable: true }
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
            {/* O valor agora vem do totalVistoriasGeral do Back-end */}
            <PainelCard 
              titulo="Total Vistorias" 
              valor={totalVistoriasGeral}
              className="card-total"
            />
          </div>
        </section>

        {/* Seção da Tabela */}
        <section className="tabela-section">
          <TabelaComBuscaPaginacao
            titulo="Relatório de Vistorias"
            dados={relatorios}
            colunas={colunas}
            isLoading={loading}

            onPesquisar={handleGerarRelatorio}

            chaveBusca="Especie"
            habilitarBusca={false} // 7. Alterado para false
            mostrarAcoes={false}
            // 8. Remove props de paginação e busca externa
            paginaAtual={paginaAtual + 1}
            totalPaginas={totalPaginas}
            onPaginaChange={(p) => carregarDadosRelatorio(p - 1)}

            onOrdenar={handleOrdenar}
            ordemAtual={ordem}
            direcaoAtual={direcao}
            
            onExportPDF={handleExportarPDF}
            onExportCSV={handleExportarCsv}
          />
        </section>
      </div>
    </div>
  );
};

export default RelatorioVistoria;