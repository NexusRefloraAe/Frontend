import React, { useState, useEffect, useCallback } from "react";
// Adicione useLocation para pegar os dados vindos do termo
import { useLocation } from "react-router-dom"; 
import TabelaResponsiva from "../../../components/TabelaResponsiva/TabelaResponsiva";
import PainelCard from "../../../components/PainelCard/PainelCard";
import FiltrosRelatorio from "../../../components/FiltrosRelatorio/FiltrosRelatorio";
import Paginacao from "../../../components/Paginacao/Paginacao";
import ExportButton from "../../../components/ExportButton/ExportButton";
import { getBackendErrorMessage } from "../../../utils/errorHandler";
import "./RelatorioDistribuicao.css";

// MOCK SERVICE (Dados iniciais)
const distribuicaoService = {
  getRelatorio: async (filtros, page, size, sort, dir) => {
    return {
      totalDistribuido: 11000,
      tabela: {
        content: [
          {
            id: 1,
            instituicao: "Prefeitura de João Pessoa",
            cidade: "João Pessoa",
            estado: "PB",
            dataEntrega: "2025-12-28",
            quantidade: 5000,
            responsavelRecebimento: "João da Silva",
          },
          {
            id: 2,
            instituicao: "ONG Reflorar",
            cidade: "Campina Grande",
            estado: "PB",
            dataEntrega: "2025-12-29",
            quantidade: 6000,
            responsavelRecebimento: "Maria Souza",
          }
        ],
        page: { totalPages: 1 }
      }
    };
  },
  exportarPdf: async () => {},
  exportarCsv: async () => {},
};

const RelatorioDistribuicao = () => {
  const location = useLocation(); // Hook para ler os dados enviados pelo Termo
  const [loading, setLoading] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [ordem, setOrdem] = useState("dataEntrega");
  const [direcao, setDirecao] = useState("desc");

  const [filtros, setFiltros] = useState({
    destino: "", 
    dataInicio: "",
    dataFim: "",
  });

  const [dadosRelatorio, setDadosRelatorio] = useState({
    totalDistribuido: 0,
    tabela: { content: [] },
  });

  const ITENS_POR_PAGINA = 10;

  // Carregamento inicial do Mock
  const fetchDados = useCallback(async (pagina = 1) => {
      setLoading(true);
      try {
        const data = await distribuicaoService.getRelatorio(filtros, pagina - 1, ITENS_POR_PAGINA, ordem, direcao);
        setDadosRelatorio(data);
        setTotalPaginas(data.tabela?.page?.totalPages || 1);
        setPaginaAtual(pagina);
      } catch (error) {
        console.error(error);
        alert(getBackendErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }, [filtros, ordem, direcao]);

  useEffect(() => {
    fetchDados(1);
  }, [fetchDados]);

  // --- EFEITO PARA ADICIONAR DADO NOVO VINDO DO TERMO ---
  useEffect(() => {
    // Verifica se veio uma "novaDistribuicao" no state da navegação
    if (location.state && location.state.novaDistribuicao) {
        const novoItem = location.state.novaDistribuicao;
        
        setDadosRelatorio(prev => {
            // Evita duplicar se o ID já existir (opcional, mas bom pra evitar bugs de react strict mode)
            if (prev.tabela.content.find(item => item.id === novoItem.id)) {
                return prev;
            }

            return {
                ...prev,
                // Soma ao total
                totalDistribuido: prev.totalDistribuido + novoItem.quantidade,
                tabela: {
                    ...prev.tabela,
                    // Adiciona o novo item no topo da lista
                    content: [novoItem, ...prev.tabela.content]
                }
            };
        });
        
        // Limpa o state para não adicionar novamente se der refresh (opcional)
        window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleFiltroChange = (name, value) => setFiltros((prev) => ({ ...prev, [name]: value }));
  const handleGerarRelatorio = () => fetchDados(1);
  const handleOrdenar = (campo) => {
    setOrdem(campo);
    setDirecao(campo === ordem && direcao === "asc" ? "desc" : "asc");
  };

  const colunas = [
    { key: "instituicao", label: "Instituição", sortable: true },
    { key: "localizacao", label: "Destino", render: (item) => `${item.cidade} - ${item.estado}` },
    {
      key: "dataEntrega",
      label: "Data",
      sortable: true,
      render: (item) => item.dataEntrega ? item.dataEntrega.split("-").reverse().join("/") : "-"
    },
    { key: "quantidade", label: "Qtd.", render: (item) => item.quantidade.toLocaleString() },
  ];

  return (
    <div className="relatorio-distribuicao-container auth-scroll-fix">
      <div className="relatorio-distribuicao-content">
        <section className="filtros-section">
          <h1>Relatório de Distribuição</h1>
          <FiltrosRelatorio 
            filtros={filtros} 
            onFiltroChange={handleFiltroChange} 
            onPesquisar={handleGerarRelatorio} 
            placeholderBusca="Filtrar por Destino (Cidade)..."
            campoBusca="destino" 
          />
        </section>

        <section className="cards-section">
            <div className="cards-container-single">
                 <PainelCard 
                    id={1} titulo="Total Distribuído" 
                    valor={dadosRelatorio.totalDistribuido.toLocaleString()} 
                    className="card-total-distribuido" 
                 />
            </div>
        </section>

        <section className="tabela-section">
          <TabelaResponsiva
            dados={dadosRelatorio.tabela.content}
            colunas={colunas}
            loading={loading}
            onOrdenar={handleOrdenar}
            ordemAtual={ordem}
            direcaoAtual={direcao}
            footerContent={
              <div className="tabela-footer-actions">
                <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} onPaginaChange={fetchDados} />
                <ExportButton fileName="relatorio_distribuicao" />
              </div>
            }
          />
        </section>
      </div>
    </div>
  );
};

export default RelatorioDistribuicao;