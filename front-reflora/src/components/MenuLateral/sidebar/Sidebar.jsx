import React from 'react'
import { useNavigate } from "react-router-dom";
import { Container, Content, MenuToggle } from './SidebarStyler'
import { FaSeedling, FaTools, FaClipboardList, FaChartBar, FaCog, FaSignOutAlt} from 'react-icons/fa';
import { GiPlantSeed, GiFarmTractor } from 'react-icons/gi';

import SidebarItem from '../sidebarItem/SidebarItem'

const Sidebar = ({ active }) => {
  const navigate = useNavigate();// hook para navegar entre rotas

  const closeSidebar = () => {
    active(false)
  }
  const home = () => navigate("/")
   

  return (
    <Container sidebar={active}>
       <MenuToggle onClick={home } >
        <span>Reflora_aê</span> 
       </MenuToggle>
      <Content>
        <SidebarItem Icon={GiPlantSeed} Text="Banco de Sementes" onClick={() => navigate("/banco-sementes")}/>
        <SidebarItem Icon={FaSeedling} Text="Gerenciar Sementes" />
        <SidebarItem Icon={GiFarmTractor} Text="Gerenciar Canteiro" />
        <SidebarItem Icon={FaClipboardList} Text="Vistorias" />
        <SidebarItem Icon={FaTools} Text="Gestão de Insumos" />
        <SidebarItem Icon={FaChartBar} Text="Relatórios" />
        <SidebarItem Icon={FaCog } Text="Configuração" />
        <SidebarItem Icon={FaSignOutAlt}  Text="Sair" isLogout onClick={() => navigate("/login")}  />
      </Content>
    </Container>
  )
}

export default Sidebar