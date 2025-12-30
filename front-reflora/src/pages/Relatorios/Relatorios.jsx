import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom'; // Importe useNavigate
import PainelCard from "../../components/PainelCard/PainelCard";
import './Relatorios.css';

function Relatorios() {
  const navigate = useNavigate(); // Hook para navegação

  const relatorios = [
    {
      id: "sementes",
      titulo: "Relatório",
      valor: "Movimentações de Sementes",
      icone: "📊",
      corFundo: "#f0f9ff",
      rota: "/gerenciamento-sementes/relatorio"
    },
    {
      id: "canteiros",
      titulo: "Relatório",
      valor: "Movimentações de Canteiros",
      icone: "🪴",
      corFundo: "#f0fdf4",
      rota: "/gerenciar-canteiros/relatorio"
    },
    {
      id: "vistorias",
      titulo: "Relatório",
      valor: "Movimentações de Vistorias",
      icone: "🔍",
      corFundo: "#fff7ed",
      rota: "/vistoria/relatorio-vistoria"  
    },
    {
      id: "insumos",
      titulo: "Relatório",
      valor: "Movimentações de Materiais",
      icone: "🛠️",
      corFundo: "#fef2f2",
      rota: "/insumo/relatorio-materiais"
    },
    {
      id: "distribuicao",
      titulo: "Relatório",
      valor: "Movimentações de Distribuição",
      icone: "🚚",
      corFundo: "#f5f3ff",
      // CORREÇÃO: Rota sincronizada com ContainerWithTitle
      rota: "/distribuicao-mudas/relatorio" 
    },
  ];

  return (
    <div className="relatorios-container auth-scroll-fix">
      <div className="relatorios-grid">
        {relatorios.map((relatorio, index) => (
          <div 
            key={index} 
            className="relatorio-card-wrapper"
            // Adicionado evento de clique para navegar
            onClick={() => navigate(relatorio.rota)}
          >
             <PainelCard
                titulo={relatorio.titulo}
                valor={relatorio.valor}
                icone={relatorio.icone}
                corFundo={relatorio.corFundo}
                rota={relatorio.rota}
                className="relatorio-card-item"
             />
          </div>
        ))}
      </div>

      <Outlet />
    </div>
  );
}

export default Relatorios;