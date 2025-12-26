import api from './api';

const formatarDataParaJava = (dataStr) => {
    if (!dataStr) return null;
    if (dataStr.includes('-')) {
        const parts = dataStr.split('-');
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dataStr;
};

export const inspecaoService = {
    // Busca os canteiros onde um lote específico está localizado
    getCanteirosPorLote: async (lote) => {
        const response = await api.get(`/canteirosPorLote/${lote}`);
        return response.data; // Retorna List<String>
    },

    // POST: Cadastrar a inspeção
    create: async (formData) => {
        const dto = {
            nomeCanteiro: formData.nomeCanteiro,
            loteMuda: formData.lote,
            dataInspecao: formatarDataParaJava(formData.dataInspecao),
            doencasPragas: formData.pragasDoencas,
            tratosCulturais: formData.tratosCulturais,
            estadoSaude: formData.estadoSaude, // Deve ser compatível com o Enum do Java (ex: 'BOA')
            estimativaMudasProntas: Number(formData.estimativaMudasProntas),
            nomeResponsavel: formData.nomeResponsavel,
            observacao: formData.observacoes
        };

        const response = await api.post('/inspecoes', dto);
        return response.data;
    },

    getAll: async (pagina = 0, itensPorPagina = 5, ordem = 'dataInspecao', direcao = 'desc') => {
        const params = {
            page: pagina,
            size: itensPorPagina,
            sort: `${ordem},${direcao}`
        };

        const response = await api.get(`/inspecoes`, { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/inspecoes/${id}`);
        return response.data; // Retorna o InspecaoMudaResponseDTO
    },

    update: async (id, formData) => {
        const dto = {
            nomeCanteiro: formData.nomeCanteiro,
            loteMuda: formData.loteMuda,
            dataInspecao: formatarDataParaJava(formData.dataInspecao),
            doencasPragas: formData.doencasPragas,
            tratosCulturais: formData.tratosCulturais,
            estadoSaude: formData.estadoSaude,
            estimativaMudasProntas: Number(formData.estimativaMudasProntas),
            nomeResponsavel: formData.nomeResponsavel,
            observacao: formData.observacao
        };

        const response = await api.put(`/inspecoes/${id}`, dto);
        return response.data;
    },

    delete: async (id) => {
        // Realiza a chamada DELETE para o banco de dados
        await api.delete(`/inspecoes/${id}`);
    }
};