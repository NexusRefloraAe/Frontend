import React, { useState, useEffect } from 'react';
import PainelCard from '../PainelCard/PainelCard';
import { getResumoDashboard } from '../../services/dashboardService';
import './Painel.css'; // Certifique-se de importar o CSS

import card1 from '../../assets/card1.png';
import card2 from '../../assets/card2.png';
import card3 from '../../assets/card3.svg';

function Painel() {
  const [dadosDashboard, setDadosDashboard] = useState({
    totalSementesUnd: 0,
    totalSementesKg: 0,
    totalCanteiros: 0,
    totalMudas: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dados = await getResumoDashboard();
        // Garante que dados nunca seja null/undefined
        setDadosDashboard(dados || {});
      } catch (error) {
        console.error("Falha ao carregar painel");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // MELHORIA: Proteção contra NaN (Not a Number)
  const formatarNumero = (valor) => {
    const numero = Number(valor);
    // Se não for um número válido ou for 0, retorna "0"
    if (isNaN(numero)) return "0";
    return new Intl.NumberFormat('pt-BR').format(numero);
  };

  // MELHORIA: Cores vibrantes adicionadas (Fundo + Borda)
  const painelItems = [
    { 
      id: 1, 
      titulo: 'Total Sementes (unid)', 
      valor: loading ? '...' : formatarNumero(dadosDashboard.totalSementesUnd), 
      icone: card1,
      corFundo: '#dbeafe', // Azul claro
      corBorda: '#60a5fa'  // Azul mais forte
    },
    { 
      id: 2, 
      titulo: 'Total Sementes (Kg)', 
      valor: loading ? '...' : formatarNumero(dadosDashboard.totalSementesKg), 
      icone: card1,
      corFundo: '#dcfce7', // Verde claro
      corBorda: '#4ade80'  // Verde mais forte
    },
    { 
      id: 3, 
      titulo: 'Total Canteiros', 
      valor: loading ? '...' : formatarNumero(dadosDashboard.totalCanteiros), 
      icone: card2,
      corFundo: '#fef3c7', // Amarelo claro
      corBorda: '#fcd34d'  // Amarelo mais forte
    },
    { 
      id: 4, 
      titulo: 'Total Mudas', 
      valor: loading ? '...' : formatarNumero(dadosDashboard.totalMudas), 
      icone: card3,
      corFundo: '#f3e8ff', // Roxo claro
      corBorda: '#c084fc'  // Roxo mais forte
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
                icone={item.icone}
                corFundo={item.corFundo}
                // Passamos a borda via style inline para ficar dinâmico
                style={{ border: `2px solid ${item.corBorda}` }} 
            />
        ))}
      </div>
    </div>
  );
}

export default Painel;