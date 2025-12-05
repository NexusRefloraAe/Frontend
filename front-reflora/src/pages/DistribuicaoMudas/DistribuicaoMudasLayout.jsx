import React, { useState } from 'react';
import BotaoSubmenus from '../../components/BotaoSubmenus/BotaoSubmenus';
import RevisaoDistribuicao from './RevisaoDistribuicao/RevisaoDistribuicao';

const DistribuicaoMudasLayout = () => {
    const [activeTab, setActiveTab] = useState('revisao-distribuicao');

    const distribuicaoMenus = [
        { id: 'revisao-distribuicao', label: 'Revisão de Distribuição' },
       
        // { id: 'historico-distribuicao', label: 'Histórico de Distribuição' },
    ];

    return (
        <div className="distribuicaomudas-container">
            <div className="distribuicaomudas-nav">
                <BotaoSubmenus
                    menus={distribuicaoMenus}
                    activeMenuId={activeTab}
                    onMenuClick={setActiveTab}
                />
            </div>

            <div className="distribuicaomudas-content">
                {activeTab === 'revisao-distribuicao' && <RevisaoDistribuicao />}
            </div>
            


        </div>
    );
};

export default DistribuicaoMudasLayout;