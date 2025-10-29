// src/pages/GerenciarCanteiros/GerenciarCanteirosLayout.jsx
import React, { useState } from 'react';
import BotaoSubmenus from '../../components/BotaoSubmenus/BotaoSubmenus';
import CadastrarCanteiro from './CadastrarCanteiro/CadastrarCanteiro';

import EditarCanteiro from './EditarCanteiro/EditarCanteiro';
import CadastrarPlantioCanteiro from './CadastrarPlantioCanteiro/CadastrarPlantioCanteiro';
import EditarPlantioCanteiro from './EditarPlantioCanteiro/EditarPlantioCanteiro';
import CadastrarInspecaoMudas from './InspecaoMudas/CadastrarInspecaoMudas';

// 1. REMOVER O IMPORT de RevisaoDistribuicao
// import RevisaoDistribuicao from '../DistribuicaoMudas/RevisaoDistribuicao/RevisaoDistribuicao';

import './GerenciarCanteirosLayout.css';

const GerenciarCanteirosLayout = () => {
  const [activeTab, setActiveTab] = useState('cadastrar-canteiro');

  const canteiroMenus = [
    { id: 'cadastrar-canteiro', label: 'Cadastrar Canteiro' },
    { id: 'cadastrar-plantio-canteiro', label: 'Cadastrar Plantio Canteiro' },
    { id: 'editar-canteiro', label: 'Editar Canteiro' },
    { id: 'editar-plantio-canteiro', label: 'Editar Plantio Canteiro' },
    { id: 'cadastrar-inspecao-mudas', label: 'Cadastrar Inspeção de Mudas' },

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
        {activeTab === 'cadastrar-inspecao-mudas' && <CadastrarInspecaoMudas />}

      </div>
    </div>
  );
};

export default GerenciarCanteirosLayout;