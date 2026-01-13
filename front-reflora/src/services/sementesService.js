import api from './api';

export const sementesService = {

  getAll: async (termoBusca = '', pagina = 0, itensPorPagina = 5, campoOrdenacao = 'dataDeCadastro', direcao = 'desc') => {
    const params = {
      page: pagina,
      size: itensPorPagina,
      sort: `${campoOrdenacao},${direcao}`,
      searchTerm: termoBusca 
    };
    
    const response = await api.get('/bancoSementes', { params });
    const data = response.data;
    
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

  // --- CORREÇÃO AQUI (Adicionados latitude e longitude) ---
  create: async (formData, fotoFile) => {
    const dataToSend = new FormData();

    let dataFormatada = formData.dataCadastro;
    if (formData.dataCadastro && formData.dataCadastro.includes('-')) {
        const parts = formData.dataCadastro.split('-');
        dataFormatada = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    const sementeDTO = {
        nomePopular: formData.nomePopular,
        nomeCientifico: formData.nomeCientifico,
        familia: formData.familia,
        origem: formData.origem,
        dataDeCadastro: dataFormatada,
        quantidade: formData.quantidade,
        unidadeDeMedida: formData.unidadeMedida ? formData.unidadeMedida.toUpperCase() : null,
        
        // CAMPOS GEOGRÁFICOS ADICIONADOS
        estado: formData.estado,
        cidade: formData.cidade, 
        latitude: formData.latitude ? Number(formData.latitude) : null,
        longitude: formData.longitude ? Number(formData.longitude) : null,
        
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

    const sementeDTO = {
        nomePopular: formData.nomePopular,
        nomeCientifico: formData.nomeCientifico,
        familia: formData.familia,
        origem: formData.origem,
        dataDeCadastro: dataFormatada,
        quantidade: formData.quantidade,
        unidadeDeMedida: formData.unidadeMedida ? formData.unidadeMedida.toUpperCase() : null,
        
        // CAMPOS GEOGRÁFICOS ADICIONADOS
        estado: formData.estado,
        cidade: formData.cidade,
        latitude: formData.latitude ? Number(formData.latitude) : null,
        longitude: formData.longitude ? Number(formData.longitude) : null,

        estahNaCamaraFria: formData.camaraFria === 'sim'
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

  // ... (Resto do código: delete, getHistorico, exportar... mantém igual)
  delete: async (id) => {
    await api.delete(`/bancoSementes/${id}`);
  },

  getHistorico: async (id, pagina = 0, itensPorPagina = 2) => {
    const params = { page: pagina, size: itensPorPagina, sort: 'data,desc' };
    const response = await api.get(`/sementes/${id}/historico-detalhado`, { params });
    return response.data;
  },

  exportarRelatorioPdf: async (termoBusca) => {
        const url = `/bancoSementes/export/pdf${termoBusca ? `?searchTerm=${termoBusca}` : ''}`;
        return api.get(url, { responseType: 'blob' });
    },

    exportarRelatorioCsv: async (termoBusca) => {
        const url = `/bancoSementes/export/csv${termoBusca ? `?searchTerm=${termoBusca}` : ''}`;
        return api.get(url, { responseType: 'blob' });
    },

    exportarHistoricoPdf: (id) => {
        return api.get(`/bancoSementes/${id}/historico/export/pdf`, {
            responseType: 'blob'
        });
    },

    exportarHistoricoCsv: (id) => {
        return api.get(`/bancoSementes/${id}/historico/export/csv`, {
            responseType: 'blob'
        });
    },

    listarNomesPopulares: async () => {
        try {
            const response = await api.get('/sementes/select');
            return response.data; 
        } catch (error) {
            console.error("Erro no service de sementes:", error);
            throw error;
        }
    }
};