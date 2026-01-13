import api from './api';

export const authService = {
  /**
   * Realiza o cadastro (Rota Pública).
   * O Axios detecta FormData automaticamente e configura o Content-Type correto.
   */
  register: async (formData, photoFile = null) => {
    const dataToSend = new FormData();

    // Tratamento de Data
    let dataFormatada = formData.dataNascimento;
    if (formData.dataNascimento && formData.dataNascimento.includes('-')) {
      const dateParts = formData.dataNascimento.split('-');
      dataFormatada = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    }

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

    // Usamos a instância 'api' configurada no api.js
    const response = await api.post('auth/register', dataToSend);
    return response.data;
  },

  /**
   * Altera a senha (Rota Protegida).
   * Não precisamos mais de 'fetchWithAuth'. O interceptor do api.js
   * garante que o token seja enviado e renovado se necessário.
   */
  changePassword: async (dados) => {
    const response = await api.post('/auth/change-password', dados);
    return response.data;
  },

  /**
   * Login (Rota Pública).
   */
  login: async (identifier, password) => {
    const payload = { password };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const numericOnly = identifier.replace(/\D/g, '');
    const isPhone = /^\d{2}9\d{8}$/.test(identifier) && numericOnly.length >= 10;

    if (emailRegex.test(identifier)) {
      payload.email = identifier;
    } else if (isPhone) {
      payload.phoneNumber = identifier; 
    } else {
      payload.username = identifier;
    }

    // O api.js já tem withCredentials: true, então o cookie RefreshToken será salvo
    const response = await api.post('/auth/login', payload);
    const data = response.data;

    // Salvamos o user no localStorage para persistência do AccessToken
    if (data.accessToken) {
      localStorage.setItem('user', JSON.stringify(data));
    }

    return data;
  },

  /**
   * Logout.
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Erro ao tentar fazer logout no servidor:", error);
    } finally {
      // Limpeza local sempre acontece, mesmo se o servidor der erro
      localStorage.removeItem('user');
    }
  },

  /**
   * Recupera o usuário atual do LocalStorage
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }
};