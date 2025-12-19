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
    }
};

export default insumoService;