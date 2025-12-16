import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MenuLaderal from "./header/MenuLaderal";
import ContainerWithTitle from "./header/container2/ContainerWithTitle";
import "./LayoutStyler.css";

const Layout = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hideSidebarAndTitle = location.pathname === "/login";

  // Detecta se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fecha sidebar ao trocar de página no mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (hideSidebarAndTitle) {
    return <Outlet />;
  }

  return (
    <div className="main-container">
      {/* Menu Lateral - Sempre fixo à esquerda */}
      <MenuLaderal 
        isSidebarOpen={sidebarOpen}
        onToggleSidebar={toggleSidebar}
        onCloseSidebar={closeSidebar}
        isMobile={isMobile}
      />
      
      {/* Overlay para mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
        />
      )}

      {/* Conteúdo Principal - Alinhado com sidebar */}
      <div className="content-wrapper">
        {/* Header fixo no topo */}
        <div className="header-fixed">
          <ContainerWithTitle 
            onMenuClick={toggleSidebar}
            isMobile={isMobile}
          />
        </div>
        
        {/* Conteúdo da página */}
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;