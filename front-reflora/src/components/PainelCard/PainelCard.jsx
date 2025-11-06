import React from 'react';
import './PainelCard.css'; // Mantenha o CSS existente

function PainelCard({ titulo, valor, icone, corFundo, className = '' }) {
  const cardStyle = corFundo ? { backgroundColor: corFundo } : {};
  
  return (
    <div className={`card ${className}`} style={cardStyle}>
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
  );
}

export default PainelCard;