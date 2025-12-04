// Ajuste a porta se necessário (seu log mostrava 8087)
const API_URL = 'http://localhost:8087/api/auth';

export const authService = {
  /**
   * Realiza o cadastro do usuário enviando dados via Multipart/form-data.
   * @param {Object} formData - Objeto com os dados do formulário (nome, email, senha, etc.)
   * @param {File} [photoFile] - (Opcional) Arquivo de foto do usuário, se houver.
   */
  register: async (formData, photoFile = null) => {
    const dataToSend = new FormData();

    // 1. TRATAMENTO DE DATA
    // O input date do HTML retorna "yyyy-mm-dd" (ex: 2002-03-02)
    // O Java @JsonFormat espera "dd/MM/yyyy" (ex: 02/03/2002)
    let dataFormatada = formData.dataNascimento;
    if (formData.dataNascimento && formData.dataNascimento.includes('-')) {
      const dateParts = formData.dataNascimento.split('-');
      // Reconstrói como Dia/Mês/Ano
      dataFormatada = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    }

    // 2. MONTAGEM DO JSON (DTO)
    // Mapeamos os campos do Front para os nomes exatos que o Java espera (CadastroFormDTO)
    const usuarioDTO = {
      nomeCompleto: formData.nomeCompleto,
      email: formData.email,
      numeroCelular: formData.celular, // Front chama 'celular', Back espera 'numeroCelular'
      dataNascimento: dataFormatada,
      // O Java exige Enums em MAIÚSCULO (ex: "MASCULINO") e não aceita string vazia se for null
      genero: formData.genero ? formData.genero.toUpperCase() : null,
      empresa: formData.empresa,
      senha: formData.senha,
      confirmarSenha: formData.confirmarSenha
    };

    // 3. A "MÁGICA" DO BLOB (Crucial para @RequestPart)
    // O Spring exige que a parte "usuario" seja enviada como um arquivo JSON com Content-Type específico
    const jsonBlob = new Blob([JSON.stringify(usuarioDTO)], {
      type: 'application/json'
    });

    // Anexamos o blob com o nome "usuario" (deve ser igual ao @RequestPart("usuario") no Java)
    dataToSend.append('usuario', jsonBlob);

    // 4. ANEXAR FOTO (Se houver)
    // Se você implementou o upload de foto no front, descomente/ajuste aqui:
    if (photoFile) {
      dataToSend.append('foto', photoFile);
    }

    // 5. O ENVIO
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      body: dataToSend
      // NOTA IMPORTANTE: Não coloque 'Content-Type' no header manualmente.
      // O navegador define automaticamente como 'multipart/form-data' com as boundaries corretas.
    });

    // 6. TRATAMENTO DE ERROS DO BACKEND
    if (!response.ok) {
      let errorMessage = 'Erro ao cadastrar';
      try {
        // Tenta ler o JSON de erro padronizado do Java (StandardError)
        const errorData = await response.json();
        // Prioridade: message > error > texto padrão
        errorMessage = errorData.message 
                    || (errorData.errors && errorData.errors.length > 0 ? errorData.errors[0] : null)
                    || errorData.error 
                    || errorMessage;
      } catch (e) {
        console.error("Não foi possível ler o JSON de erro (pode ser texto puro):", e);

        // Se a resposta não for JSON (ex: erro fatal do servidor), lê como texto
        const textError = await response.text();
        if (textError) errorMessage = textError;
      }
      // Lança o erro para o componente React exibir na tela
      throw new Error(errorMessage);
    }

    // Se deu tudo certo (Status 200/201), retorna os dados
    return await response.json();
  },

  /**
   * Altera a senha do usuário.
   * @param {Object} dados - Objeto contendo { novaSenha, confirmarNovaSenha, [email|nomeUsuario|numeroCelular] }
   */
  changePassword: async (dados) => {
    // REMOVIDO TRY/CATCH DESNECESSÁRIO: Deixamos o erro propagar naturalmente
    const response = await fetch(`${API_URL}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados)
    });

    if (!response.ok) {
      let errorMessage = 'Erro ao cadastrar';
      try {
        // Tenta ler o JSON de erro padronizado do Java (StandardError)
        const errorData = await response.json();
        // Prioridade: message > error > texto padrão
        errorMessage = errorData.message 
                    || (errorData.errors && errorData.errors.length > 0 ? errorData.errors[0] : null)
                    || errorData.error 
                    || errorMessage;
      } catch (e) {
        console.error("Não foi possível ler o JSON de erro (pode ser texto puro):", e);

        // Se a resposta não for JSON (ex: erro fatal do servidor), lê como texto
        const textError = await response.text();
        if (textError) errorMessage = textError;
      }
      // Lança o erro para o componente React exibir na tela
      throw new Error(errorMessage);
    }

    return await response.text(); // Retorna "Senha alterada com sucesso!"
  }
};