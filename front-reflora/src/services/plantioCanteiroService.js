import api from './api';

// Função auxiliar para garantir que a data vá no formato dd/MM/yyyy para o Java
const formatarDataParaJava = (dataStr) => {
    if (!dataStr) return null;
    // Se estiver em yyyy-MM-dd (formato padrão do input date), converte para dd/MM/yyyy
    if (dataStr.includes('-')) {
        const parts = dataStr.split('-');
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dataStr;
};

export const plantioCanteiroService = {

    // GET: Listar os plantios que já estão em um canteiro específico
    getByCanteiro: async (nomeCanteiro) => {
        const response = await api.get(`/plantioCanteiro/canteiro/${nomeCanteiro}`);
        return response.data;
    },

    // POST: Cadastrar a movimentação da muda para o canteiro
    create: async (formData) => {
        const payload = {
            plantioMudaId: formData.plantioMudaId, // UUID do PlantioMuda selecionado
            nomeCanteiro: formData.nomeCanteiro,   // Nome do canteiro de destino
            quantidade: Number(formData.quantidade),
            dataPlantio: formatarDataParaJava(formData.dataPlantio)
        };

        const response = await api.post('/plantioCanteiro', payload);
        return response.data;
    },

    // PUT: Editar um lote que já está no canteiro
    update: async (id, formData) => {
        const payload = {
            novaQuantidade: Number(formData.quantidade),
            // Certifique-se de que a função formatarDataParaJava está acessível aqui
            novaData: formatarDataParaJava(formData.data) 
        };

        const response = await api.put(`/plantioCanteiro/${id}`, payload);
        return response.data;
    }
};