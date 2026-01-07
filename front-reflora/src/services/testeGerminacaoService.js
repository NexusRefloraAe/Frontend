import api from "./api";

export const testeGerminacaoService = {
  // GET: Listar Testes
  getAll: async (
    termoBusca = "",
    pagina = 0,
    itensPorPagina = 5,
    ordem = "dataPlantio",
    direcao = "desc"
  ) => {
    const params = {
      searchTerm: termoBusca,
      page: pagina,
      size: itensPorPagina,
      sort: `${ordem},${direcao}`,
    };
    const response = await api.get("/movimentacoes/testeGerminacao", {
      params,
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/movimentacoes/${id}`);
    return response.data;
  },

  // POST: Criar Teste
  create: async (formData) => {
    const testeDTO = {
      tipo_movimentacao: "germinacao",
      finalidade: "TESTE_DE_GERMINACAO",
      loteSemente: formData.lote,
      dataPlantio: formatarDataParaJava(formData.dataTeste),
      tipoPlantio: "Sementeira",

      // --- NOVOS CAMPOS SINCRONIZADOS ---
      qtdSemente: Number(formData.quantidade), // Peso/Total que sai do estoque
      numSementesPlantadas: Number(formData.numSementesPlantadas), // Quantidade da amostra (ex: 100)
      numSementesGerminaram: Number(formData.numSementesGerminaram), // Quantidade que nasceu (ex: 85)

      estahNaCamaraFria: formData.camaraFria === "Sim",
      dataGerminacao: formData.dataGerminacao
        ? formatarDataParaJava(formData.dataGerminacao)
        : null,
    };

    const response = await api.post("/movimentacoes", testeDTO);
    return response.data;
  },

  // PUT: Atualizar Teste
  update: async (id, formData) => {
    const testeDTO = {
      tipo_movimentacao: "germinacao",
      finalidade: "TESTE_DE_GERMINACAO",
      loteSemente: formData.lote,
      dataPlantio: formatarDataParaJava(formData.dataTeste),

      // Valores padrão novamente
      tipoPlantio: "Sementeira",

      qtdSemente: Number(formData.quantidade),
      numSementesPlantadas: Number(formData.numSementesPlantadas),
      numSementesGerminaram: Number(formData.numSementesGerminaram),
      estahNaCamaraFria: formData.camaraFria === "Sim",
      dataGerminacao: formData.dataGerminacao
        ? formatarDataParaJava(formData.dataGerminacao)
        : null,
    };

    const response = await api.put(`/movimentacoes/${id}`, testeDTO);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/movimentacoes/${id}`);
  },

  exportarPdf: (termoBusca) => {
    // URL baseada no seu controller: /movimentacoes/testeGerminacao/export/pdf
    const url = `/movimentacoes/testeGerminacao/export/pdf${
      termoBusca ? `?searchTerm=${termoBusca}` : ""
    }`;
    return api.get(url, { responseType: "blob" });
  },

  exportarCsv: (termoBusca) => {
    const url = `/movimentacoes/testeGerminacao/export/csv${
      termoBusca ? `?searchTerm=${termoBusca}` : ""
    }`;
    return api.get(url, { responseType: "blob" });
  },
};

const formatarDataParaJava = (dataStr) => {
  if (!dataStr) return null;
  if (dataStr.includes("-")) {
    const parts = dataStr.split("-");
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dataStr;
};
