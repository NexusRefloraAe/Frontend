import React, { useState } from 'react';
import PerfilUsuario from '../../components/PerfilUsuario/PerfilUsuario';
import ConfigSistema from '../../components/ConfigSistema/ConfigSistema';
import './Configuracoes.css';
import TabsLayout from "../../components/TabsLayout/TabsLayout";

import { CgProfile } from 'react-icons/cg';
import { GrConfigure } from 'react-icons/gr';

const Configuracoes = () => {

  const configMenus = [
    {
      id: 'profile',
      label: 'Perfil do Usuário',
      icon: <CgProfile />,
      page: <PerfilUsuario />,
    },
    {
      id: 'system',
      label: 'Configuração do Sistema',
      icon: <GrConfigure />,
      page: <ConfigSistema />,
    },
  ];

  return <TabsLayout tabs={configMenus} defaultTabId="profile" />;
};

export default Configuracoes;