import api from './api';

export const sementesService = {

  getAll: async (termoBusca = '', pagina = 0, itensPorPagina = 5, campoOrdenacao = 'dataDeCadastro', direcao = 'desc') => {
    const params = {
      page: pagina,
      size: itensPorPagina,
      sort: `${campoOrdenacao},${direcao}`, // Monta a string ex: "lote,asc"
      searchTerm: termoBusca 
    };
    
    const response = await api.get('/bancoSementes', { params });
    
    const data = response.data;
    
    // Normalização (mantive sua lógica anterior)
    if (data.page && data.page.totalPages) {
        return {
            content: data.content,
            totalPages: data.page.totalPages,
            totalElements: data.page.totalElements,
            number: data.page.number
        };
    }
    
    return data; 
  },

  getById: async (id) => {
    const response = await api.get(`/bancoSementes/${id}`);
    return response.data;
  },

  // --- AQUI ESTÁ A MÁGICA DA CORREÇÃO ---
  create: async (formData, fotoFile) => {
    const dataToSend = new FormData();

    // 1. Tratamento de Data
    let dataFormatada = formData.dataCadastro;
    if (formData.dataCadastro && formData.dataCadastro.includes('-')) {
        const parts = formData.dataCadastro.split('-');
        dataFormatada = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    // 2. MAPEAMENTO (DE: React, PARA: Java DTO)
    const sementeDTO = {
        // Front (formData) -> Back (DTO)
        nomePopular: formData.nomePopular,
        nomeCientifico: formData.nomeCientifico,
        familia: formData.familia,
        origem: formData.origem,
        dataDeCadastro: dataFormatada,
        quantidade: formData.quantidade,
        
        // Garante que a unidade vá em Maiúsculo para bater com o Enum (KG, UNIDADE, G)
        unidadeDeMedida: formData.unidadeMedida ? formData.unidadeMedida.toUpperCase() : null,
        
        // CORREÇÃO: Mapeia 'localizacao' para 'localizacaoDaColeta'
        localizacaoDaColeta: formData.localizacao, 
        
        // CORREÇÃO: Converte 'sim'/'nao' para true/false
        estahNaCamaraFria: formData.camaraFria === 'sim' 
    };

    const jsonBlob = new Blob([JSON.stringify(sementeDTO)], { type: 'application/json' });
    dataToSend.append('semente', jsonBlob);

    if (fotoFile) {
        dataToSend.append('fotoSemente', fotoFile);
    }

    const response = await api.post('/bancoSementes', dataToSend, {
        headers: { "Content-Type": undefined }
    });
    return response.data;
  },

  update: async (id, formData, fotoFile) => {
    const dataToSend = new FormData();
    
    let dataFormatada = formData.dataCadastro;
    if (formData.dataCadastro && formData.dataCadastro.includes('-')) {
        const parts = formData.dataCadastro.split('-');
        dataFormatada = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    // MESMO MAPEAMENTO DO CREATE
    const sementeDTO = {
        nomePopular: formData.nomePopular,
        nomeCientifico: formData.nomeCientifico,
        familia: formData.familia,
        origem: formData.origem,
        dataDeCadastro: dataFormatada,
        quantidade: formData.quantidade,
        unidadeDeMedida: formData.unidadeMedida ? formData.unidadeMedida.toUpperCase() : null,
        localizacaoDaColeta: formData.localizacao,   // <-- Importante
        estahNaCamaraFria: formData.camaraFria === 'sim' // <-- Importante
    };

    const jsonBlob = new Blob([JSON.stringify(sementeDTO)], { type: 'application/json' });
    dataToSend.append('semente', jsonBlob);

    if (fotoFile) {
        dataToSend.append('fotoSemente', fotoFile);
    }

    const response = await api.put(`/bancoSementes/${id}`, dataToSend, {
        headers: { "Content-Type": undefined }
    });
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/bancoSementes/${id}`);
  },

  getHistorico: async (id, pagina = 0, itensPorPagina = 2) => {
    const params = { page: pagina, size: itensPorPagina, sort: 'data,desc' };
    const response = await api.get(`/sementes/${id}/historico-detalhado`, { params });
    return response.data; // Retorna { entradas: Page, saidas: Page }
  },

  exportarRelatorioPdf: async (termoBusca) => {
        const url = `/bancoSementes/export/pdf${termoBusca ? `?searchTerm=${termoBusca}` : ''}`;
        
        return api.get(url, {
            responseType: 'blob' // CRUCIAL: Para baixar arquivos binários
        });
    },

    exportarRelatorioCsv: async (termoBusca) => {
        const url = `/bancoSementes/export/csv${termoBusca ? `?searchTerm=${termoBusca}` : ''}`;
        return api.get(url, { responseType: 'blob' });
    }
};