import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from "./Routes/Routes"


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes  />
  </StrictMode>,
)
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';
import RedefinirSenha from './pages/RedefinirSenha/RedefinirSenha';
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Configuracoes from './pages/Configuracoes/Configuracoes';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Routes>
    </BrowserRouter>  
  </StrictMode>
);
