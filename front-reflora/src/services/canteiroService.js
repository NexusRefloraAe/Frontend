import api from './api';

export const canteiroService = {

    // Listagem paginada (Histórico de Canteiros)
    getAll: async (termoBusca = '', pagina = 0, itensPorPagina = 10, campoOrdenacao = 'nome', direcao = 'asc') => {
        const params = {
            page: pagina,
            size: itensPorPagina,
            sort: `${campoOrdenacao},${direcao}`,
            pesquisa: termoBusca // O Controller do Canteiro espera 'pesquisa', não 'searchTerm'
        };

        const response = await api.get('/canteiros', { params });
        const data = response.data;

        // Normalização do retorno do Spring Pageable
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

    getNomesCanteiros: async () => {
        const response = await api.get('/canteiros/nomes');
        return response.data; // Retorna ["Canteiro 1", "Canteiro 2", ...]
    },

    getById: async (id) => {
        const response = await api.get(`/canteiros/${id}`);
        return response.data;
    },

    // --- CREATE (POST) ---
    // Diferente de sementes, aqui enviamos JSON puro, não FormData
    create: async (formData) => {
        
        // 1. Tratamento de Data (Igual ao sementesService)
        let dataFormatada = formData.data; // No front chamamos de 'data'
        if (formData.data && formData.data.includes('-')) {
            const parts = formData.data.split('-');
            dataFormatada = `${parts[2]}/${parts[1]}/${parts[0]}`; // vira dd/MM/yyyy
        }

        // 2. Montagem do Payload (DTO Java)
        const payload = {
            nome: formData.nome,
            dataCriacao: dataFormatada,
            capacidadeMaxima: formData.quantidade, // Front: quantidade -> Back: capacidadeMaxima
            nomeEspecie: formData.especie          // Front: especie -> Back: nomeEspecie
        };

        const response = await api.post('/canteiros', payload);
        return response.data;
    },

    // --- UPDATE (PUT) ---
    update: async (id, formData) => {
        
        let dataFormatada = formData.data;
        if (formData.data && formData.data.includes('-')) {
            const parts = formData.data.split('-');
            dataFormatada = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }

        const payload = {
            id: id, // Alguns DTOs exigem o ID no corpo também
            nome: formData.nome,
            dataCriacao: dataFormatada,
            capacidadeMaxima: formData.quantidade,
            nomeEspecie: formData.especie
        };

        const response = await api.put(`/canteiros/${id}`, payload);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/canteiros/${id}`);
    },

    // Histórico detalhado de Entradas e Saídas do Canteiro
    getHistoricoDetalhado: async (id, pagina = 0, itensPorPagina = 5) => {
        const params = { 
            page: pagina, 
            size: itensPorPagina, 
            sort: 'data,desc' 
        };
        const response = await api.get(`/canteiros/${id}/historico-detalhado`, { params });
        return response.data;
    }
};