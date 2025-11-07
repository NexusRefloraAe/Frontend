import React, { useState } from "react";
import BotaoSubmenus from "../BotaoSubmenus/BotaoSubmenus";
import "./TabsLayoutStyler.css";

/**
 * Componente genérico para criar layouts com abas (tabs).
 * 
 * @param {Object[]} tabs - Lista de abas no formato { id, label, icon, page }
 * @param {string} [defaultTabId] - Aba inicial selecionada
 */
const TabsLayout = ({ tabs, defaultTabId }) => {
  const [activeTab, setActiveTab] = useState(defaultTabId || tabs[0]?.id);

  // Encontra a aba ativa
  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="tabs-layout-container">
      {/* Barra de navegação com botões */}
      <div className="tabs-layout-nav">
        <BotaoSubmenus
          menus={tabs.map(({ id, label, icon }) => ({ id, label, icon }))}
          activeMenuId={activeTab}
          onMenuClick={setActiveTab}
        />
      </div>

      {/* Conteúdo da aba ativa */}
      <div className="tabs-layout-content">
        {activeTabData?.page || <div>Conteúdo não encontrado</div>}
      </div>
    </div>
  );
};

export default TabsLayout;