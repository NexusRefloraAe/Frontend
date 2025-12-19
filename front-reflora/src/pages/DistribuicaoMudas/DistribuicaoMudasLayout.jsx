import React, { useState } from 'react';
import BotaoSubmenus from '../../components/BotaoSubmenus/BotaoSubmenus';
import RevisaoDistribuicao from './RevisaoDistribuicao/RevisaoDistribuicao';
import { FaClipboardCheck } from 'react-icons/fa'; // 1. Importando o ícone
import './DistribuicaoMudasLayout.css'; // 2. Importando o CSS
import TabsLayout from '../../components/TabsLayout/TabsLayout';

const DistribuicaoMudasLayout = () => {
    const [activeTab, setActiveTab] = useState('revisao-distribuicao');

    const distribuicaoMenus = [
        { 
            id: 'revisao-distribuicao',
            label: "Revisão de Distribuição",
            icon: <FaClipboardCheck />,
            page: <RevisaoDistribuicao />,
        },
    ];

    return <TabsLayout tabs={distribuicaoMenus} defaultTabId="revisao-distribuicao" />;
};

export default DistribuicaoMudasLayout;