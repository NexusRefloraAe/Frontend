// authService.js

// Ajuste a porta se necessário
const API_URL = 'http://localhost:8087/api/auth';

/**
 * Helper interno para pegar o token de acesso salvo.
 */
const getAccessToken = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    return user.accessToken;
  }
  return null;
};

/**
 * Helper interno: Fetch customizado que lida com Auth e Refresh Token.
 * 1. Adiciona o Header Authorization.
 * 2. Se der 401 (Unauthorized), tenta dar refresh no token e refaz a chamada.
 * * Usado em rotas PROTEGIDAS onde queremos manter o usuário logado.
 */
const fetchWithAuth = async (url, options = {}) => {
  // 1. Configura Headers Padrão
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 2. Adiciona o Token de Acesso se existir
  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 3. Configurações do Fetch (importante: credentials 'include' para enviar Cookies)
  const fetchOptions = {
    ...options,
    headers,
    credentials: 'include', // Necessário para o navegador enviar o Cookie refreshToken
  };

  let response = await fetch(url, fetchOptions);

  // 4. Lógica de Refresh Token (Se recebermos 401 - Não Autorizado)
  if (response.status === 401) {
    try {
      // Tenta renovar o token chamando o endpoint de refresh
      // O cookie refreshToken será enviado automaticamente devido ao credentials: 'include'
      const refreshResponse = await fetch(`${API_URL}/refresh-token`, {
        method: 'POST',
        credentials: 'include' 
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        
        // Atualiza o token no LocalStorage
        const currentUser = JSON.parse(localStorage.getItem('user'));
        currentUser.accessToken = data.accessToken;
        localStorage.setItem('user', JSON.stringify(currentUser));

        // Refaz a requisição original com o novo token
        headers['Authorization'] = `Bearer ${data.accessToken}`;
        response = await fetch(url, { ...fetchOptions, headers });
      } else {
        // Se o refresh falhar (ex: refresh token também expirou), fazemos logout
        authService.logout();
        throw new Error('Sessão expirada. Faça login novamente.');
      }
    } catch (error) {
      authService.logout();
      throw error;
    }
  }

  return response;
};

export const authService = {
  /**
   * Realiza o cadastro (Rota Pública).
   */
  register: async (formData, photoFile = null) => {
    const dataToSend = new FormData();

    // Tratamento de Data
    let dataFormatada = formData.dataNascimento;
    if (formData.dataNascimento && formData.dataNascimento.includes('-')) {
      const dateParts = formData.dataNascimento.split('-');
      dataFormatada = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    }

    // Montagem do JSON (DTO)
    const usuarioDTO = {
      nomeCompleto: formData.nomeCompleto,
      email: formData.email,
      numeroCelular: formData.celular,
      dataNascimento: dataFormatada,
      genero: formData.genero ? formData.genero.toUpperCase() : null,
      empresa: formData.empresa,
      senha: formData.senha,
      confirmarSenha: formData.confirmarSenha
    };

    const jsonBlob = new Blob([JSON.stringify(usuarioDTO)], { type: 'application/json' });
    dataToSend.append('usuario', jsonBlob);

    if (photoFile) {
      dataToSend.append('foto', photoFile);
    }

    // Adicionado credentials: 'include' para caso o registro já sete o cookie
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      body: dataToSend,
      credentials: 'include' 
    });

    if (!response.ok) {
      let errorMessage = 'Erro ao cadastrar';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message 
                    || (errorData.errors && errorData.errors.length > 0 ? errorData.errors[0] : null)
                    || errorData.error 
                    || errorMessage;
      } catch {
        const textError = await response.text();
        if (textError) errorMessage = textError;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  },

  /**
   * Altera a senha (Rota Protegida).
   * AQUI CONTINUAMOS USANDO 'fetchWithAuth' PARA GARANTIR O REFRESH
   */
  changePassword: async (dados) => {
    // Se o token estiver expirado, fetchWithAuth renova ele antes de trocar a senha
    const response = await fetchWithAuth(`${API_URL}/change-password`, {
      method: 'POST',
      body: JSON.stringify(dados)
    });

    if (!response.ok) {
      let errorMessage = 'Erro ao alterar senha';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message 
                    || (errorData.errors && errorData.errors.length > 0 ? errorData.errors[0] : null)
                    || errorData.error 
                    || errorMessage;
      } catch {
        const textError = await response.text();
        if (textError) errorMessage = textError;
      }
      throw new Error(errorMessage);
    }

    return await response.text();
  },

  /**
   * Login (Rota Pública).
   */
  login: async (identifier, password) => {
    const payload = { password };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const numericOnly = identifier.replace(/\D/g, '');
    const isPhone = /^[\d\(\)\-\s]+$/.test(identifier) && numericOnly.length >= 10;

    if (emailRegex.test(identifier)) {
      payload.email = identifier;
    } else if (isPhone) {
      payload.phoneNumber = identifier; 
    } else {
      payload.username = identifier;
    }

    // ADICIONADO credentials: 'include' AQUI
    // Essencial para o navegador aceitar e salvar o Set-Cookie do Refresh Token
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
    });

    if (!response.ok) {
      let errorMessage = 'Erro ao realizar login';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message 
                    || (errorData.errors && errorData.errors.length > 0 ? errorData.errors[0] : null)
                    || errorData.error 
                    || errorMessage;
      } catch {
        const textError = await response.text();
        if (textError) errorMessage = textError;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (data.accessToken) {
      localStorage.setItem('user', JSON.stringify(data));
    }

    return data;
  },

  /**
   * Logout.
   * AQUI USAMOS FETCH NORMAL.
   */
  logout: async () => {
    try {
      // Usamos fetch normal com credentials: 'include'.
      // Não usamos fetchWithAuth porque não queremos renovar token para quem está saindo.
      // O path "/" no backend garante que o cookie seja encontrado e deletado.
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include' 
      });
    } catch (error) {
      console.error("Erro ao tentar fazer logout no servidor:", error);
    } finally {
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }
};