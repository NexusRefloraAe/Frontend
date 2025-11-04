// src/pages/Vistorias/VistoriasLayout.jsx
import React, { useState } from 'react';
import BotaoSubmenus from '../../components/BotaoSubmenus/BotaoSubmenus';
import Cadastrar from './Cadastrar/Cadastrar';
import Editar from './Editar/Editar';
import Historico from './Historico/Historico';
import Listar from './Listar/Listar';
import Relatorio from './Relatorio/Relatorio';
import './VistoriaLayout.css';

const VistoriaLayout = () => {
  const [activeTab, setActiveTab] = useState('cadastrar');

  const vistoriasMenus = [
    { id: 'cadastrar', label: 'Cadastrar' },
    { id: 'editar', label: 'Editar' },
    { id: 'listar', label: 'Listar' },
    { id: 'historico', label: 'Histórico' },
    { id: 'relatorio', label: 'Relatório' },
  ];

  return (
    <div className="vistorias-container">
      <div className="vistorias-nav">
        <BotaoSubmenus
          menus={vistoriasMenus}
          activeMenuId={activeTab}
          onMenuClick={setActiveTab}
        />
      </div>

      <div className="vistorias-content">
        {activeTab === 'cadastrar' && <Cadastrar />}
        {activeTab === 'editar' && <Editar />}
        {activeTab === 'listar' && <Listar />}
        {activeTab === 'historico' && <Historico />}
        {activeTab === 'relatorio' && <Relatorio />}
      </div>
    </div>
  );
};

export default VistoriaLayout;