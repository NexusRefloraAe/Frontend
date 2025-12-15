import React, { useState, useEffect } from 'react';
import PainelCard from '../PainelCard/PainelCard';
import { getResumoDashboard } from '../../services/dashboardService';

import card1 from '../../assets/card1.png';
import card2 from '../../assets/card2.png';
import card3 from '../../assets/card3.svg';

// const painelItems = [
//     { id: 1, titulo: 'Total Sementes (kg)', valor: '200.000', icone: card1 },
//     { id: 2, titulo: 'Total Canteiros', valor: '150', icone: card2 },
//     { id: 3, titulo: 'Total Mudas', valor: '150.000', icone: card3 },
// ];

function Painel() {
  
  // Estado para armazenar os dados vindos da API
  // Inicializamos com 0 ou '-' para não quebrar a tela enquanto carrega
  const [dadosDashboard, setDadosDashboard] = useState({
    totalSementes: 0,
    totalCanteiros: 0,
    totalMudas: 0
  });

  const [loading, setLoading] = useState(true);

  // useEffect para buscar os dados assim que o componente abrir
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dados = await getResumoDashboard();
        setDadosDashboard(dados);
      } catch (error) {
        console.error("Falha ao carregar painel");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // Função utilitária para formatar números (ex: 1000 -> 1.000)
  const formatarNumero = (valor) => {
    return new Intl.NumberFormat('pt-BR').format(valor);
  };

  // Mapeamos os dados do estado para o formato que o PainelCard espera
  // Note que agora usamos 'dadosDashboard.totalSementes', etc.
  const painelItems = [
    { 
      id: 1, 
      titulo: 'Total Sementes (unid)', 
      valor: loading ? '...' : formatarNumero(dadosDashboard.totalSementes), 
      icone: card1 
    },
    { 
      id: 2, 
      titulo: 'Total Canteiros', 
      valor: loading ? '...' : formatarNumero(dadosDashboard.totalCanteiros), 
      icone: card2 
    },
    { 
      id: 3, 
      titulo: 'Total Mudas', 
      valor: loading ? '...' : formatarNumero(dadosDashboard.totalMudas), 
      icone: card3 
    },
  ];


  return (
    <div className='content-painel'>
      <div className="title-content">
        <h2>Painel</h2>
      </div>
      <div className="cards">
        {painelItems.map(item => (
            <PainelCard 
                key={item.id} 
                titulo={item.titulo} 
                valor={item.valor} 
                icone={item.icone} />
        ))}
      </div>
    </div>
  );
}

export default Painel
