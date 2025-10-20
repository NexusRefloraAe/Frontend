import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "../screens/Home/home";
import BancoSementes from "../screens/BancoSementes/BancoSementes";
import Login from "../screens/Login/Login";

import Layout from "../components/MenuLateral/Layout";
import GerenciarSementesLayout from "../screens/GerenciarSementes/GerenciarSementesLayout";

{/* Telas do Gerenciar Sementes */}
import CadastrarPlantio from "../screens/GerenciarSementes/CadastrarPlantio/CadastrarPlantio";
import CadastrarTestes from "../screens/GerenciarSementes/CadastrarTestes/CadastrarTestes";
import HistoricoPlantio from "../screens/GerenciarSementes/HistoricoPlantio/HistoricoPlantio"
import HistoricoTestes from "../screens/GerenciarSementes/HistoricoTestes/HistoricoTestes"
import GerarRelatorio from "../screens/GerenciarSementes/GerarRelatorio/GerarRelatorio";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Rota de login — sem layout */}
        <Route path="/login" element={<Login />} />

        {/* Rotas com layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/banco-sementes" element={<BancoSementes />} />


          {/* Rotas com layout */}
          <Route path="/gerenciar-sementes" element={<GerenciarSementesLayout />}>
            {/* Conteúdo padrão quando acessa /gerenciar-sementes */}
            <Route index element={<CadastrarPlantio />} />

            {/* Outras telas com conteúdo próprio */}
            <Route path="historico" element={<HistoricoPlantio />} />
            <Route path="cadastrar-teste" element={<CadastrarTestes />} />
            <Route path="historico-teste" element={<HistoricoTestes />} />
            <Route path="relatorio" element={<GerarRelatorio />} />
          </Route>

        </Route>
      </Routes>
    </Router >
  );
};

export default AppRoutes;
