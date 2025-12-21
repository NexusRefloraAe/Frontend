import React from 'react';
import { Outlet } from 'react-router-dom';
import PainelCard from "../../components/PainelCard/PainelCard";
import './Relatorios.css';

function Relatorios() {
  const relatorios = [
    {
      id: "sementes",
      titulo: "Movimentações das Sementes",
      valor: "Relatório",
      icone: "📊",
      corFundo: "#f0f9ff",
      rota: "/gerenciamento-sementes/relatorio"
    },
    {
      id: "canteiros",
      titulo: "Movimentações dos Canteiros",
      valor: "Relatório",
      icone: "🪴",
      corFundo: "#f0fdf4",
      rota: "/gerenciar-canteiros/relatorio"
    },
    {
      id: "vistorias",
      titulo: "Movimentações das Vistorias",
      valor: "Relatório",
      icone: "🔍",
      corFundo: "#fff7ed",
      rota: "/vistoria/relatorio-vistoria"  
    },
    {
      id: "insumos",
      titulo: "Movimentações dos Materiais e Ferramentas",
      valor: "Relatório",
      icone: "🛠️",
      corFundo: "#fef2f2",
      rota: "/insumo/relatorio-materiais"
    },
  ];

  return (
    <div className="relatorios-container">
      <div className="relatorios-grid">
        {relatorios.map((relatorio, index) => (
          <PainelCard
            key={index}
            titulo={relatorio.titulo}
            valor={relatorio.valor}
            icone={relatorio.icone}
            corFundo={relatorio.corFundo}
            rota={relatorio.rota} // Navegação
          />
        ))}
      </div>

      {/* Outlet permite renderizar subrotas dentro dessa página */}
      <Outlet />
    </div>
  );
}

export default Relatorios;
