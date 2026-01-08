import React from 'react';
import PerfilUsuario from '../../components/PerfilUsuario/PerfilUsuario';
import TabsLayout from "../../components/TabsLayout/TabsLayout";
import { CgProfile } from 'react-icons/cg';
import './Configuracoes.css';

const Configuracoes = () => {
  const configMenus = [
    {
      id: 'profile',
      label: 'Perfil do Usuário',
      icon: <CgProfile />,
      page: (
        <div className="config-content-container">
          <PerfilUsuario />
        </div>
      ),
    },
  ];

  return (
    <div className="config-page-layout">
      <TabsLayout tabs={configMenus} defaultTabId="profile" />
    </div>
  );
};

export default Configuracoes;