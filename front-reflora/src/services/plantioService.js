import api from './api';

export const plantioService = {
  // ✅ Listar: O controller tem um endpoint específico para listar PlantioMuda
  getAll: async (termoBusca = '', pagina = 0, itensPorPagina = 5) => {
    const params = {
      searchTerm: termoBusca,
      page: pagina,
      size: itensPorPagina,
      sort: 'dataPlantio,desc'
    };
    // Chama a rota específica do seu controller
    const response = await api.get('/movimentacoes/plantioMuda', { params });
    return response.data; // Retorna Page<MovimentacaoSementesHistoricoResponseDTO>
  },

  // ✅ Criar: O controller usa POST /movimentacoes para tudo
  create: async (formData) => {
    // Tratamento de Data (yyyy-MM-dd -> dd/MM/yyyy)
    let dataFormatada = formData.dataPlantio;
    if (formData.dataPlantio && formData.dataPlantio.includes('-')) {
       const parts = formData.dataPlantio.split('-');
       dataFormatada = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    const plantioDTO = {
      // IMPORTANTE: O Java usa @JsonTypeInfo? Se sim, precisa de um campo "type".
      // Se não, ele tenta adivinhar pelos campos. Vou enviar os campos mapeados:
      
      tipoMovimentacao: "PLANTIO_MUDA", // Dica para o Java saber qual DTO instanciar (se configurado)
      loteSemente: formData.lote,       // Backend espera loteSemente
      dataPlantio: dataFormatada,
      qtdSemente: Number(formData.qntdSementes),
      quantidadePlantada: Number(formData.qntdPlantada),
      tipoPlantio: formData.tipoPlantio ? formData.tipoPlantio.toUpperCase() : null // SEMENTEIRA, SAQUINHO...
    };

    const response = await api.post('/movimentacoes', plantioDTO);
    return response.data;
  },

  // ✅ Atualizar: PUT /movimentacoes/{id}
  update: async (id, formData) => {
    let dataFormatada = formData.dataPlantio;
    if (formData.dataPlantio && formData.dataPlantio.includes('-')) {
       const parts = formData.dataPlantio.split('-');
       dataFormatada = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    const plantioDTO = {
      loteSemente: formData.lote,
      dataPlantio: dataFormatada,
      qtdSemente: Number(formData.qntdSementes),
      quantidadePlantada: Number(formData.qntdPlantada),
      tipoPlantio: formData.tipoPlantio ? formData.tipoPlantio.toUpperCase() : null
    };

    const response = await api.put(`/movimentacoes/${id}`, plantioDTO);
    return response.data;
  },

  // ✅ Excluir: DELETE /movimentacoes/{id}
  delete: async (id) => {
    await api.delete(`/movimentacoes/${id}`);
  }
};