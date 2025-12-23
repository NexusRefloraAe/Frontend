import api from './api';

// Função auxiliar para garantir que a data vá no formato dd/MM/yyyy para o Java
const formatarDataParaJava = (dataStr) => {
    if (!dataStr) return null;
    // Se estiver em yyyy-MM-dd (formato padrão do input date), inverte
    if (dataStr.includes('-')) {
       const parts = dataStr.split('-');
       return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dataStr;
};

export const plantioService = {
  // GET: Listar Plantios com paginação e busca
  getAll: async (termoBusca = '', pagina = 0, itensPorPagina = 5, ordem = 'dataPlantio', direcao = 'desc') => {
    const params = {
      searchTerm: termoBusca,
      page: pagina,
      size: itensPorPagina,
      sort: `${ordem},${direcao}` // <--- AGORA ESTÁ DINÂMICO
    };
    const response = await api.get('/movimentacoes/plantioMuda', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/movimentacoes/${id}`);
    return response.data;
  },

  // GET: Pesquisa para o Autocomplete (Retorna lista de sugestões ÚNICAS)
  pesquisarSementes: async (termo) => {
    if (!termo) return [];
    
    // Busca paginada (trazemos 10 opções para não poluir a tela)
    const params = { searchTerm: termo, page: 0, size: 10 };
    const response = await api.get('/bancoSementes', { params });
    
    const listaBruta = response.data.content || [];

    // --- FILTRAGEM DE DUPLICATAS ---
    // Cria um Map para garantir que cada ID de semente apareça apenas uma vez
    const sementesUnicas = [];
    const mapIds = new Set();

    for (const item of listaBruta) {
        if (!mapIds.has(item.id)) {
            mapIds.add(item.id);
            sementesUnicas.push(item);
        }
    }

    return sementesUnicas;
  },

  // GET: Listar todos os plantios de mudas disponíveis (com saldo) para mover para canteiro
  // Usado para preencher o Select de "Lote de Origem"
  getMudasDisponiveis: async () => {
      const response = await api.get('/movimentacoes/plantioMuda/disponiveis');
      return response.data;
  },

  // GET: Buscar detalhes exatos de uma semente pelo Lote
  buscarSementePorLote: async (lote) => {
    if (!lote) return null;
    
    // 1. Limpa o termo digitado
    const loteBuscado = lote.trim(); 
    
    // Busca no backend
    const params = { searchTerm: loteBuscado, page: 0, size: 10 };
    const response = await api.get('/bancoSementes', { params });
    
    const lista = response.data.content;
    
    if (lista && lista.length > 0) {
        // 2. Filtra no front ignorando Case Sensitive para garantir que é o lote certo
        const sementeEncontrada = lista.find(s => 
            s.lote.trim().toLowerCase() === loteBuscado.toLowerCase()
        );
        return sementeEncontrada || null;
    }
    return null;
  },

  // POST: Criar Plantio
  create: async (formData) => {
    const plantioDTO = {
      // Campos obrigatórios do Backend (Herança e Discriminador)
      tipo_movimentacao: 'muda',
      finalidade: 'PLANTIO',
      
      loteSemente: formData.lote,
      dataPlantio: formatarDataParaJava(formData.dataPlantio),
      
      // Garante Uppercase para o Enum (SEMENTEIRA, SAQUINHO, CHAO)
      tipoPlantio: formData.tipoPlantio ? formData.tipoPlantio.toUpperCase() : null,
      
      // ✅ CORREÇÃO DE NOMES (Fallback para garantir compatibilidade)
      // Tenta ler o nome novo (padronizado) OU o nome antigo do estado
      quantidadePlantada: Number(formData.quantidadePlantada || formData.qntdPlantada),
      qtdSemente: Number(formData.qtdSemente || formData.qntdSementes)
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
      
      // ✅ CORREÇÃO DE NOMES
      quantidadePlantada: Number(formData.quantidadePlantada || formData.qntdPlantada),
      qtdSemente: Number(formData.qtdSemente || formData.qntdSementes)
    };

    const response = await api.put(`/movimentacoes/${id}`, plantioDTO);
    return response.data;
  },

  // DELETE: Excluir Plantio
  delete: async (id) => {
    await api.delete(`/movimentacoes/${id}`);
  },

  exportarPdf: (termoBusca) => {
    // URL baseada no seu controller: /movimentacoes/plantioMuda/export/pdf
    const url = `/movimentacoes/plantioMuda/export/pdf${termoBusca ? `?searchTerm=${termoBusca}` : ''}`;
    return api.get(url, { responseType: 'blob' });
  },

  exportarCsv: (termoBusca) => {
    const url = `/movimentacoes/plantioMuda/export/csv${termoBusca ? `?searchTerm=${termoBusca}` : ''}`;
    return api.get(url, { responseType: 'blob' });
  }
};