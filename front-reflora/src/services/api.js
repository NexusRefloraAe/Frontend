import axios from 'axios';

// Cria a instância do Axios
const api = axios.create({
  baseURL: 'http://localhost:8087/api', // Ajuste a porta se necessário
  withCredentials: true,// IMPORTANTE: Permite enviar/receber Cookies (HttpOnly)
  // CORREÇÃO: Removemos o cabeçalho 'Content-Type': 'application/json' fixo.
  // O Axios é inteligente o suficiente para:
  // 1. Usar 'application/json' automaticamente quando enviamos um objeto JS.
  // 2. Usar 'multipart/form-data' com o boundary correto quando enviamos um FormData (uploads).
});

// --- INTERCEPTOR DE REQUISIÇÃO ---
// Antes de enviar, adiciona o Token de Acesso se ele existir no LocalStorage
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- INTERCEPTOR DE RESPOSTA (AQUI ESTAVA O PROBLEMA) ---
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 1. SE O ERRO FOR NO LOGIN, NÃO FAZ NADA, SÓ RETORNA O ERRO
    // Isso evita o loop infinito quando você erra a senha
    if (originalRequest.url.includes('/auth/login')) {
        return Promise.reject(error);
    }

    // 2. Se o erro for 401 (Não autorizado) e NÃO for uma tentativa repetida
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marca que já tentamos renovar uma vez

      try {
        // Tenta pegar um novo token usando o cookie HttpOnly
        // O backend deve ter um endpoint /auth/refresh-token que lê o cookie e devolve novo access token
        const rs = await api.post('/auth/refresh-token');

        const { accessToken } = rs.data;

        // Atualiza o token no LocalStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            user.accessToken = accessToken;
            localStorage.setItem('user', JSON.stringify(user));
        }

        // Atualiza o header da requisição original e tenta de novo
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);

      } catch (_error) {
        // Se a renovação falhar (refresh token expirou ou inválido)
        // Limpa tudo e força logout
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(_error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;