import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import BancoSementes from "../pages/BancoSementes/BancoSementes";

import Login from "../pages/Login/Login";
import Cadastro from '../pages/Cadastro/Cadastro';
import RedefinirSenha from '../pages/RedefinirSenha/RedefinirSenha';

import Layout from "../components/MenuLateral/Layout";
import GerenciarSementesLayout from "../pages/GerenciarSementes/GerenciarSementesLayout";

import Configuracoes from '../pages/Configuracoes/Configuracoes';

{/* Telas do Gerenciar Sementes */}
import CadastrarPlantio from "../pages/GerenciarSementes/CadastrarPlantio/CadastrarPlantio";
import CadastrarTestes from "../pages/GerenciarSementes/CadastrarTestes/CadastrarTestes";
import HistoricoPlantio from "../pages/GerenciarSementes/HistoricoPlantio/HistoricoPlantio"
import HistoricoTestes from "../pages/GerenciarSementes/HistoricoTestes/HistoricoTestes"
import GerarRelatorio from "../pages/GerenciarSementes/GerarRelatorio/GerarRelatorio";

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

          <Route path="/configuracoes" element={<Configuracoes />} >
          
          
          
          </Route>

        </Route>
      </Routes>
    </Router >
  );
};

export default AppRoutes;
/*import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';




import { BrowserRouter, Routes, Route } from "react-router-dom"; 


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} /> 
        
        
        
        
      </Routes>
    </BrowserRouter>  
  </StrictMode>
);    */
