import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaSeedling, FaTools, FaClipboardList, FaChartBar, FaCog, FaSignOutAlt } from "react-icons/fa";
import { GiPlantSeed, GiFarmTractor } from "react-icons/gi";
import SidebarItem from "../sidebarItem/SidebarItem";
import "./SidebarStyler.css";
import { authService } from "../../../services/authService";

const Sidebar = ({ active, fixed }) => {
  const navigate = useNavigate();

  const closeSidebar = () => {
    if (active) active(false);
  };

  const home = () => navigate("/home");

  // 2. Crie a função de logout
  const handleLogout = async () => {
    try {
      // Chama o serviço para invalidar o token no back-end e limpar o localStorage
      await authService.logout();
    } catch (error) {
      console.error("Erro ao tentar fazer logout:", error);
    } finally {
      // Independente de dar erro ou sucesso no servidor, redireciona para login
      navigate("/login");
    }
  };

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
        <SidebarItem Icon={FaClipboardList} Text="Distribuir Mudas" onClick={() => navigate("/distribuicao-mudas")}/>
        <SidebarItem Icon={FaClipboardList} Text="Vistoria" onClick={() => navigate("/vistoria")} /> 
        <SidebarItem Icon={FaTools} Text="Gestão de Insumos" onClick={() => navigate("/insumo")} />
        <SidebarItem Icon={FaChartBar} Text="Relatórios" onClick={() => navigate("/relatorios")} />
        <SidebarItem Icon={FaCog} Text="Configuração" onClick={() => navigate("/configuracoes")} />
        <SidebarItem Icon={FaSignOutAlt} Text="Sair" isLogout onClick={handleLogout} />
      </div>
    </div>
  );
};

export default Sidebar;
