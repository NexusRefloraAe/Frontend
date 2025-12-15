import api from './api';

export const testeGerminacaoService = {
  // ✅ Listar: Rota específica do controller
  getAll: async (termoBusca = '', pagina = 0, itensPorPagina = 5) => {
    const params = {
      searchTerm: termoBusca,
      page: pagina,
      size: itensPorPagina,
      sort: 'dataPlantio,desc' // Seu controller usa 'dataPlantio' como ordenação padrão
    };
    const response = await api.get('/movimentacoes/testeGerminacao', { params });
    return response.data;
  },

  // ✅ Criar
  create: async (formData) => {
    // Formata Data Teste
    let dataTesteFormatada = formData.dataTeste;
    if (formData.dataTeste && formData.dataTeste.includes('-')) {
        const parts = formData.dataTeste.split('-');
        dataTesteFormatada = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    // Formata Data Germinação
    let dataGerminacaoFormatada = formData.dataGerminacao;
    if (formData.dataGerminacao && formData.dataGerminacao.includes('-')) {
        const parts = formData.dataGerminacao.split('-');
        dataGerminacaoFormatada = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    const testeDTO = {
      tipoMovimentacao: "TESTE_GERMINACAO", // Campo discriminador provável
      loteSemente: formData.lote,
      dataPlantio: dataTesteFormatada, // O controller usa dataPlantio para a data do cadastro/teste
      qtdSemente: Number(formData.quantidade),
      estahNaCamaraFria: formData.camaraFria === 'Sim', // Backend espera Boolean
      
      // Campos específicos de germinação
      dataGerminacao: dataGerminacaoFormatada,
      qtdGerminou: Number(formData.qntdGerminou),
      taxaGerminacao: formData.taxaGerminou
    };

    const response = await api.post('/movimentacoes', testeDTO);
    return response.data;
  },

  // ✅ Atualizar
  update: async (id, formData) => {
    // ... (Repetir lógica de formatação de data acima) ...
    // Para simplificar o exemplo visual:
    const testeDTO = { /* ... mesmos campos do create ... */ }; 
    // Adapte aqui copiando a lógica do create, pois é PUT na mesma rota base
    
    const response = await api.put(`/movimentacoes/${id}`, testeDTO); 
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/movimentacoes/${id}`);
  }
};