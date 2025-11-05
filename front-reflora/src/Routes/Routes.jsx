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

import DistribuicaoMudasLayout from "../pages/DistribuicaoMudas/DistribuicaoMudasLayout";
import TermoCompromisso from "../pages/DistribuicaoMudas/TermoCompromisso/TermoCompromisso";

import VistoriaLayout from "../pages/Vistoria/VistoriaLayout";
import InsumoLayout from "../pages/Insumo/InsumoLayout";

// Telas do Gerenciar Sementes (mantidas, pois usam <Outlet />)
import CadastrarPlantio from "../pages/GerenciarSementes/CadastrarPlantio/CadastrarPlantio";
import CadastrarTestes from "../pages/GerenciarSementes/CadastrarTestes/CadastrarTestes";
import HistoricoPlantio from "../pages/GerenciarSementes/HistoricoPlantio/HistoricoPlantio";
import HistoricoTestes from "../pages/GerenciarSementes/HistoricoTestes/HistoricoTestes";
import GerarRelatorio from "../pages/GerenciarSementes/GerarRelatorio/GerarRelatorio";


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />

        {/* Rotas protegidas com Layout */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/banco-sementes" element={<BancoSementes />} />

          {/* Gerenciar Sementes ... */}
          <Route path="/gerenciar-sementes" element={<GerenciarSementesLayout />}/>

          {/* Gerenciar Canteiros  */}
          <Route path="/gerenciar-canteiros" element={<GerenciarCanteirosLayout />} />
          <Route path="/distribuicao-mudas" element={<DistribuicaoMudasLayout />} />
          <Route path="/termo-compromisso" element={<TermoCompromisso />} />

          {/* Vistoria */}
          <Route path="/vistoria" element={<VistoriaLayout />} />
          <Route path="/insumo" element={<InsumoLayout />} />

          <Route path="/configuracoes" element={<Configuracoes />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;