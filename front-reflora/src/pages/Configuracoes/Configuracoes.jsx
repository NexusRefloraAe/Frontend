import React, { useState } from 'react';import PerfilUsuario from '../../components/PerfilUsuario/PerfilUsuario';
import BotaoSubmenus from '../../components/BotaoSubmenus/BotaoSubmenus';
import ConfigSistema from '../../components/ConfigSistema/ConfigSistema'; 
import './Configuracoes.css';

import perfilUsuarioIcon from '../../assets/perfilusuario.svg';
import configuracaoSistemaIcon from '../../assets/configuracaosistema.svg';

const Configuracoes = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const configMenus = [
    {
      id: 'profile',
      label: 'Perfil do Usuário',
      icon: perfilUsuarioIcon,
    },
    {
      id: 'system',
      label: 'Configuração do Sistema',
      icon: configuracaoSistemaIcon,
    },
  ];

  return (
    <div className="configuracoes-wrapper">
      <h1 className="configuracoes-page__title">Configurações</h1>

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