import api from './api';

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
            dataVistoria: formData.dataVistoria.split('-').reverse().join('/'), // Converte YYYY-MM-DD para dd/MM/yyyy
            estadoSaude: formData.estadoSaude,
            tratosCulturais: formData.tratosCulturais,
            doencasPragas: formData.doencasPragas,
            estimativaMudasProntas: Number(formData.estimativaMudasProntas),
            nomeResponsavel: formData.nomeResponsavel,
            observacao: formData.observacoes
        };
        const response = await api.post('/vistorias', dto);
        return response.data;
    }
};