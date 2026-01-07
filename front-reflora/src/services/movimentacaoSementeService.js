import api from './api';

export const movimentacaoSementeService = {
    // ... outros métodos ...

    corrigir: async (idAntiga, formData, tipo) => {
        // 1. Prepara o payload comum
        const payload = {
            finalidade: tipo === 'muda' ? 'PLANTIO' : 'TESTE_DE_GERMINACAO',
            loteSemente: formData.lote,
            dataPlantio: formatarDataParaJava(formData.dataPlantio || formData.dataTeste),
            tipoPlantio: formData.tipoPlantio || 'Sementeira', // Valor padrão se necessário
            qtdSemente: Number(formData.qtdSemente || 0),
            
            // PROPRIEDADE MÁGICA: Define se o Java criará um PlantioMuda ou TesteGerminacao
            tipo_movimentacao: tipo 
        };

        // 2. Adiciona campos específicos se for teste de germinação
        if (tipo === 'germinacao') {
            payload.estahNaCamaraFria = formData.camaraFria === 'Sim';
            payload.dataGerminacao = formatarDataParaJava(formData.dataGerminacao);
            payload.numSementesPlantadas = Number(formData.numSementesPlantadas);
            payload.numSementesGerminaram = Number(formData.numSementesGerminaram)
        } 
        else if (tipo === 'muda') {
            payload.quantidadePlantada = Number(formData.quantidadePlantada || formData.quantidade);
        }

        // 3. Chamada ao endpoint de correção
        const response = await api.put(`/movimentacoes/corrigir/${idAntiga}`, payload);
        return response.data;
    }
};

// Helper para data (DD/MM/YYYY)
const formatarDataParaJava = (dataStr) => {
    if (!dataStr) return null;
    if (dataStr.includes('-')) {
        const [ano, mes, dia] = dataStr.split('-');
        return `${dia}/${mes}/${ano}`;
    }
    return dataStr;
};