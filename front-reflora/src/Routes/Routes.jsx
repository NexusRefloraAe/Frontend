import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* === PÁGINAS PÚBLICAS === */
import Login from "../pages/Login/Login";
import Cadastro from '../pages/Cadastro/Cadastro';
import RedefinirSenha from '../pages/RedefinirSenha/RedefinirSenha';

/* === LAYOUTS E COMPONENTES === */
import Layout from "../components/MenuLateral/Layout";
import LayoutScroll from "../components/LayoutScroll/LayoutScroll";
// import Notificacoes from '../components/Notificacoes/Notificacoes';

/* === PÁGINAS DO SISTEMA === */
import Home from "../pages/Home/Home";
import BancoSementes from "../pages/BancoSementes/BancoSementes";
import Configuracoes from '../pages/Configuracoes/Configuracoes';

/* === GERENCIAMENTO === */
import GerenciarSementesLayout from "../pages/GerenciarSementes/GerenciarSementesLayout";
import GerarRelatorio from '../pages/GerenciarSementes/GerarRelatorio/GerarRelatorio';

import GerenciarCanteirosLayout from "../pages/GerenciarCanteiros/GerenciarCanteirosLayout";
import RelatorioCanteiro from "../pages/GerenciarCanteiros/RelatorioCanteiro/RelatorioCanteiro";

/* === DISTRIBUIÇÃO DE MUDAS (CORRIGIDO) === */
import DistribuicaoMudasLayout from "../pages/DistribuicaoMudas/DistribuicaoMudasLayout";
import TermoCompromisso from "../pages/DistribuicaoMudas/TermoCompromisso/TermoCompromisso";
import TermoCompromissoEmprestimo from "../pages/Insumo/CadastrarEmprestimo/TermoCompromisso/TermoCompromissoEmprestimo";

// AQUI ESTAVA O ERRO: Importando o componente correto que criamos
import RelatorioDistribuicao from "../pages/DistribuicaoMudas/RelatorioDistribuicao/RelatorioDistribuicao";

/* === VISTORIA E INSUMOS === */
import VistoriaLayout from "../pages/Vistoria/VistoriaLayout";
import RelatorioVistoria from '../pages/Vistoria/RelatorioVistoria/RelatorioVistoria';

import InsumoLayout from "../pages/Insumo/InsumoLayout";
import GerarRelatorioInsumo from '../pages/Insumo/GerarRelatorioInsumo/GerarRelatorioInsumo';

import Relatorios from "../pages/Relatorios/Relatorios";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />

        {/* Rotas Protegidas (Com Sidebar) */}
        <Route element={<Layout />}>

          <Route path="/home" element={<Home />} />
          <Route path="/banco-sementes" element={<BancoSementes />} />

          {/* Gerenciamento */}
          <Route path="/gerenciar-sementes" element={<GerenciarSementesLayout />} />
          <Route path="/gerenciar-canteiros" element={<GerenciarCanteirosLayout />} />

          {/* --- DISTRIBUIÇÃO DE MUDAS --- */}
          {/* Tela Principal (Abas: Revisão e Relatório) */}
          <Route path="/distribuicao-mudas" element={<DistribuicaoMudasLayout />} />



          {/* Tela do Termo (Para onde o botão 'Gerar Termo' envia) */}
          <Route path="/termo-compromisso" element={<TermoCompromisso />} />
          

          {/* Outros Módulos */}
          <Route path="/vistoria" element={<VistoriaLayout />} />
          <Route path="/insumo" element={<InsumoLayout />} />
          <Route path="/termo-compromisso-emprestimo" element={<TermoCompromissoEmprestimo />} />

          {/* Rotas com Scroll Layout (Relatórios Gerais) */}
          <Route element={<LayoutScroll />}>
            <Route path="/relatorios" element={<Relatorios />} />

            <Route path="/vistoria/relatorio-vistoria" element={<RelatorioVistoria />} />
            <Route path="/insumo/relatorio-materiais" element={<GerarRelatorioInsumo tipo="materiais" />} />
            <Route path="/gerenciamento-sementes/relatorio" element={<GerarRelatorio />} />
            <Route path="/gerenciar-canteiros/relatorio" element={<RelatorioCanteiro />} />
            {/* Rota Específica do Relatório (IMPORTANTE: O nome deve bater com ContainerWithTitle) */}
            <Route path="/distribuicao-mudas/relatorio" element={<RelatorioDistribuicao />} />
          </Route>

          <Route path="/configuracoes" element={<Configuracoes />} />
          {/* <Route path="/notificacoes" element={<Notificacoes />} /> */}
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;