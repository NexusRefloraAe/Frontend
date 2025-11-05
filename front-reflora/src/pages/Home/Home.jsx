import React from 'react';
import './Home.css';

import Painel from '../../components/Painel/Painel';
import Notificacoes from '../../components/Notificacoes/Notificacoes';

function Home() {
  return (
    <div className="home-container">
      <Painel />
      <Notificacoes />
    </div>
  );
}

export default Home;