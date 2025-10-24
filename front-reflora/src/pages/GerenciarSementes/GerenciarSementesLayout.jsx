import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import "./GerenciarSementesStylerLayout.css";

const GerenciarSementesLayout = () => {
  return (
    <div className="seed-page">
      <nav className="seed-nav">

        <NavLink
          to="/gerenciar-sementes"
          end
          className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}
        >
          Cadastrar Plantio
        </NavLink>

        <NavLink
          to="/gerenciar-sementes/historico"
          className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}
        >
          Histórico Plantio
        </NavLink>

        <NavLink
          to="/gerenciar-sementes/cadastrar-teste"
          className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}
        >
          Cadastrar Teste
        </NavLink>

        <NavLink
          to="/gerenciar-sementes/historico-teste"
          className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}
        >
          Histórico Testes
        </NavLink>

        <NavLink
          to="/gerenciar-sementes/relatorio"
          className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}
        >
          Gerar Relatório
        </NavLink>

      </nav>
      

      <div className="seed-content">
        <Outlet />
      </div>
    </div>
  );
};

export default GerenciarSementesLayout;
