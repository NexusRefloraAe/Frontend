import React, { useState, useEffect, useCallback } from "react";
import TabelaResponsiva from "../../../components/TabelaResponsiva/TabelaResponsiva";
import PainelCard from "../../../components/PainelCard/PainelCard";
import FiltrosRelatorio from "../../../components/FiltrosRelatorio/FiltrosRelatorio";
import Paginacao from "../../../components/Paginacao/Paginacao";
import ExportButton from "../../../components/ExportButton/ExportButton";

// Services e Utils
import { registroCanteiroService } from "../../../services/registroCanteiroService";
import { getBackendErrorMessage } from "../../../utils/errorHandler";

import "./RelatorioCanteiro.css";

const RelatorioCanteiro = () => {
  // --- ESTADOS ---
  const [loading, setLoading] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [ordem, setOrdem] = useState("data");
  const [direcao, setDirecao] = useState("desc");

  const [filtros, setFiltros] = useState({
    nomePopular: "",
    dataInicio: "",
    dataFim: "",
  });

  const [dadosPainel, setDadosPainel] = useState({
    totalEntrada: 0,
    totalSaida: 0,
    totalAtual: 0,
    tabela: { content: [] },
  });

  const ITENS_POR_PAGINA = 9;

  // --- CARREGAMENTO DE DADOS ---
  const fetchDados = useCallback(
    async (pagina = 1) => {
      setLoading(true);
      try {
        // O Spring espera a página começando em 0, por isso (pagina - 1)
        const data = await registroCanteiroService.getPainel(
          filtros,
          pagina - 1,
          ITENS_POR_PAGINA,
          ordem,
          direcao
        );

        setDadosPainel(data);
        // Sincroniza a paginação vinda do objeto Page do Spring
        setTotalPaginas(data.tabela?.page?.totalPages || 1);
        setPaginaAtual(pagina);
      } catch (error) {
        console.error(error);
        alert(getBackendErrorMessage(error));
      } finally {
        setLoading(false);
      }
    },
    [filtros, ordem, direcao]
  );

  // Carrega ao montar ou quando ordem/direção mudar
  useEffect(() => {
    fetchDados(1);
  }, [fetchDados]);

  // --- HANDLERS ---
  const handleFiltroChange = (name, value) => {
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleGerarRelatorio = () => {
    fetchDados(1); // Sempre volta para a página 1 ao filtrar
  };

  const handleOrdenar = (campo) => {
    const novaDirecao = campo === ordem && direcao === "asc" ? "desc" : "asc";
    setOrdem(campo);
    setDirecao(novaDirecao);
  };

  // Helper para processar downloads de arquivos (Blob)
  const realizarDownload = (response, defaultName) => {
    const disposition = response.headers["content-disposition"];
    let fileName = defaultName;

    if (disposition) {
      const filenameRegex =
        /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/i;
      const matches = filenameRegex.exec(disposition);
      if (matches && matches[1]) {
        fileName = decodeURIComponent(matches[1].replace(/['"]/g, ""));
      }
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleExportarPDF = async () => {
    try {
      const res = await registroCanteiroService.exportarPdf(filtros);
      realizarDownload(res, "relatorio_canteiro.pdf");
    } catch (e) {
      alert("Erro ao baixar PDF");
    }
  };

  const handleExportarCSV = async () => {
    try {
      const res = await registroCanteiroService.exportarCsv(filtros);
      realizarDownload(res, "relatorio_canteiro.csv");
    } catch (e) {
      alert("Erro ao baixar CSV");
    }
  };

  // --- CONFIGURAÇÃO DE UI ---
  const painelItems = [
    {
      id: 1,
      titulo: "Total Entrada",
      valor: dadosPainel.totalEntrada.toLocaleString(),
      className: "card-entrada",
    },
    {
      id: 2,
      titulo: "Total Saída",
      valor: dadosPainel.totalSaida.toLocaleString(),
      className: "card-saida",
    },
    {
      id: 3,
      titulo: "Saldo Atual",
      valor: dadosPainel.totalAtual.toLocaleString(),
      className: "card-atual",
    },
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
        if (!item.data) return "-";
        // Formata data ISO (yyyy-mm-dd) para PT-BR
        if (typeof item.data === "string" && item.data.includes("-")) {
          const [ano, mes, dia] = item.data.split("-");
          return `${dia}/${mes}/${ano}`;
        }
        return item.data;
      },
    },
    { key: "tipoMovimento", label: "Movimento", sortable: true },
    { key: "quantidade", label: "Qtd (und)", sortable: true },
  ];

  return (
    <div className="relatorio-canteiro-container auth-scroll-fix">
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
          <TabelaResponsiva
            titulo="Movimentações dos Canteiros"
            dados={dadosPainel.tabela.content}
            colunas={colunas}
            loading={loading}
            onOrdenar={handleOrdenar}
            ordemAtual={ordem}
            direcaoAtual={direcao}
            footerContent={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  flexWrap: "wrap",
                  gap: "15px",
                }}
              >
                <Paginacao
                  paginaAtual={paginaAtual}
                  totalPaginas={totalPaginas}
                  onPaginaChange={fetchDados}
                />
                <ExportButton
                  onExportPDF={handleExportarPDF}
                  onExportCSV={handleExportarCSV}
                  fileName="relatorio_canteiro"
                />
              </div>
            }
          />
        </section>
      </div>
    </div>
  );
};

export default RelatorioCanteiro;
