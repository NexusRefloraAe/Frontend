import React, { useState } from 'react';
import PerfilUsuario from '../../components/PerfilUsuario/PerfilUsuario';
import BotaoSubmenus from '../../components/BotaoSubmenus/BotaoSubmenus';
import ConfigSistema from '../../components/ConfigSistema/ConfigSistema'; 
import './Configuracoes.css';

import { CgProfile } from 'react-icons/cg';
import { GrConfigure } from 'react-icons/gr';

const Configuracoes = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const configMenus = [
    {
      id: 'profile',
      label: 'Perfil do Usuário',
      icon: <CgProfile />,
    },
    {
      id: 'system',
      label: 'Configuração do Sistema',
      icon: <GrConfigure />,
    },
  ];

  return (
    <div className="configuracoes-wrapper">
      <BotaoSubmenus
        menus={configMenus}
        activeMenuId={activeTab}
        onMenuClick={setActiveTab}
      />

      <div className="auth-form configuracoes-card">
        <div className="configuracoes-content">
          {activeTab === 'profile' && (
            <div className="configuracoes-profile-section">
              <PerfilUsuario /> 
            </div>
          )}
          {activeTab === 'system' && (
            <div className="configuracoes-system-section">
              <ConfigSistema /> 
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;