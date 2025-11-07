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
import RelatorioCanteiro from "../pages/GerenciarCanteiros/RelatorioCanteiro/RelatorioCanteiro";
import Configuracoes from '../pages/Configuracoes/Configuracoes';
import Notificacoes from '../components/Notificacoes/Notificacoes';

import DistribuicaoMudasLayout from "../pages/DistribuicaoMudas/DistribuicaoMudasLayout";
import TermoCompromisso from "../pages/DistribuicaoMudas/TermoCompromisso/TermoCompromisso";

import VistoriaLayout from "../pages/Vistoria/VistoriaLayout";
import InsumoLayout from "../pages/Insumo/InsumoLayout";

import Relatorios from "../pages/Relatorios/Relatorios";

import RelatorioVistoria from '../pages/Vistoria/RelatorioVistoria/RelatorioVistoria';
import GerarRelatorio from '../pages/GerenciarSementes/GerarRelatorio/GerarRelatorio';
import GerarRelatorioInsumo from '../pages/Insumo/GerarRelatorioInsumo/GerarRelatorioInsumo';

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

          <Route path="/gerenciar-sementes" element={<GerenciarSementesLayout />} />

          <Route path="/gerenciar-canteiros" element={<GerenciarCanteirosLayout />} />

          <Route path="/gerenciar-canteiros/relatorio" element={<RelatorioCanteiro />} />


          <Route path="/distribuicao-mudas" element={<DistribuicaoMudasLayout />} />
          <Route path="/termo-compromisso" element={<TermoCompromisso />} />

          <Route path="/vistoria" element={<VistoriaLayout />} />
          <Route path="/insumo" element={<InsumoLayout />} />

          <Route path="/relatorios" element={<Relatorios />} />

          <Route path="/vistoria/relatorio-vistoria" element={<RelatorioVistoria />} />
          <Route path="/insumo/relatorio-materiais" element={<GerarRelatorioInsumo tipo="materiais" />} />
          <Route path="/gerenciamento-sementes/relatorio" element={<GerarRelatorio />} />

          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/notificacoes" element={<Notificacoes />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;