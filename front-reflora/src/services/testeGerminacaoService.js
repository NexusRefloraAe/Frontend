import api from './api';

export const testeGerminacaoService = {
  // GET: Listar Testes
  getAll: async (termoBusca = '', pagina = 0, itensPorPagina = 5) => {
    const params = {
      searchTerm: termoBusca,
      page: pagina,
      size: itensPorPagina,
      sort: 'dataPlantio,desc'
    };
    const response = await api.get('/movimentacoes/testeGerminacao', { params });
    return response.data;
  },

  // POST: Criar Teste
  create: async (formData) => {
    const testeDTO = {
      // 1. Discriminador
      tipo_movimentacao: 'germinacao',

      // 2. Campos da Pai (Obrigatórios por herança no Java)
      finalidade: 'TESTE_DE_GERMINACAO',
      loteSemente: formData.lote,
      dataPlantio: formatarDataParaJava(formData.dataTeste), // Front chama de dataTeste
      
      // (!) HACK: Valores padrão para passar na validação @NotNull/@Min da classe pai
      tipoPlantio: 'SEMENTEIRA', 
      quantidadePlantada: 1, 

      // 3. Campos Específicos
      qtdSemente: Number(formData.quantidade),
      estahNaCamaraFria: formData.camaraFria === 'Sim',
      
      // Resultados (podem ser nulos no cadastro inicial, verifique seu backend)
      dataGerminacao: formData.dataGerminacao ? formatarDataParaJava(formData.dataGerminacao) : null,
      qtdGerminou: formData.qntdGerminou ? Number(formData.qntdGerminou) : 0,
      // taxaGerminacao: Backend calcula sozinho ou recebe? No DTO tem o campo?
      // O RequestDTO tem, então enviamos se houver.
    };

    const response = await api.post('/movimentacoes', testeDTO);
    return response.data;
  },

  // PUT: Atualizar Teste
  update: async (id, formData) => {
    const testeDTO = {
      tipo_movimentacao: 'germinacao',
      finalidade: 'TESTE_DE_GERMINACAO',
      loteSemente: formData.lote,
      dataPlantio: formatarDataParaJava(formData.dataTeste),
      
      // Valores padrão novamente
      tipoPlantio: 'SEMENTEIRA',
      quantidadePlantada: 1,

      qtdSemente: Number(formData.quantidade),
      estahNaCamaraFria: formData.camaraFria === 'Sim',
      dataGerminacao: formData.dataGerminacao ? formatarDataParaJava(formData.dataGerminacao) : null,
      qtdGerminou: formData.qntdGerminou ? Number(formData.qntdGerminou) : 0
    };

    const response = await api.put(`/movimentacoes/${id}`, testeDTO);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/movimentacoes/${id}`);
  }
};

const formatarDataParaJava = (dataStr) => {
    if (!dataStr) return null;
    if (dataStr.includes('-')) {
       const parts = dataStr.split('-');
       return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dataStr;
};