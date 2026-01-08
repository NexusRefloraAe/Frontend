import React from 'react';
import { Outlet } from 'react-router-dom';
import PainelCard from "../../components/PainelCard/PainelCard";
import './Relatorios.css';

function Relatorios() {
  
  // Definindo cores vibrantes e pastéis para cada item
  const relatorios = [
    {
      id: "sementes",
      titulo: "Relatório",
      valor: "Movimentações de Sementes",
      icone: "📊",
      // Azul
      corFundo: "#dbeafe",
      corBorda: "#60a5fa",
      rota: "/gerenciamento-sementes/relatorio"
    },
    {
      id: "canteiros",
      titulo: "Relatório",
      valor: "Movimentações de Canteiros",
      icone: "🪴",
      // Verde
      corFundo: "#dcfce7",
      corBorda: "#4ade80",
      rota: "/gerenciar-canteiros/relatorio"
    },
    {
      id: "vistorias",
      titulo: "Relatório",
      valor: "Movimentações de Vistorias",
      icone: "🔍",
      // Laranja Suave
      corFundo: "#ffedd5",
      corBorda: "#fb923c",
      rota: "/vistoria/relatorio-vistoria"  
    },
    {
      id: "insumos",
      titulo: "Relatório",
      valor: "Movimentações de Insumos",
      icone: "🛠️",
      // Vermelho Suave
      corFundo: "#fee2e2",
      corBorda: "#f87171",
      rota: "/insumo/relatorio-materiais"
    },
    {
      id: "distribuicao",
      titulo: "Relatório",
      valor: "Movimentações de Distribuição de Mudas",
      icone: "🚚",
      // Roxo
      corFundo: "#f3e8ff",
      corBorda: "#c084fc",
      rota: "/distribuicao-mudas/relatorio" 
    },
  ];

  return (
    <div className="relatorios-container">
      <div className="relatorios-header">
         <h2 className="relatorios-titulo">Relatórios</h2>
      </div>

      <div className="relatorios-grid">
        {relatorios.map((relatorio, index) => (
          <div key={index} className="relatorio-card-wrapper">
             <PainelCard
                titulo={relatorio.titulo}
                valor={relatorio.valor}
                icone={relatorio.icone}
                corFundo={relatorio.corFundo}
                rota={relatorio.rota}
                // Passamos a borda dinâmica aqui, igual ao Painel
                style={{ border: `2px solid ${relatorio.corBorda}` }}
             />
          </div>
        ))}
      </div>

      <Outlet />
    </div>
  );
}

export default Relatorios;