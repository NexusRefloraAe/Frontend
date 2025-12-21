import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import './PainelCard.css';

function PainelCard({ titulo, valor, icone, corFundo, rota, className = '' }) {
  const navigate = useNavigate();

  const cardStyle = corFundo ? { backgroundColor: corFundo } : {};

  const handleClick = () => {
    if (rota) navigate(rota);
  };

  return (
    <div className="painel-card-container">
      {/* Card clicável */}
      <div
        className={`card ${className} card-clickable`}
        style={cardStyle}
        onClick={handleClick}
      >
        <p className="card-titulo">{titulo}</p>
        <h1 className="card-valor">{valor}</h1>
        <div className="card-icone">
          {typeof icone === 'string' && icone.includes('.') ? (
            <img src={icone} alt={titulo} />
          ) : (
            <span>{icone}</span>
          )}
        </div>
      </div>

      {/* Container do conteúdo da rota */}
      <div className="painel-card-content">
        <Outlet /> {/* Aqui vai renderizar o conteúdo da rota */}
      </div>
    </div>
  );
}

export default PainelCard;
