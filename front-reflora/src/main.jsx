import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';
// A importação que estava causando o erro, agora resolvida pela instalação:
import { BrowserRouter, Routes, Route } from "react-router-dom"; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rota principal, geralmente direciona para o Login */}
        <Route path="/" element={<Login />} /> 
        
        {/* Rota explícita para o Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rota explícita para o Cadastro */}
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);