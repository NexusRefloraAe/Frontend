import api from "./api";

export const distribuicaoService = {
  // POST: Enviar os dados para o banco e baixar o estoque
  salvar: async (dados) => {
    const response = await api.post("/distribuicoes", dados);
    return response.data;
  },

  // GET: Baixar o PDF oficial gerado pelo iText no Java
  baixarTermoPdf: async (id) => {
    const response = await api.get(`/distribuicoes/${id}/termo-compromisso`, {
      responseType: "blob",
    });
    return response.data;
  },

  // 💡 NOVO: GET com Specification e Filtros
  obterDadosRelatorio: async (params) => {
    // params contém: instituicao, dataInicio, dataFim, page, size, sort
    const response = await api.get("/distribuicoes/relatorio", { params });
    return response.data;
  },

  exportarPdf: async (params) => {
    // 💡 REMOVA o .data para retornar o objeto completo (headers + data)
    const response = await api.get("/distribuicoes/relatorio/pdf", {
      params,
      responseType: "blob",
    });
    return response; // Retorna tudo para que o realizarDownload funcione
  },

  exportarCsv: async (params) => {
    // 💡 REMOVA o .data aqui também
    const response = await api.get("/distribuicoes/relatorio/csv", {
      params,
      responseType: "blob",
    });
    return response;
  },
};
