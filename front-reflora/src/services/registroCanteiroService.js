import api from "./api";

export const registroCanteiroService = {
  // Busca os dados do painel (Cards + Tabela Paginada)
  getPainel: async (
    filtros,
    pagina = 0,
    tamanho = 9,
    ordem = "data",
    ordenacao = "desc"
  ) => {
    try {
      const params = {
        page: pagina,
        size: tamanho,
        sort: `${ordem},${ordenacao}`,
        ...(filtros.nomePopular && { nomePopular: filtros.nomePopular }),
        ...(filtros.dataInicio && { dataInicio: filtros.dataInicio }),
        ...(filtros.dataFim && { dataFim: filtros.dataFim }),
      };

      const response = await api.get("/registros/canteiros/painel", { params });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados do painel:", error);
      throw error;
    }
  },

  // Exportar PDF
  exportarPdf: (filtros) => {
    const params = {
      ...(filtros.nomePopular && { nomePopular: filtros.nomePopular }),
      ...(filtros.dataInicio && { dataInicio: filtros.dataInicio }),
      ...(filtros.dataFim && { dataFim: filtros.dataFim }),
    };
    // URL bate com seu Controller: /api/registros/canteiros/export/pdf
    return api.get("/registros/canteiros/export/pdf", {
      params,
      responseType: "blob",
    });
  },

  // Exportar CSV
  exportarCsv: (filtros) => {
    const params = {
      ...(filtros.nomePopular && { nomePopular: filtros.nomePopular }),
      ...(filtros.dataInicio && { dataInicio: filtros.dataInicio }),
      ...(filtros.dataFim && { dataFim: filtros.dataFim }),
    };
    return api.get("/registros/canteiros/export/csv", {
      params,
      responseType: "blob",
    });
  },
};
