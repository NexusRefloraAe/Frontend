import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import "./GerenciarCanteirosStylesLayout.css";

const GerenciarCanteirosLayout = () => {
  return (
    <div className="gerenciarcanteiro-container">
      <nav className="gerenciarcanteiro-nav">
        <NavLink
          to="/gerenciar-canteiros"
          end
          className={({ isActive }) => `gerenciarcanteiro-nav-btn ${isActive ? "active" : ""}`}
        >
          Cadastrar Canteiro
        </NavLink>

        <NavLink
          to="/gerenciar-canteiros/cadastrar-plantio"
          className={({ isActive }) => `gerenciarcanteiro-nav-btn ${isActive ? "active" : ""}`}
        >
          Cadastrar Plantio Canteiro
        </NavLink>

        <NavLink
          to="/gerenciar-canteiros/historico"
          className={({ isActive }) => `gerenciarcanteiro-nav-btn ${isActive ? "active" : ""}`}
        >
          Histórico Canteiros
        </NavLink>

        <NavLink
          to="/gerenciar-canteiros/inspecao"
          className={({ isActive }) => `gerenciarcanteiro-nav-btn ${isActive ? "active" : ""}`}
        >
          Inspeção de Mudas
        </NavLink>

        <NavLink
          to="/gerenciar-canteiros/distribuicao"
          className={({ isActive }) => `gerenciarcanteiro-nav-btn ${isActive ? "active" : ""}`}
        >
          Distribuição de Mudas
        </NavLink>

        <NavLink
          to="/gerenciar-canteiros/rastrear"
          className={({ isActive }) => `gerenciarcanteiro-nav-btn ${isActive ? "active" : ""}`}
        >
          Rastrear Muda
        </NavLink>

        <NavLink
          to="/gerenciar-canteiros/relatorio"
          className={({ isActive }) => `gerenciarcanteiro-nav-btn ${isActive ? "active" : ""}`}
        >
          Gerar Relatório
        </NavLink>
      </nav>

      <div className="gerenciarcanteiro-content">
        <Outlet />
      </div>
    </div>
  );
};

export default GerenciarCanteirosLayout;