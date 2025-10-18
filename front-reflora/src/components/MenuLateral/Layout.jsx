import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import MenuLaderal from "./header/MenuLaderal";
import ContainerWithTitle from "./header/container2/ContainerWithTitle";
import "./LayoutStyler.css";

const Layout = () => {
  const location = useLocation();
  const hideSidebarAndTitle = location.pathname === "/login";

  return (
    <div className="main-container">
      {/* Menu lateral sempre à esquerda */}
      {!hideSidebarAndTitle && <MenuLaderal />}

      {/* Conteúdo principal: cabeçalho em cima + conteúdo abaixo */}
      <div className="content-wrapper">
        {!hideSidebarAndTitle && <ContainerWithTitle />}
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
