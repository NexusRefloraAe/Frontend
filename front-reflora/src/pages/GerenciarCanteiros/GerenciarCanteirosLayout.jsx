// src/pages/GerenciarCanteiros/GerenciarCanteirosLayout.jsx
import React, { useState } from 'react';
import BotaoSubmenus from '../../components/BotaoSubmenus/BotaoSubmenus';
import CadastrarCanteiro from './CadastrarCanteiro/CadastrarCanteiro';

// (Vamos deixar os outros comentados por enquanto)
import EditarCanteiro from './EditarCanteiro/EditarCanteiro';
import CadastrarPlantioCanteiro from './CadastrarPlantioCanteiro/CadastrarPlantioCanteiro';
import EditarPlantioCanteiro from './EditarPlantioCanteiro/EditarPlantioCanteiro';
// import HistoricoCanteiros from './HistoricoCanteiros/HistoricoCanteiros'; 
// import DistribuicaoMudas from './DistribuicaoMudas';
// import RelatorioCanteiro from './RelatorioCanteiro/RelatorioCanteiro';

import './GerenciarCanteirosLayout.css';

const GerenciarCanteirosLayout = () => {
  // USESTATE: Deve ser 'cadastrar-canteiro'
  const [activeTab, setActiveTab] = useState('cadastrar-canteiro');

  const canteiroMenus = [
    { id: 'cadastrar-canteiro', label: 'Cadastrar Canteiro' },
    { id: 'cadastrar-plantio-canteiro', label: 'Cadastrar Plantio Canteiro' },
    { id: 'editar-canteiro', label: 'Editar Canteiro' },
    { id: 'editar-plantio-canteiro', label: 'Editar Plantio Canteiro' },
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
        {activeTab === 'cadastrar-canteiro' && <CadastrarCanteiro />}
        {activeTab === 'cadastrar-plantio-canteiro' && <CadastrarPlantioCanteiro />} 
        {activeTab === 'editar-canteiro' && <EditarCanteiro />}
        {activeTab === 'editar-plantio-canteiro' && <EditarPlantioCanteiro />}
      </div>
    </div>
  );
};

export default GerenciarCanteirosLayout;