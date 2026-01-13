import api from './api';

export const relatorioService = {
  // 1. Busca os dados do Painel (Totais + Tabela Paginada)
  getPainel: async (filtros, pagina = 0, itensPorPagina = 9) => {
    const params = {
      nomePopular: filtros.nomePopular || '',
      dataInicio: filtros.dataInicio || null, // Backend espera yyyy-MM-dd
      dataFim: filtros.dataFim || null,
      page: pagina,
      size: itensPorPagina,
      sort: 'data,desc' // Ordenação padrão do backend
    };

    const response = await api.get('/registros/painel', { params });
    return response.data; 
    // O retorno será: { totalEntrada, totalSaida, saldoDoPeriodo, registros: Page<?> }
  },

  // 2. Exportar CSV (Download de Arquivo)
  exportarCsv: async (filtros) => {
    const params = {
      nomePopular: filtros.nomePopular || '',
      dataInicio: filtros.dataInicio || null,
      dataFim: filtros.dataFim || null
    };

    const response = await api.get('/registros/exports/csv', {
      params,
      responseType: 'blob' // IMPORTANTE: Diz ao Axios que a resposta é um arquivo binário
    });

    // Cria um link temporário para forçar o download no navegador
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  // 3. Exportar PDF (Download de Arquivo)
  exportarPdf: async (filtros) => {
    const params = {
      nomePopular: filtros.nomePopular || '',
      dataInicio: filtros.dataInicio || null,
      dataFim: filtros.dataFim || null
    };

    const response = await api.get('/registros/exports/pdf', {
      params,
      responseType: 'blob' 
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_${new Date().getTime()}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};