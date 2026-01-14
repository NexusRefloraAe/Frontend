import axios from 'axios';

// 1. Definimos a URL base de forma dinâmica
// Se existir uma variável de ambiente VITE_API_URL, usa ela.
// Se não, usa o link do seu back-end Koyeb como fallback (padrão).
const BASE_URL = import.meta.env.VITE_API_URL || 'https://disciplinary-nanon-123silvio456-81c7b556.koyeb.app/api';

// Cria a instância do Axios
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // IMPORTANTE: Permite enviar/receber Cookies (HttpOnly)
});

// --- INTERCEPTOR DE REQUISIÇÃO ---
api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        
        // Verifica se o accessToken existe
        if (user?.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        } else {
            console.warn("Usuário encontrado no storage, mas sem accessToken.");
        }
      } catch (e) {
        console.error("Erro no parse do usuário:", e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- INTERCEPTOR DE RESPOSTA (CORREÇÃO DE REFRESH) ---
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 1. Se o erro for na rota de LOGIN, não faz nada
    if (originalRequest.url.includes('/auth/login')) {
        return Promise.reject(error);
    }

    // 2. Verifica se o erro é 401 (Unauthorized) OU 403 (Forbidden)
    const status = error.response ? error.response.status : null;
    
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      
      if (!localStorage.getItem('user')) {
          return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        console.log("Token expirado (401/403). Tentando renovar...");
        
        // Tenta pegar um novo token
        const rs = await api.post('/auth/refresh');
        const { accessToken } = rs.data;

        // Atualiza o token no LocalStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            user.accessToken = accessToken;
            localStorage.setItem('user', JSON.stringify(user));
        }

        // Atualiza o header da requisição original e refaz a chamada
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        
        return api(originalRequest);

      } catch (_error) {
        console.error("Falha ao renovar token. Realizando logout forçado.");
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(_error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;