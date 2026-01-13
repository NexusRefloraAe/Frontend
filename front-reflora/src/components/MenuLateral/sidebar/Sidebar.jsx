import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaTimes,
  FaSeedling,
  FaTools,
  FaClipboardList,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaClipboardCheck
} from "react-icons/fa";
import { GiPlantSeed, GiFarmTractor } from "react-icons/gi";
import SidebarItem from "../sidebarItem/SidebarItem";
import "./SidebarStyler.css";
import { authService } from "../../../services/authService";

const Sidebar = ({ active, fixed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const closeSidebar = () => {
    if (active) active(false);
  };

  const home = () => navigate("/home");

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Erro ao tentar fazer logout:", error);
    } finally {
      navigate("/login");
    }
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className={`sidebar-container ${fixed ? "fixed" : ""} ${active ? "active" : ""}`}>
      {!fixed && <FaTimes className="close-icon" onClick={closeSidebar} />}

      {/* CORREÇÃO: Adicionado estilo inline para forçar cor branca */}
      <div 
        className="menu-toggle" 
        onClick={home}
        style={{ 
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          margin: '25px'
        }}
      >
        <span style={{ 
          color: '#ffffff', 
          fontWeight: 'bold', 
          fontSize: '28px',
          textDecoration: 'none'
        }}>
          Reflora_aê
        </span>
      </div>

      <div className="sidebar-content">
        <SidebarItem
          Icon={GiPlantSeed}
          Text="Banco de Sementes"
          onClick={() => navigate("/banco-sementes")}
          active={isActive("/banco-sementes")}
        />
        <SidebarItem
          Icon={FaSeedling}
          Text="Gerenciar Sementes"
          onClick={() => navigate("/gerenciar-sementes")}
          active={isActive("/gerenciar-sementes")}
        />
        <SidebarItem
          Icon={GiFarmTractor}
          Text="Gerenciar Canteiros"
          onClick={() => navigate("/gerenciar-canteiros")}
          active={isActive("/gerenciar-canteiros")}
        />
        <SidebarItem
          Icon={FaClipboardList}
          Text="Distribuir Mudas"
          onClick={() => navigate("/distribuicao-mudas")}
          active={isActive("/distribuicao-mudas")}
        />
        <SidebarItem
          Icon={FaClipboardCheck}
          Text="Vistoria"
          onClick={() => navigate("/vistoria")}
          active={isActive("/vistoria")}
        />
        <SidebarItem
          Icon={FaTools}
          Text="Gestão de Insumos"
          onClick={() => navigate("/insumo")}
          active={isActive("/insumo")}
        />
        <SidebarItem
          Icon={FaChartBar}
          Text="Relatórios"
          onClick={() => navigate("/relatorios")}
          active={isActive("/relatorios")}
        />
        <SidebarItem
          Icon={FaCog}
          Text="Configuração"
          onClick={() => navigate("/configuracoes")}
          active={isActive("/configuracoes")}
        />
        <SidebarItem
          Icon={FaSignOutAlt}
          Text="Sair"
          isLogout={true}
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default Sidebar;