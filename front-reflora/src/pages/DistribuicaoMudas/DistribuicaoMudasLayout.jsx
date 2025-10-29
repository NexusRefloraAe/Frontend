// src/pages/DistribuicaoMudas/DistribuicaoMudasLayout.jsx
import React, { useState } from 'react';
import BotaoSubmenus from '../../components/BotaoSubmenus/BotaoSubmenus';
import RevisaoDistribuicao from './RevisaoDistribuicao/RevisaoDistribuicao';
// No futuro, você pode adicionar 'HistoricoDistribuicao' aqui, por exemplo.

// Crie também um arquivo .css para este layout
import './DistribuicaoMudasLayout.css';

const DistribuicaoMudasLayout = () => {
    // A aba padrão agora é 'revisao-distribuicao'
    const [activeTab, setActiveTab] = useState('revisao-distribuicao');

    // Este layout tem seus próprios submenus
    const distribuicaoMenus = [
        { id: 'revisao-distribuicao', label: 'Revisão de Distribuição' },
        // Exemplo de como você pode adicionar mais abas no futuro:
        // { id: 'historico-distribuicao', label: 'Histórico de Distribuição' },
    ];

    return (
        // Use classes CSS próprias para este layout
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
                {/* {activeTab === 'historico-distribuicao' && <HistoricoDistribuicao />} */}
            </div>
        </div>
    );
};

export default DistribuicaoMudasLayout;