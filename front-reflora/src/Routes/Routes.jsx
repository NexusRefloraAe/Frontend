import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../screens/Home/home";
import BancoSementes from "../screens/BancoSementes/BancoSementes";
import Login from "../screens/Login/Login";
import Layout from "../components/MenuLateral/Layout";

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
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
