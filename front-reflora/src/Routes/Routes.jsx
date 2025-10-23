import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import BancoSementes from "../pages/BancoSementes/BancoSementes";

import Login from "../pages/Login/Login";
import Cadastro from '../pages/Cadastro/Cadastro';
import RedefinirSenha from '../pages/RedefinirSenha/RedefinirSenha';

import Layout from "../components/MenuLateral/Layout";
import GerenciarSementesLayout from "../pages/GerenciarSementes/GerenciarSementesLayout";
import GerenciarCanteirosLayout from "../pages/GerenciarCanteiros/GerenciarCanteirosLayout";

import Configuracoes from '../pages/Configuracoes/Configuracoes';

{/* Telas do Gerenciar Sementes */}
import CadastrarPlantio from "../pages/GerenciarSementes/CadastrarPlantio/CadastrarPlantio";
import CadastrarTestes from "../pages/GerenciarSementes/CadastrarTestes/CadastrarTestes";
import HistoricoPlantio from "../pages/GerenciarSementes/HistoricoPlantio/HistoricoPlantio"
import HistoricoTestes from "../pages/GerenciarSementes/HistoricoTestes/HistoricoTestes"
import GerarRelatorio from "../pages/GerenciarSementes/GerarRelatorio/GerarRelatorio";

{/* Telas do Gerenciar Canteiros */}
import CadastrarCanteiro from "../pages/GerenciarCanteiros/CadastrarCanteiro/CadastrarCanteiro";
// import EditarCanteiro from "../pages/GerenciarCanteiros/EditarCanteiro/EditarCanteiro";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Rota de login — sem layout */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />

        {/* Rotas com layout */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/banco-sementes" element={<BancoSementes />} />

          {/* Rotas do Gerenciar Sementes */}
          <Route path="/gerenciar-sementes" element={<GerenciarSementesLayout />}>
            <Route index element={<CadastrarPlantio />} />
            <Route path="historico" element={<HistoricoPlantio />} />
            <Route path="cadastrar-teste" element={<CadastrarTestes />} />
            <Route path="historico-teste" element={<HistoricoTestes />} />
            <Route path="relatorio" element={<GerarRelatorio />} />
          </Route>

          {/* Rotas do Gerenciar Canteiros - CORRIGIDO */}
          <Route path="/gerenciar-canteiros" element={<GerenciarCanteirosLayout />}>
            <Route index element={<CadastrarCanteiro />} />
            <Route path="cadastrar-plantio" element={<div>Cadastrar Plantio Canteiro - Em Desenvolvimento</div>} />
            <Route path="historico" element={<div>Histórico Canteiros - Em Desenvolvimento</div>} />
            <Route path="inspecao" element={<div>Inspeção de Mudas - Em Desenvolvimento</div>} />
            <Route path="distribuicao" element={<div>Distribuição de Mudas - Em Desenvolvimento</div>} />
            <Route path="rastrear" element={<div>Rastrear Muda - Em Desenvolvimento</div>} />
            <Route path="relatorio" element={<div>Gerar Relatório - Em Desenvolvimento</div>} />
            {/* <Route path="editar/:id" element={<EditarCanteiro />} /> */}
          </Route>

          <Route path="/configuracoes" element={<Configuracoes />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;