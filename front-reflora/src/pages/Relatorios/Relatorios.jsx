import React from 'react';
import { useNavigate } from 'react-router-dom';
import PainelCard from "../../components/PainelCard/PainelCard";
import './Relatorios.css';

function Relatorios() {
  const navigate = useNavigate();

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

  const handleCardClick = (rota) => {
    navigate(rota);
  };

  return (
    <div className="relatorios-container">
      <h1 className="relatorios-titulo">Relatórios</h1>
      
      <div className="relatorios-grid">
        {relatorios.map((relatorio, index) => (
          <div 
            key={index}
            onClick={() => handleCardClick(relatorio.rota)}
            className="card-clickable"
          >
            <PainelCard
              titulo={relatorio.titulo}
              valor={relatorio.valor}
              icone={relatorio.icone}
              corFundo={relatorio.corFundo}
              className="relatorio-card"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Relatorios;