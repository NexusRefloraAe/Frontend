import axios from 'axios';

// URL base do seu backend
export const API_URL = 'http://localhost:8087/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // IMPORTANTE: Permite enviar/receber Cookies (HttpOnly)
  // CORREÇÃO: Removemos o cabeçalho 'Content-Type': 'application/json' fixo.
  // O Axios é inteligente o suficiente para:
  // 1. Usar 'application/json' automaticamente quando enviamos um objeto JS.
  // 2. Usar 'multipart/form-data' com o boundary correto quando enviamos um FormData (uploads).
});

// 1. Interceptor de Requisição: Adiciona o Token JWT se existir
api.interceptors.request.use(
  (config) => {
    // O token está dentro do objeto 'user', não solto no localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Só adiciona o token se ele existir e se a rota não for de refresh (evita loops)
        if (user && user.accessToken && !config.url.includes('/auth/refresh')) {
            config.headers['Authorization'] = `Bearer ${user.accessToken}`;
        }
      } catch (e) {
        console.error("Erro ao ler token do usuário", e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Interceptor de Resposta: Trata o Token Expirado
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Se receber 401 (Não Autorizado) e ainda não tentamos rodar o refresh...
    if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true; 

      try {
        // Tenta renovar o token usando o Cookie HttpOnly
        // A rota aqui deve incluir o /auth pois a baseURL é só /api
        const response = await api.post('/auth/refresh');

        // O backend retorna um AuthResponse com { accessToken: "..." }
        const { accessToken } = response.data; 

        // Atualiza o token dentro do objeto 'user' no LocalStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            user.accessToken = accessToken;
            localStorage.setItem('user', JSON.stringify(user));
        }

        // Atualiza o header da requisição original que falhou com o novo token
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        // Refaz a requisição original
        return api(originalRequest);
      } catch (refreshError) {
        // Se o refresh falhar (ex: refresh token expirou ou é inválido)
        console.error("Sessão expirada. Faça login novamente.");
        localStorage.removeItem('user');
        window.location.href = '/login'; // Redireciona para o login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;