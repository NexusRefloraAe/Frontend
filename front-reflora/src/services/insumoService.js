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
    // Novo método para download de CSV
    downloadCsv: async (filtros) => {
        try {
            const response = await api.get('/insumos/relatorio/csv', {
                params: filtros,
                responseType: 'blob' 
            });

            // 1. Extrair o nome do arquivo do header Content-Disposition
            const contentDisposition = response.headers['content-disposition'];
            let nomeArquivo = `relatorio_${filtros.tipoInsumo}.csv`; // Fallback

            if (contentDisposition) {
                const match = contentDisposition.match(/filename=(.+)/);
                if (match && match[1]) {
                    // Remove aspas se houver e limpa espaços
                    nomeArquivo = match[1].replace(/["']/g, '').trim();
                }
            }

            // 2. Criar o link e disparar o download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', nomeArquivo); 
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
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

            const contentDisposition = response.headers['content-disposition'];
            let nomeArquivo = `relatorio_${filtros.tipoInsumo}.pdf`;

            if (contentDisposition) {
                const match = contentDisposition.match(/filename=(.+)/);
                if (match && match[1]) {
                    nomeArquivo = match[1].replace(/["']/g, '').trim();
                }
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', nomeArquivo);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
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
    },

    // Método para listar TUDO (Materiais e Ferramentas) com paginação
    getAll: async (termo = '', pagina = 0, tamanho = 10, ordem = 'nome', direcao = 'asc') => {
        // Ajuste a URL conforme o seu Backend. 
        // Se o seu backend não tiver paginação unificada, precisaremos criar ou filtrar no front.
        // Supondo que você criou: @GetMapping("/todos") com Pageable
        const params = {
            termo,
            page: pagina,
            size: tamanho,
            sort: `${ordem},${direcao}`
        };
        const response = await api.get('/insumos/todos', { params });
        return response.data;
    },

    // Método para deletar o INSUMO (e seu histórico)
    delete: async (id) => {
        await api.delete(`/insumos/${id}`);
    },

    // Buscar por ID para edição
    getById: async (id) => {
        const response = await api.get(`/insumos/${id}`);
        return response.data;
    },
    atualizarInsumo: async (id, dados) => {
        const response = await api.put(`/insumos/${id}`, dados);
        return response.data;
    }
};

export default insumoService;