import api from './api';

export const usuarioService = {
  /**
   * Busca os dados de um usuário pelo ID.
   */
  getUsuario: async (userId) => {
    const response = await api.get(`/usuarios/${userId}`);
    return response.data;
  },

  /**
   * Atualiza os dados do usuário.
   */
  updateUsuario: async (userId, userData, fotoFile) => {
    const dataToSend = new FormData();

    // 1. Tratamento de Data: Frontend (yyyy-MM-dd) -> Backend (dd/MM/yyyy)
    let dataEnvio = userData.dataNascimento;
    if (userData.dataNascimento && userData.dataNascimento.includes('-')) {
        const parts = userData.dataNascimento.split('-');
        dataEnvio = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    // 2. Mapeamento Frontend -> DTO Backend
    const updateDTO = {
        nomeCompleto: userData.nomeCompleto,
        numeroCelular: userData.telefone, 
        dataNascimento: dataEnvio,
        genero: userData.genero, // Envia como está (ex: OUTRO), sem toUpperCase se já estiver correto no state
        empresa: userData.empresa,
        endereco: userData.endereco,
        email: userData.email // Adicionado email, pois o DTO pede @NotNull
    };

    // 3. Criação do Blob JSON
    const jsonBlob = new Blob([JSON.stringify(updateDTO)], { type: 'application/json' });
    dataToSend.append('usuario', jsonBlob);

    if (fotoFile) {
        dataToSend.append('foto', fotoFile);
    }

    // 4. Envio
    // NÃO definimos headers aqui. Deixamos o Axios e o Browser definirem o Boundary.
    const response = await api.put(`/usuarios/${userId}`, dataToSend);
    return response.data;
  },

  /**
   * Exclui a conta do usuário.
   */
  deleteUsuario: async (userId) => {
    await api.delete(`/usuarios/${userId}`);
  }
};