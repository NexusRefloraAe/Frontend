import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import FiltrosRelatorio from "../../../components/FiltrosRelatorio/FiltrosRelatorio";
import insumoService from "../../../services/insumoService"; // 👈 IMPORTAR
import "./GerarRelatorioInsumo.css";

const GerarRelatorioInsumo = () => {
  const [relatorios, setRelatorios] = useState([]);
  const [dadosOriginais, setDadosOriginais] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filtros, setFiltros] = useState({
    tipoInsumo: "Material",
    dataInicio: "",
    dataFim: "",
    nomeInsumo: "",
  });

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(5);
  const [termoBusca, setTermoBusca] = useState("");

  // 1. Carregar dados da API (Listagem na tela)
  const carregarDados = async () => {
    try {
      setLoading(true);
      // Backend espera 'MATERIAL' ou 'FERRAMENTA' (maiúsculo)
      const tipo = filtros.tipoInsumo.toUpperCase();

      const dados = await insumoService.getHistorico(tipo);

      // Mapear dados para a tabela
      const formatados = dados.map((item) => ({
        id: item.id,
        NomeInsumo: item.nomeInsumo,
        Data: formatarData(item.data), // Usa função auxiliar DD/MM/AAAA
        EstoqueAtual: item.quantidade, // Nota: Backend retorna qtd movimentada, talvez precise ajustar se quiser estoque atual do item
        Status: item.status,
        Responsavel: item.responsavelEntrega,
      }));

      setRelatorios(formatados);
      setDadosOriginais(formatados);
      setPaginaAtual(1);
    } catch (error) {
      console.error("Erro ao carregar:", error);
      alert("Erro ao buscar dados.");
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar de data
  const formatarData = (data) => {
    if (!data) return "-";

    // 1. Se o Back-end enviou como Array [2025, 2, 2] (Padrão Java LocalDate)
    if (Array.isArray(data)) {
      const [ano, mes, dia] = data;
      return `${dia.toString().padStart(2, "0")}/${mes
        .toString()
        .padStart(2, "0")}/${ano}`;
    }

    // 2. Se for uma String
    if (typeof data === "string") {
      // Se já tiver barras (ex: 02/02/2025), retorna ela mesma
      if (data.includes("/")) return data;

      // Se for formato ISO com hífens (ex: 2025-02-02)
      if (data.includes("-")) {
        const parts = data.split("T")[0].split("-"); // Remove o tempo se houver
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }

    return data.toString();
  };

  // 2. Atualizar lista quando muda o Tipo (Material/Ferramenta)
  useEffect(() => {
    carregarDados();
  }, [filtros.tipoInsumo]);

  const handleFiltroChange = (name, value) => {
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Filtragem Local (Pesquisar na tabela já carregada)
  const handleFiltrarLocalmente = () => {
    // Mesma lógica de filtro dos outros arquivos
    const { nomeInsumo, dataInicio, dataFim } = filtros;

    const filtrados = dadosOriginais.filter((item) => {
      const matchNome =
        !nomeInsumo ||
        item.NomeInsumo.toLowerCase().includes(nomeInsumo.toLowerCase());

      let matchData = true;
      if (dataInicio || dataFim) {
        const [d, m, y] = item.Data.split("/");
        const itemDate = new Date(`${y}-${m}-${d}`);
        itemDate.setHours(0, 0, 0, 0);

        if (dataInicio && itemDate < new Date(dataInicio)) matchData = false;
        if (dataFim) {
          const fim = new Date(dataFim);
          fim.setDate(fim.getDate() + 1);
          if (itemDate >= fim) matchData = false;
        }
      }
      return matchNome && matchData;
    });
    setRelatorios(filtrados);
    setPaginaAtual(1);
  };

  // 4. Downloads (Chama a API de exportação)
  const handleExportar = async (formato) => {
    const params = {
      tipoInsumo: filtros.tipoInsumo.toUpperCase(),
      dataInicio: filtros.dataInicio || null,
      dataFim: filtros.dataFim || null,
    };

    try {
      if (formato === "pdf") await insumoService.downloadPdf(params);
      else await insumoService.downloadCsv(params);
    } catch (e) {
      alert("Erro ao exportar arquivo.");
    }
  };

  // Definição das colunas
  const colunas = [
    { key: "NomeInsumo", label: "Nome" },
    { key: "Data", label: "Data" },
    { key: "Status", label: "Movimento" },
    { key: "EstoqueAtual", label: "Qtd." }, // Reutilizando a label, mas mostra qtd mov
    { key: "Responsavel", label: "Responsável" },
  ];

  return (
    <div className="gerar-relatorio-insumo-container auth-scroll-fix ">
      <div className="gerar-relatorio-insumo-content ">
        
        {/* Seção de Filtros */}
        <section className="filtros-section">
          <h1>Gerar Relatório</h1>

          <div className="tipo-insumo-selector">
            <label>Tipo de Insumo:</label>
            <div className="tipo-insumo-buttons">
              <button
                className={filtros.tipoInsumo === "Material" ? "active" : ""}
                onClick={() => handleFiltroChange("tipoInsumo", "Material")}
              >
                Materiais
              </button>
              <button
                className={filtros.tipoInsumo === "Ferramenta" ? "active" : ""}
                onClick={() => handleFiltroChange("tipoInsumo", "Ferramenta")}
              >
                Ferramentas
              </button>
            </div>
          </div>

          <FiltrosRelatorio
            filtros={filtros}
            onFiltroChange={handleFiltroChange}
            onPesquisar={handleFiltrarLocalmente}
            mostrarNomeInsumo={true}
            campoTexto={{
              label: "Nome do Insumo",
              name: "nomeInsumo",
              placeholder: "Digite o nome do insumo",

            }}
            camposFiltro={[
              // Adicione os campos que faltam
              { name: "nomeInsumo", label: "Nome", type: "text" },
              { name: "dataInicio", label: "Início", type: "date" },
              { name: "dataFim", label: "Fim", type: "date" },
            ]}
          />

          {/* Botões de Exportação
          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
            <button
              onClick={() => handleExportar("csv")}
              className="btn-export"
            >
              Exportar CSV
            </button>
            <button
              onClick={() => handleExportar("pdf")}
              className="btn-export"
            >
              Exportar PDF
            </button>
          </div> */}
        </section>

        <section className="tabela-section">
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <TabelaComBuscaPaginacao
              titulo={`Relatório de ${filtros.tipoInsumo}`}
              dados={relatorios}
              colunas={colunas}
              chaveBusca="NomeInsumo"
              habilitarBusca={false} // Já temos busca nos filtros
              mostrarAcoes={false}
              paginaAtual={paginaAtual}
              itensPorPagina={itensPorPagina}
              onPaginaChange={setPaginaAtual}
              onItensPorPaginaChange={setItensPorPagina}
              onExportPDF={() => handleExportar("pdf")}
              onExportCSV={() => handleExportar("csv")}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default GerarRelatorioInsumo;
