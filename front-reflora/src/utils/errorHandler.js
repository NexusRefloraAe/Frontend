/**
 * Extrai a mensagem de erro amigável a partir da resposta do Backend Spring Boot.
 * Compatível com o formato do GlobalExceptionHandler do projeto.
 * * @param {Object} error - O objeto de erro retornado pelo Axios ou fetch
 * @returns {string} A mensagem de erro formatada para exibição
 */
export const getBackendErrorMessage = (error) => {
    // 1. Sem resposta do servidor (ex: Backend desligado, erro de rede/CORS)
    if (!error.response) {
        return "Não foi possível conectar ao servidor. Verifique sua conexão com a internet ou tente novamente mais tarde.";
    }

    const data = error.response.data;
    const status = error.response.status;

    // 2. Formato Padrão do seu GlobalExceptionHandler (Lista de strings em 'errors')
    // Ex: { code: 409, status: "CONFLICT", errors: ["E-mail já cadastrado"] }
    if (data && data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        // Se houver mais de um erro, junta eles com uma quebra de linha
        return data.errors.join('\n');
    }

    // 3. Fallback: Formato padrão do Spring Boot (campo 'message')
    // Ex: { timestamp: ..., status: 404, error: "Not Found", message: "User not found" }
    if (data && data.message) {
        return data.message;
    }

    // 4. Fallback: Se o backend retornou apenas uma string pura no corpo
    if (typeof data === 'string' && data.length > 0) {
        return data;
    }

    // 5. Tratamento genérico baseado no Status HTTP (se o JSON estiver vazio ou ilegível)
    switch (status) {
        case 400:
            return "Dados inválidos. Verifique os campos preenchidos.";
        case 401:
            return "Sessão expirada ou credenciais inválidas. Faça login novamente.";
        case 403:
            return "Você não tem permissão para realizar esta ação.";
        case 404:
            return "O recurso solicitado não foi encontrado.";
        case 409:
            return "Conflito: Este registro já existe no sistema.";
        case 413: // Payload Too Large
            return "O arquivo enviado é muito grande.";
        case 415: // Unsupported Media Type
            return "O formato do arquivo não é suportado.";
        case 500:
            return "Erro interno no servidor. Por favor, contate o suporte.";
        default:
            return `Ocorreu um erro inesperado (Código: ${status}). Tente novamente.`;
    }
};