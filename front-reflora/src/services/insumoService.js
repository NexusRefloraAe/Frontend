import api from './api';

const insumoService = {
    // Cadastrar um novo insumo(Material ou ferramenta)
    cadastrar: async (dados) => {
        //O back end espera um post em /api/insumos/cadastrar
        const response = await api.post('/insumos/cadastrar', dados);
        return response.data;
    },

    // Registrar uma movimentação(Entrada, Saída, Empréstimo, Devolução)
    registrarMovimentacao: async (dados) => {
        //O back end espera um post em /api/insumos/movimentacao
        const response = await api.post('/insumos/movimentacao', dados);
        return response.data;
    },

    // Buscar o histórico (Preencher as tabelas)
    getHistorico: async (tipoInsumo) => {
        //O back end espera GET em /api/insumos/historico/{tipo}
        // tipoInsumo pode ser 'MATERIAL' ou 'FERRAMENTA'
        const response = await api.get(`/insumos/historico/${tipoInsumo}`);
        return response.data;
    },

    // Listar insumos (Para preencher selects, se necessário)
    listarInsumos: async (tipoInsumo) => {
        const response = await api.get(`/insumos/lista/${tipoInsumo}`);
        return response.data;
    }, // <--- A VÍRGULA QUE FALTAVA ESTÁ AQUI

    // Novo método para download de CSV
    downloadCsv: async (filtros) => {
        try {
            const response = await api.get('/insumos/relatorio/csv', {
                params: filtros,
                responseType: 'blob' // Importante para downloads
            });
            // Cria um link temporário para baixar o arquivo
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `relatorio_${filtros.tipoInsumo}_${new Date().toISOString()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Erro ao baixar CSV:", error);
            throw error;
        }
    },

    // Novo método para download de PDF
    downloadPdf: async (filtros) => {
        try {
            const response = await api.get('/insumos/relatorio/pdf', {
                params: filtros,
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `relatorio_${filtros.tipoInsumo}_${new Date().toISOString()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Erro ao baixar PDF:", error);
            throw error;
        }
    },
    excluirMovimentacao: async (id) => {
        const response = await api.delete(`/insumos/movimentacao/${id}`);
        return response.data;
    },
    atualizarMovimentacao: async (id, dados) => {    
        const response = await api.put(`/insumos/movimentacao/${id}`, dados);
        return response.data;
    }
};

export default insumoService;