import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaSeedling, FaTools, FaClipboardList, FaChartBar, FaCog, FaSignOutAlt } from "react-icons/fa";
import { GiPlantSeed, GiFarmTractor } from "react-icons/gi";
import SidebarItem from "../sidebarItem/SidebarItem";
import "./SidebarStyler.css";
const Sidebar = ({ active, fixed }) => {
  const navigate = useNavigate();

  const closeSidebar = () => {
    if (active) active(false);
  };

  const home = () => navigate("/home");

  return (
    <div className={`sidebar-container ${fixed ? "fixed" : ""} ${active ? "active" : ""}`}>
      {!fixed && <FaTimes className="close-icon" onClick={closeSidebar} />}

      <div className="menu-toggle" onClick={home}>
        <span>Reflora_aê</span>
      </div>

      <div className="sidebar-content">
        <SidebarItem Icon={GiPlantSeed} Text="Banco de Sementes" onClick={() => navigate("/banco-sementes")} />
        <SidebarItem Icon={FaSeedling} Text="Gerenciar Sementes"  onClick={() => navigate("/gerenciar-sementes")}/>
        <SidebarItem Icon={GiFarmTractor} Text="Gerenciar Canteiros" onClick={() => navigate("/gerenciar-canteiros")}/>
        <SidebarItem Icon={FaClipboardList} Text="Vistorias" />
        <SidebarItem Icon={FaTools} Text="Gestão de Insumos" />
        <SidebarItem Icon={FaChartBar} Text="Relatórios" />
        <SidebarItem Icon={FaCog} Text="Configuração" onClick={() => navigate("/configuracoes")} />
        <SidebarItem Icon={FaSignOutAlt} Text="Sair" isLogout onClick={() => navigate("/login")} />
      </div>
    </div>
  );
};

export default Sidebar;
