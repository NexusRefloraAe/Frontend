import api from './api'; // Importe sua instância do Axios configurada

export const relatorioMovimentacaoSementeService = {

    // Busca os dados do Painel + Tabela
    getPainel: async (filtros, pagina = 0, itensPorPagina = 5, ordem = 'lote', direcao = 'desc') => {
        try {
            const params = {
                page: pagina,
                size: itensPorPagina,
                sort: `${ordem},${direcao}`, // AQUI: Torna a ordenação dinâmica baseada no que vem do componente
                // Repassa os filtros apenas se tiverem valor
                ...(filtros.nomePopular && { nomePopular: filtros.nomePopular }),
                ...(filtros.dataInicio && { dataInicio: filtros.dataInicio }),
                ...(filtros.dataFim && { dataFim: filtros.dataFim }),
            };

            const response = await api.get('/registros/painel', { params });
            const data = response.data;

            // --- ADAPTAÇÃO (MAPPING) ---
            // O Java retorna: totalEntradaKg, totalSaidaUnd, totalAtualKg, historico
            // O React espera: totalEntrada, totalSaida, saldoDoPeriodo, pageTabela
            return {
                totalEntrada: data.totalEntradaKg,
                totalSaida: data.totalSaidaUnd,
                saldoDoPeriodo: data.totalAtualKg, // Mapeando TotalAtual para Saldo
                pageTabela: data.historico         // Mapeando historico para pageTabela
            };
        } catch (error) {
            console.error("Erro no service de relatório:", error);
            throw error;
        }
    },

    // --- MUDANÇA AQUI: Retornar a response, não fazer o download ---
    exportarPdf: (filtros) => {
        const params = {
            ...(filtros.nomePopular && { nomePopular: filtros.nomePopular }),
            ...(filtros.dataInicio && { dataInicio: filtros.dataInicio }),
            ...(filtros.dataFim && { dataFim: filtros.dataFim }),
        };
        // Atenção à URL: deve bater com seu Controller (@GetMapping("/exports/pdf"))
        // Se o controller está em /api/registros, a url é /registros/exports/pdf
        return api.get('/registros/exports/pdf', {
            params,
            responseType: 'blob' 
        });
    },

    exportarCsv: (filtros) => {
        const params = {
            ...(filtros.nomePopular && { nomePopular: filtros.nomePopular }),
            ...(filtros.dataInicio && { dataInicio: filtros.dataInicio }),
            ...(filtros.dataFim && { dataFim: filtros.dataFim }),
        };
        return api.get('/registros/exports/csv', {
            params,
            responseType: 'blob'
        });
    }
};