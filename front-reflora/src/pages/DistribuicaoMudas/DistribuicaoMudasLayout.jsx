import React, { useState } from 'react';
import BotaoSubmenus from '../../components/BotaoSubmenus/BotaoSubmenus';
import RevisaoDistribuicao from './RevisaoDistribuicao/RevisaoDistribuicao';
import { FaClipboardCheck } from 'react-icons/fa'; // 1. Importando o ícone
import './DistribuicaoMudasLayout.css'; // 2. Importando o CSS

const DistribuicaoMudasLayout = () => {
    const [activeTab, setActiveTab] = useState('revisao-distribuicao');

    const distribuicaoMenus = [
        { 
            id: 'revisao-distribuicao', 
            // 3. Adicionando o ícone e o texto dentro de um fragmento ou div para o botão
            label: (
                <div className="menu-item-content">
                    <FaClipboardCheck size={18} />
                    <span>Revisão de Distribuição</span>
                </div>
            )
        },
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