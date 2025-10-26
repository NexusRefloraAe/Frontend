import React from "react";
import { useState } from "react";
import "./GerenciarSementesStylerLayout.css";
import BotaoSubmenus from "../../components/BotaoSubmenus/BotaoSubmenus";


import CadastrarPlantio from "./CadastrarPlantio/CadastrarPlantio";
import HistoricoPlantio from "./HistoricoPlantio/HistoricoPlantio";
import CadastrarTestes from "./CadastrarTestes/CadastrarTestes";
import HistoricoTestes from "./HistoricoTestes/HistoricoTestes";
import GerarRelatorio from "./GerarRelatorio/GerarRelatorio";

const GerenciarSementesLayout = () => {
  const [activeTab, setActiveTab] = useState('Cadastrar-Plantio');
  
    const sementesMenus = [
      { id: 'Cadastrar-Plantio', label: 'Cadastrar Plantio' },
      { id: 'Histórico-Plantio', label: 'Histórico Plantio' },
      { id: 'Cadastrar-Teste', label: 'Cadastrar Teste' },
      { id: 'Histórico-Testes', label: 'Histórico Testes' },
      { id: 'Gerar-Relatório', label: ' Gerar Relatório' },
  
    ];
  return (
    <div className="gerenciarcanteiro-container">
      <div className="gerenciarcanteiro-nav">
        <BotaoSubmenus
          menus={sementesMenus}
          activeMenuId={activeTab}
          onMenuClick={setActiveTab}
        />
      </div>

      <div className="gerenciarcanteiro-content">
        {activeTab === 'Cadastrar-Plantio' && <CadastrarPlantio />}
        {activeTab === 'Histórico-Plantio' && <HistoricoPlantio />}
        {activeTab === 'Cadastrar-Teste' && <CadastrarTestes />}
        {activeTab === 'Histórico-Testes' && <HistoricoTestes />}
        {activeTab === 'Gerar-Relatório' && <GerarRelatorio/>}

      </div>
    </div>
  );
};

export default GerenciarSementesLayout;
