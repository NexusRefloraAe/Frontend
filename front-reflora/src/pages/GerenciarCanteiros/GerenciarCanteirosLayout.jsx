// src/pages/GerenciarCanteiros/GerenciarCanteirosLayout.jsx
import React, { useState } from 'react';
import BotaoSubmenus from '../../components/BotaoSubmenus/BotaoSubmenus';
import CadastrarCanteiro from './CadastrarCanteiro/CadastrarCanteiro';

// (Vamos deixar os outros comentados por enquanto)
// import EditarCanteiro from './EditarCanteiro/EditarCanteiro';
// import HistoricoCanteiros from './HistoricoCanteiros/HistoricoCanteiros'; 
// import DistribuicaoMudas from './DistribuicaoMudas';
// import RelatorioCanteiro from './RelatorioCanteiro/RelatorioCanteiro';

import './GerenciarCanteirosLayout.css';

const GerenciarCanteirosLayout = () => {
  // ✅ CORREÇÃO DO USESTATE: Deve ser 'cadastrar-canteiro'
  const [activeTab, setActiveTab] = useState('cadastrar-canteiro');

  const canteiroMenus = [
    { id: 'cadastrar-canteiro', label: 'Cadastrar Canteiro' },
    { id: 'editar-canteiro', label: 'Editar Canteiro' },
    { id: 'historico', label: 'Histórico Canteiros' },
    { id: 'distribuicao', label: 'Distribuição de Mudas' },
    { id: 'relatorio', label: 'Relatório Canteiro' },
  ];

  return (
    <div className="gerenciarcanteiro-container">
      <div className="gerenciarcanteiro-nav">
        <BotaoSubmenus
          menus={canteiroMenus}
          activeMenuId={activeTab}
          onMenuClick={setActiveTab}
        />
      </div>

      <div className="gerenciarcanteiro-content">
        {/* Agora esta condição é VERDADEIRA e ele vai tentar renderizar */}
        {activeTab === 'cadastrar-canteiro' && <CadastrarCanteiro />}
      </div>
    </div>
  );
};

export default GerenciarCanteirosLayout;