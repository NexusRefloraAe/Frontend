import React, { useState, useEffect, useCallback } from "react";
import TabelaResponsiva from "../../../components/TabelaResponsiva/TabelaResponsiva";
import PainelCard from "../../../components/PainelCard/PainelCard";
import FiltrosRelatorio from "../../../components/FiltrosRelatorio/FiltrosRelatorio";
import ExportButton from "../../../components/ExportButton/ExportButton";
import Paginacao from "../../../components/Paginacao/Paginacao";
import { distribuicaoService } from "../../../services/distribuicaoService";
import { getBackendErrorMessage } from "../../../utils/errorHandler";
import "./RelatorioDistribuicao.css";

const RelatorioDistribuicao = () => {
  const [loading, setLoading] = useState(false);
  const [distribuicoes, setDistribuicoes] = useState([]);
  const [totalGeralMudas, setTotalGeralMudas] = useState(0);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // 1. 🔹 Estados de Ordenação
  const [ordem, setOrdem] = useState("dataEntrega"); // Campo padrão
  const [direcao, setDirecao] = useState("desc"); // Direção padrão

  const [filtros, setFiltros] = useState({
    instituicao: "",
    dataInicio: "",
    dataFim: "",
  });

  const [filtrosAplicados, setFiltrosAplicados] = useState({
    instituicao: "",
    dataInicio: "",
    dataFim: "",
  });

  /* ============ CARREGAR DADOS DO BACK-END ============ */
  const carregarDados = useCallback(async () => {
    setLoading(true);
    try {
      const res = await distribuicaoService.obterDadosRelatorio({
        instituicao: filtrosAplicados.instituicao,
        inicio: filtrosAplicados.dataInicio || null,
        fim: filtrosAplicados.dataFim || null,
        page: paginaAtual - 1,
        size: 9,
        // 💡 2. Ordenação dinâmica enviada para o Spring
        sort: `${ordem},${direcao}`,
      });

      setDistribuicoes(res.dados.content);
      setTotalGeralMudas(res.totalGeralMudas);
      setTotalPaginas(res.dados.totalPages);
    } catch (e) {
      alert("Erro ao carregar dados: " + getBackendErrorMessage(e));
    } finally {
      setLoading(false);
    }
    // 💡 3. Adicione ordem e direcao às dependências para recarregar ao mudar
  }, [paginaAtual, filtrosAplicados, ordem, direcao]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  /* ============ CONTROLES DE FILTRO E ORDEM ============ */

  const handleFiltroChange = (name, value) => {
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handlePesquisar = () => {
    setPaginaAtual(1);
    setFiltrosAplicados({ ...filtros });
  };

  // 💡 4. Função para alternar a ordenação
  const handleOrdenar = (campo) => {
    const novaDirecao = ordem === campo && direcao === "asc" ? "desc" : "asc";
    setOrdem(campo);
    setDirecao(novaDirecao);
    setPaginaAtual(1); // Opcional: volta para a página 1 ao reordenar
  };

  const realizarDownload = (response, defaultName) => {
    const disposition = response.headers["content-disposition"];
    let fileName = defaultName;

    if (disposition) {
      // Regex para capturar o valor após "filename="
      const filenameRegex = /filename\*?=['"]?(?:UTF-8'')?([^;\r\n"']*)['"]?;?/i;
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

  const handleExportarPdf = async () => {
    setLoading(true);
    try {
      // 💡 O 'res' agora contém o objeto completo (data e headers)
      const res = await distribuicaoService.exportarPdf({
        instituicao: filtrosAplicados.instituicao,
        inicio: filtrosAplicados.dataInicio,
        fim: filtrosAplicados.dataFim
      });
      realizarDownload(res, 'Relatorio_Distribuicao.pdf');
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportarCsv = async () => {
    setLoading(true);
    try {
      const res = await distribuicaoService.exportarCsv({
        instituicao: filtrosAplicados.instituicao,
        inicio: filtrosAplicados.dataInicio,
        fim: filtrosAplicados.dataFim
      });
      realizarDownload(res, 'Relatorio_Distribuicao.csv');
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar CSV.");
    } finally {
      setLoading(false);
    }
  };

  /* ============ DEFINIÇÃO DAS COLUNAS ============ */
  const colunas = [
    {
      key: "instituicao",
      label: "Instituição",
      sortable: true,
      sortKey: "instituicao",
    },
    {
      key: "destino",
      label: "Destino",
      sortable: true,
      sortKey: "municipioDistribuicao",
    },
    {
      key: "dataEntrega",
      label: "Data",
      align: "center",
      sortable: true,
      sortKey: "dataEntrega",
    },
    {
      key: "quantidade",
      label: "Quantidade",
      align: "right",
      render: (item) => item.quantidade.toLocaleString(),
      sortable: true,
      sortKey: "quantidade",
    },
  ];

  return (
    <div className="relatorio-distribuicao-container auth-scroll-fix">
      <div className="relatorio-distribuicao-content">
        <section className="filtros-section">
          <h1>Relatório de Distribuição de Mudas</h1>
          <FiltrosRelatorio
            filtros={filtros}
            onFiltroChange={handleFiltroChange}
            onPesquisar={handlePesquisar}
            campoTexto={{
              label: "Instituição",
              name: "instituicao",
              placeholder: "Pesquisar por instituição...",
            }}
          />
        </section>

        <section className="cards-section">
          <div className="cards-container-single">
            <PainelCard
              titulo="Total Distribuído"
              valor={totalGeralMudas.toLocaleString()}
              className="card-total-distribuido"
            />
          </div>
        </section>

        <section className="tabela-section">
          <TabelaResponsiva
            dados={distribuicoes}
            colunas={colunas}
            loading={loading}
            // 💡 5. Conecte a lógica de ordenação à tabela
            onOrdenar={handleOrdenar}
            ordemAtual={ordem}
            direcaoAtual={direcao}
            footerContent={
              <div
                className="footer-relatorio-acoes"
                style={{
                  display: "flex",
                  justifyContent:
                    totalPaginas > 1 ? "space-between" : "flex-end",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {totalPaginas > 1 && (
                  <Paginacao
                    paginaAtual={paginaAtual}
                    totalPaginas={totalPaginas}
                    onPaginaChange={setPaginaAtual}
                  />
                )}
                <ExportButton 
                  fileName="relatorio_distribuicao" 
                  onExportPDF={handleExportarPdf}
                  onExportCSV={handleExportarCsv}
                />
              </div>
            }
          />
        </section>
      </div>
    </div>
  );
};

export default RelatorioDistribuicao;
