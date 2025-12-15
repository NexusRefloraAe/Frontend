import api from './api'; // Importe sua instância do Axios configurada

export const relatorioMovimentacaoSementeService = {

    // Busca os dados do Painel + Tabela
    getPainel: async (filtros, pagina = 0) => {
        try {
            const params = {
                page: pagina,
                size: 9,
                sort: 'lote,desc', // Opcional, já que seu back define padrão
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

    // Exportação de PDF
    exportarPdf: async (filtros) => {
        try {
            const params = {
                ...(filtros.nomePopular && { nomePopular: filtros.nomePopular }),
                ...(filtros.dataInicio && { dataInicio: filtros.dataInicio }),
                ...(filtros.dataFim && { dataFim: filtros.dataFim }),
            };

            const response = await api.get('/registros/exports/pdf', {
                params,
                responseType: 'blob' // IMPORTANTE: Diz ao axios que é um arquivo binário
            });

            // Cria um link temporário para forçar o download no navegador
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `relatorio_sementes_${new Date().getTime()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Erro ao baixar PDF:", error);
            throw error;
        }
    },

    // Exportação de CSV
    exportarCsv: async (filtros) => {
        try {
            const params = {
                ...(filtros.nomePopular && { nomePopular: filtros.nomePopular }),
                ...(filtros.dataInicio && { dataInicio: filtros.dataInicio }),
                ...(filtros.dataFim && { dataFim: filtros.dataFim }),
            };

            const response = await api.get('/registros/exports/csv', {
                params,
                responseType: 'blob' // Binário
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `relatorio_sementes_${new Date().getTime()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Erro ao baixar CSV:", error);
            throw error;
        }
    }
};