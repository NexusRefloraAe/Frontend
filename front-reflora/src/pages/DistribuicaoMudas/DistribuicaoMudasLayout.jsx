import React from 'react';
// IMPORTANTE: Adicione useLocation
import { useLocation } from 'react-router-dom'; 

import BotaoSubmenus from '../../components/BotaoSubmenus/BotaoSubmenus';
import RevisaoDistribuicao from './RevisaoDistribuicao/RevisaoDistribuicao';
import RelatorioDistribuicao from './RelatorioDistribuicao/RelatorioDistribuicao';
import TabsLayout from '../../components/TabsLayout/TabsLayout';
import { FaClipboardCheck, FaFileAlt } from 'react-icons/fa';
import './DistribuicaoMudasLayout.css'; 

const DistribuicaoMudasLayout = () => {
    // 1. Pegamos o estado da navegação
    const location = useLocation();

    // 2. Verificamos se veio uma ordem para abrir uma aba específica
    // Se não vier nada, abre 'revisao-distribuicao' por padrão
    const abaInicial = location.state?.tabDestino || 'revisao-distribuicao';

    const distribuicaoMenus = [
        { 
            id: 'revisao-distribuicao',
            label: "Revisão de Distribuição",
            icon: <FaClipboardCheck />,
            page: <RevisaoDistribuicao />,
        },
        { 
            id: 'relatorio-distribuicao',
            label: "Relatório de Distribuição",
            icon: <FaFileAlt />,
            page: <RelatorioDistribuicao />,
        }
    ];

    return (
        <div className="distribuicaomudas-container">
            {/* 3. Passamos o defaultTabId dinâmico */}
            <TabsLayout 
                tabs={distribuicaoMenus} 
                defaultTabId={abaInicial} 
            />
        </div>
    );
};

export default DistribuicaoMudasLayout;