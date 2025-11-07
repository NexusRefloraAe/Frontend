import React, { useState } from 'react';
import BotaoSubmenus from '../../components/BotaoSubmenus/BotaoSubmenus';
import Cadastrar from './Cadastrar/Cadastrar';
import Historico from './Historico/Historico';
import RelatorioVistoria from './RelatorioVistoria/RelatorioVistoria';

const VistoriaLayout = () => {
  const [activeTab, setActiveTab] = useState('cadastrar');

  const vistoriasMenus = [
    { id: 'cadastrar', label: 'Cadastrar' },
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
        {activeTab === 'historico' && <Historico />}
        {activeTab === 'relatorio' && <RelatorioVistoria />}
      </div>
    </div>
  );
};

export default VistoriaLayout;