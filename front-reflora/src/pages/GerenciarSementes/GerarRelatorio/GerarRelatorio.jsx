import React, { useState, useEffect, useCallback } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import PainelCard from "../../../components/PainelCard/PainelCard";
import FiltrosRelatorio from "../../../components/FiltrosRelatorio/FiltrosRelatorio";
import './GerarRelatorio.css';

// 1. Importe o serviço
import { relatorioMovimentacaoSementeService } from "../../../services/relatorioMovimentacaoSementeService";

const GerarRelatorio = () => {
  // Estados de Dados
  const [relatorios, setRelatorios] = useState([]); // Lista da tabela
  const [loading, setLoading] = useState(false);
  
  // Estado dos Cards (Totais vindos do Backend)
  const [totais, setTotais] = useState({
      totalEntradaUnd: 0,
      totalEntradaKg: 0,
      totalSaidaUnd: 0,
      totalSaidaKg: 0,
      saldoDoPeriodoUnd: 0,
      saldoDoPeriodoKg: 0
  });

  // Estado de Paginação
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const [filtros, setFiltros] = useState({
    nomePopular: '',
    dataInicio: '',
    dataFim: ''
  });

  const [ordem, setOrdem] = useState('lote'); 
  const [direcao, setDirecao] = useState('desc');

  const handleOrdenar = (novoCampo) => {
    let novaDirecao = 'asc';
    
    // Se clicou na mesma coluna que já está ordenada, inverte a direção
    if (novoCampo === ordem) {
        novaDirecao = direcao === 'asc' ? 'desc' : 'asc';
    }

    setOrdem(novoCampo);
    setDirecao(novaDirecao);
    setPaginaAtual(0); // Volta para primeira página
    
    // Chama a busca com os novos parâmetros
    carregarDados(0, novoCampo, novaDirecao);
  };

  // 2. Função principal que busca dados na API
  // 3. ATUALIZAÇÃO DO CARREGAR DADOS
  // Agora aceita ordem e direção como argumentos (ou usa o estado atual)
  // Dentro de GerarRelatorio.js, na função carregarDados:

  const carregarDados = useCallback(async (pagina = 0, ordemArg = ordem, direcaoArg = direcao) => {
      try {
          setLoading(true);
          const data = await relatorioMovimentacaoSementeService.getPainel(filtros, pagina, 9, ordemArg, direcaoArg);

          setTotais({
              totalEntradaUnd: data.totalEntradaUnd,
              totalEntradaKg: data.totalEntradaKg,
              totalSaidaUnd: data.totalSaidaUnd,
              totalSaidaKg: data.totalSaidaKg,
              saldoDoPeriodoUnd: data.saldoDoPeriodoUnd,
              saldoDoPeriodoKg: data.saldoDoPeriodoKg
          });

          // CORREÇÃO AQUI: Acessando a estrutura correta baseada no seu Postman
          if (data.pageTabela) {
              setRelatorios(data.pageTabela.content || []);
              // No Postman: data.historico.page.totalPages
              setTotalPaginas(data.pageTabela.page?.totalPages || 0);
              // No Postman: data.historico.page.number
              setPaginaAtual(data.pageTabela.page?.number || 0);
          }

      } catch (error) {
          console.error("Erro ao carregar relatório:", error);
      } finally {
          setLoading(false);
      }
  }, [filtros, ordem, direcao]);

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

  const realizarDownload = (response, defaultName) => {
      const disposition = response.headers['content-disposition'];
      let fileName = defaultName;

      if (disposition) {
          const filenameRegex = /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/i;
          const matches = filenameRegex.exec(disposition);
          if (matches && matches[1]) { 
              fileName = matches[1].replace(/['"]/g, '');
              fileName = decodeURIComponent(fileName); 
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
        // Passa os filtros atuais para o backend gerar o PDF filtrado
        const response = await relatorioMovimentacaoSementeService.exportarPdf(filtros); 
        realizarDownload(response, 'relatorio_movimentacao.pdf');
      } catch (e) { 
        alert("Erro ao baixar PDF"); 
      }
  };

  const handleExportarCSV = async () => {
      try { 
        const response = await relatorioMovimentacaoSementeService.exportarCsv(filtros); 
        realizarDownload(response, 'relatorio_movimentacao.csv');
      } catch (e) { 
        alert("Erro ao baixar CSV"); 
      }
  };

  // Função utilitária para formatar números (ex: 1000 -> 1.000)
  const formatarNumero = (valor) => {
    return new Intl.NumberFormat('pt-BR').format(valor);
  };

  // Cards Dinâmicos baseados no Estado 'totais'
  const painelItems = [
    { 
      id: 1, 
      titulo: 'Total Entrada (Und)', 
      valor: formatarNumero(totais.totalEntradaUnd), 
      className: 'card-entrada'
    },{ 
      id: 2, 
      titulo: 'Total Entrada (Kg)', 
      valor: formatarNumero(totais.totalEntradaKg), 
      className: 'card-entrada'
    },
    { 
      id: 3, 
      titulo: 'Total Saída (Und)', 
      valor: formatarNumero(totais.totalSaidaUnd), 
      className: 'card-saida'
    },
    { 
      id: 4, 
      titulo: 'Total Saída (Kg)', 
      valor: formatarNumero(totais.totalSaidaKg), 
      className: 'card-saida'
    },
    { 
      id: 5, 
      titulo: 'Saldo do Período (Und)', 
      valor: formatarNumero(totais.saldoDoPeriodoUnd), 
      className: 'card-atual'
    },
    { 
      id: 6, 
      titulo: 'Saldo do Período (Kg)', 
      valor: formatarNumero(totais.saldoDoPeriodoKg), 
      className: 'card-atual'
    },
  ];

  // 3. Colunas: Chaves devem ser iguais ao DTO do Java (RegistroMovimentacaoResponseDTO)
  // Campos: lote, nomePopular, data, tipoMovimento, quantidade
  const colunas = [
    { key: "lote", label: "Lote", sortable: true },
    { key: "nomePopular", label: "Nome Popular", sortable: true },
    { 
        key: "data", 
        label: "Data",
        sortable: true,
        // Renderiza a data formatada (DD/MM/AAAA) se vier como string ISO
        render: (item) => {
            if (!item.data) return '-';
            // Se vier array [2024, 12, 25], precisa tratar diferente.
            // Se vier string "2024-12-25", fazemos split:
            if (typeof item.data === 'string') {
                const partes = item.data.split('-');
                if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
            }
            return item.data;
        }
    },
    { key: "tipoMovimento", label: "Tipo", sortable: true },
    { key: "quantidade", label: "Quantidade", sortable: true },
    { key: "unidadeDeMedida", label: "Und. de medida", sortable: true }
  ];

  return (
    <div className="gerar-relatorio-container auth-scroll-fix">
      <div className="gerar-relatorio-content">
        
        <section className="filtros-section">
          <h1>Gerar Relatório</h1>
          <FiltrosRelatorio
            filtros={filtros}
            onFiltroChange={handleFiltroChange}
            onPesquisar={handleGerarRelatorio}
            campoTexto={{
              label: "Nome Popular",
              name: "nomePopular",
              placeholder: "Digite o nome popular",
            }}
          />
        </section>

        <section className="cards-section">
          <div className="cards-container-sementes">
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

                onPesquisar={handleGerarRelatorio}
                
                // Desabilita busca interna do componente, pois já temos o FiltroRelatorio externo
                habilitarBusca={false} 
                mostrarAcoes={false}
                
                // Configuração de Paginação Real
                paginaAtual={paginaAtual + 1}
                totalPaginas={totalPaginas}
                onPaginaChange={(p) => carregarDados(p - 1)}

                onExportPDF={handleExportarPDF}
                onExportCSV={handleExportarCSV}

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

export default GerarRelatorio;