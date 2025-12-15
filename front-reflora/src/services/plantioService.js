import api from './api';

export const plantioService = {
  // GET: Listar Plantios
  getAll: async (termoBusca = '', pagina = 0, itensPorPagina = 5) => {
    const params = {
      searchTerm: termoBusca,
      page: pagina,
      size: itensPorPagina,
      sort: 'dataPlantio,desc'
    };
    const response = await api.get('/movimentacoes/plantioMuda', { params });
    return response.data;
  },

  // POST: Criar Plantio
  create: async (formData) => {
    const plantioDTO = {
      // 1. Campo Discriminador (Obrigatório pelo @JsonTypeInfo do Java)
      tipo_movimentacao: 'muda', 
      
      // 2. Campos da Classe Pai (MovimentacaoSementesRequestDTO)
      finalidade: 'PLANTIO', 
      loteSemente: formData.lote,
      dataPlantio: formatarDataParaJava(formData.dataPlantio),
      tipoPlantio: formData.tipoPlantio ? formData.tipoPlantio.toUpperCase() : null,
      quantidadePlantada: Number(formData.qntdPlantada),

      // 3. Campo Específico (PlantioMudaRequestDTO)
      qtdSemente: Number(formData.qntdSementes)
    };

    const response = await api.post('/movimentacoes', plantioDTO);
    return response.data;
  },

  // PUT: Atualizar Plantio
  update: async (id, formData) => {
    const plantioDTO = {
      tipo_movimentacao: 'muda',
      finalidade: 'PLANTIO',
      loteSemente: formData.lote,
      dataPlantio: formatarDataParaJava(formData.dataPlantio),
      tipoPlantio: formData.tipoPlantio ? formData.tipoPlantio.toUpperCase() : null,
      quantidadePlantada: Number(formData.qntdPlantada),
      qtdSemente: Number(formData.qntdSementes)
    };

    const response = await api.put(`/movimentacoes/${id}`, plantioDTO);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/movimentacoes/${id}`);
  }
};

// Auxiliar: yyyy-MM-dd -> dd/MM/yyyy (Se o seu backend exigir formatação manual)
// Observação: Se seu DTO usa LocalDate padrão, o Axios pode enviar yyyy-MM-dd. 
// Mas seu código anterior sugere que você formata. Mantive a formatação por segurança.
const formatarDataParaJava = (dataStr) => {
    if (!dataStr) return null;
    if (dataStr.includes('-')) {
       const parts = dataStr.split('-');
       return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dataStr;
};