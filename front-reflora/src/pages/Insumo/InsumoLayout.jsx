import React, { useState } from 'react';
import BotaoSubmenus from '../../components/BotaoSubmenus/BotaoSubmenus';
import Cadastrar from './Cadastrar/Cadastrar';
import Editar from './Editar/Editar';
// import Historico from './Historico/Historico';
// import Listar from './Listar/Listar';
// import Relatorio from './Relatorio/Relatorio';

const InsumoLayout = () => {
  const [activeTab, setActiveTab] = useState('cadastrar');

  const insumosMenus = [
    { id: 'cadastrar', label: 'Cadastrar' },
    { id: 'editar', label: 'Editar' },
    // { id: 'listar', label: 'Listar' },
    { id: 'historico', label: 'Histórico' },
    { id: 'relatorio', label: 'Relatório' },
  ];

  return (
    <div className="insumos-container">
      <div className="insumos-nav">
        <BotaoSubmenus
          menus={insumosMenus}
          activeMenuId={activeTab}
          onMenuClick={setActiveTab}
        />
      </div>

      <div className="insumos-content">
        {activeTab === 'cadastrar' && <Cadastrar />}
        {activeTab === 'editar' && <Editar />}
        {/* {activeTab === 'listar' && <Listar />} */}
        {activeTab === 'historico' && <Historico />}
        {activeTab === 'relatorio' && <Relatorio />}
      </div>
    </div>
  );
};

export default InsumoLayout;