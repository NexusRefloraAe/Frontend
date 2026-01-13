import React, { useState } from 'react';
import TabLayout from '../../components/TabsLayout/TabsLayout';
import Cadastrar from './Cadastrar/Cadastrar';
import Historico from './Historico/Historico';
import RelatorioVistoria from './RelatorioVistoria/RelatorioVistoria';
import { FaSearchPlus } from 'react-icons/fa';
import { TbReportSearch, TbReportAnalytics } from 'react-icons/tb';

const VistoriaLayout = () => {
  const [activeTab, setActiveTab] = useState('cadastrar');

  const vistoriasMenus = [
    { id: 'cadastrar', 
      label: 'Cadastrar', 
      icon: <FaSearchPlus /> ,
      page: <Cadastrar />
    },

    { id: 'historico', 
      label: 'Histórico', 
      icon: <TbReportSearch />, 
      page: <Historico />
    },
    { id: 'relatorio', 
      label: 'Relatório', 
      icon: <TbReportAnalytics/>,
      page: <RelatorioVistoria />
     },
  ];

  return <TabLayout tabs={vistoriasMenus} defaultActiveTab="cadastrar" />;
};

export default VistoriaLayout;