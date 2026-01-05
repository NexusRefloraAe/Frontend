import axios from 'axios';

// Cria a instância do Axios
const api = axios.create({
  baseURL: 'http://localhost:8087/api', // Altere para a URL base da sua API
  withCredentials: true, // IMPORTANTE: Permite enviar/receber Cookies (HttpOnly)
  // CORREÇÃO: Removemos o cabeçalho 'Content-Type': 'application/json' fixo.
  // O Axios é inteligente o suficiente para:
  // 1. Usar 'application/json' automaticamente quando enviamos um objeto JS.
  // 2. Usar 'multipart/form-data' com o boundary correto quando enviamos um FormData (uploads).
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
          // console.log("Token anexado:", user.accessToken); // Descomente para debugar
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

    // 1. Se o erro for na rota de LOGIN, não faz nada (deixa o erro subir para exibir na tela)
    if (originalRequest.url.includes('/auth/login')) {
        return Promise.reject(error);
    }

    // 2. Verifica se o erro é 401 (Unauthorized) OU 403 (Forbidden)
    // O Spring às vezes retorna 403 quando o token expira e o usuário vira "anônimo"
    const status = error.response ? error.response.status : null;
    
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      
      // Verifica se temos um usuário logado antes de tentar refresh
      // (Para evitar loops infinitos se o usuário nem estiver logado)
      if (!localStorage.getItem('user')) {
          return Promise.reject(error);
      }

      originalRequest._retry = true; // Marca para não tentar infinitamente

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
        // Se a renovação falhar (refresh token expirou ou é inválido)
        console.error("Falha ao renovar token. Realizando logout forçado.");
        localStorage.removeItem('user');
        window.location.href = '/login'; // Redireciona para login
        return Promise.reject(_error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;