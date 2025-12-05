import React, { useState } from 'react';
import BotaoSubmenus from '../../components/BotaoSubmenus/BotaoSubmenus';
import Cadastrar from './Cadastrar/Cadastrar';
import Historico from './Historico/Historico';
import RelatorioVistoria from './RelatorioVistoria/RelatorioVistoria';
import { FaSearchPlus } from 'react-icons/fa';
import { TbReportSearch, TbReportAnalytics } from 'react-icons/tb';

const VistoriaLayout = () => {
  const [activeTab, setActiveTab] = useState('cadastrar');

  const vistoriasMenus = [
    { id: 'cadastrar', label: 'Cadastrar', icon: <FaSearchPlus /> },
    { id: 'historico', label: 'Histórico', icon: <TbReportSearch /> },
    { id: 'relatorio', label: 'Relatório', icon: <TbReportAnalytics /> },
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