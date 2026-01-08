import React, { useState, useEffect } from "react";
import TabelaResponsiva from "../../../components/TabelaResponsiva/TabelaResponsiva";
import PainelCard from "../../../components/PainelCard/PainelCard";
import FiltrosRelatorio from "../../../components/FiltrosRelatorio/FiltrosRelatorio";
import ExportButton from "../../../components/ExportButton/ExportButton";
import "./RelatorioDistribuicao.css";

/* ================= MOCK SERVICE ================= */
const distribuicaoService = {
  getRelatorio: async () => {
    return {
      tabela: {
        content: [
          {
            id: 1,
            instituicao: "Prefeitura de João Pessoa",
            cidade: "João Pessoa",
            estado: "PB",
            dataEntrega: "2025-12-28",
            quantidade: 5000,
          },
          {
            id: 2,
            instituicao: "ONG Reflorar",
            cidade: "Campina Grande",
            estado: "PB",
            dataEntrega: "2025-12-29",
            quantidade: 6000,
          },
        ],
      },
    };
  },
};
/* ================================================= */

const RelatorioDistribuicao = () => {
  const [loading, setLoading] = useState(false);

  // 🔹 dados
  const [distribuicoes, setDistribuicoes] = useState([]);
  const [dadosOriginais, setDadosOriginais] = useState([]);

  // 🔹 filtros
  const [filtros, setFiltros] = useState({
    localizacao: "",
    dataInicio: "",
    dataFim: "",
  });

  /* ============ CARREGAR DADOS ============ */
  const carregarDados = async () => {
    setLoading(true);
    try {
      const res = await distribuicaoService.getRelatorio();
      setDistribuicoes(res.tabela.content);
      setDadosOriginais(res.tabela.content);
    } catch (e) {
      alert("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  /* ============ FILTRO REAL ============ */
  const handlePesquisar = () => {
    const { localizacao, dataInicio, dataFim } = filtros;

    const dadosFiltrados = dadosOriginais.filter((item) => {
      // 🔹 filtro destino
      const destino = `${item.cidade} ${item.estado}`.toLowerCase();
      const matchesDestino =
        !localizacao || destino.includes(localizacao.toLowerCase());

      // 🔹 filtro data
      let matchesData = true;
      if (dataInicio || dataFim) {
        const itemDate = new Date(item.dataEntrega);
        const startDate = dataInicio ? new Date(dataInicio) : null;
        const endDate = dataFim ? new Date(dataFim) : null;

        if (startDate && itemDate < startDate) matchesData = false;
        if (endDate && itemDate > endDate) matchesData = false;
      }

      return matchesDestino && matchesData;
    });

    setDistribuicoes(dadosFiltrados);
  };

  const handleFiltroChange = (name, value) => {
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  /* ============ TOTAL DINÂMICO ============ */
  const totalDistribuido = distribuicoes.reduce(
    (soma, item) => soma + item.quantidade,
    0
  );

  /* ============ COLUNAS ============ */
  const colunas = [
    { key: "instituicao", label: "Instituição" },
    {
      key: "destino",
      label: "Destino",
      render: (item) => `${item.cidade} - ${item.estado}`,
    },
    {
      key: "dataEntrega",
      label: "Data",
      render: (item) => {
        const [ano, mes, dia] = item.dataEntrega.split("-");
        return `${dia}/${mes}/${ano}`;
      },
    },
    {
      key: "quantidade",
      label: "Quantidade",
      render: (item) => item.quantidade.toLocaleString(),
    },
  ];

  return (
    <div className="relatorio-distribuicao-container auth-scroll-fix">
      <div className="relatorio-distribuicao-content">

        {/* 🔹 FILTROS */}
        <section className="filtros-section">
          <h1>Relatório de Distribuição de Mudas</h1>
          <FiltrosRelatorio
            filtros={filtros}
            onFiltroChange={handleFiltroChange}
            onPesquisar={handlePesquisar}
            campoTexto={{
              label: "Destino",
              name: "localizacao",
              placeholder: "Digite o destino"
            }}
          />

        </section>

        {/* 🔹 CARD */}
        <section className="cards-section">
          <div className="cards-container-single">
            <PainelCard
              titulo="Total Distribuído"
              valor={totalDistribuido.toLocaleString()}
              className="card-total-distribuido"
            />
          </div>
        </section>

        {/* 🔹 TABELA */}
        <section className="tabela-section">
          <TabelaResponsiva
            dados={distribuicoes}
            colunas={colunas}
            loading={loading}
            footerContent={
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
