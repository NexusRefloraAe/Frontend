import api from './api';

const formatarDataParaJava = (dataStr) => {
    if (!dataStr) return null;
    if (dataStr.includes('-')) {
        const parts = dataStr.split('-');
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dataStr;
};

export const vistoriaService = {
    // Busca canteiros onde o lote está presente
    getCanteirosPorLote: async (lote) => {
        const response = await api.get(`/vistorias/canteirosPorLote/${lote}`);
        return response.data; // Retorna List<String>
    },

    create: async (formData) => {
        // Alinhando com o VistoriaRequestDTO do Java
        const dto = {
            loteMuda: formData.lote,
            nomeCanteiro: formData.nomeCanteiro,
            dataVistoria: formatarDataParaJava(formData.dataVistoria), // Converte YYYY-MM-DD para dd/MM/yyyy
            estadoSaude: formData.estadoSaude,
            tratosCulturais: formData.tratosCulturais,
            doencasPragas: formData.doencasPragas,
            estimativaMudasProntas: Number(formData.estimativaMudasProntas),
            nomeResponsavel: formData.nomeResponsavel,
            observacao: formData.observacoes
        };
        const response = await api.post('/vistorias', dto);
        return response.data;
    },

    getAll: async (pagina = 0, itensPorPagina = 5, ordem = 'dataVistoria', direcao = 'desc') => {
        const params = {
            page: pagina,
            size: itensPorPagina,
            sort: `${ordem},${direcao}`
        };

        const response = await api.get(`/vistorias`, { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/vistorias/${id}`);
        return response.data;
    },

    update: async (id, formData) => {
        const dto = {
            nomeCanteiro: formData.nomeCanteiro,
            loteMuda: formData.lote,
            dataVistoria: formatarDataParaJava(formData.dataVistoria),
            doencasPragas: formData.doencasPragas,
            tratosCulturais: formData.tratosCulturais,
            estadoSaude: formData.estadoSaude,
            estimativaMudasProntas: Number(formData.estimativaMudasProntas),
            nomeResponsavel: formData.nomeResponsavel,
            observacao: formData.observacao
        };

        const response = await api.put(`/vistorias/${id}`, dto);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/vistorias/${id}`);
    }
};