// src/services/dashboardService.js
import api from './api'; // Ajuste o caminho conforme onde está seu arquivo api.js

export const getResumoDashboard = async () => {
    try {
        // Chama a rota definida no seu Controller Java: /api/dashboard/resumo
        const response = await api.get('/dashboard/resumo');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
        throw error;
    }
};