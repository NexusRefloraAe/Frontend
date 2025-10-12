// src/components/MenuLateral/Layout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import MenuLaderal from "./header/MenuLaderal";
import ContainerWithTitle from "./header/container2/ContainerWithTitle";
import "./LayoutStyler.css";

const Layout = () => {
  const location = useLocation();

  // Verifica se a rota atual é /login
  const hideSidebarAndTitle = location.pathname === "/login";

  return (
    <div className="MainContainer">
      {/* Só exibe se não estiver na tela de login */}
      {!hideSidebarAndTitle && <MenuLaderal />}
      {!hideSidebarAndTitle && <ContainerWithTitle />}
      {/* Aqui o Outlet renderiza a página atual */}
      <div >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
