import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PainelCard.css';

function PainelCard({ titulo, valor, icone, corFundo, rota, style, className = '' }) {
  const navigate = useNavigate();

  // Combina a cor de fundo interna com estilos extras (como a borda) vindos do pai
  const computedStyle = {
    backgroundColor: corFundo || '#fff',
    ...style // <--- IMPORTANTE: Isso permite que o Painel.jsx defina a borda
  };

  const handleClick = () => {
    if (rota) navigate(rota);
  };

  return (
    <div
      className={`card ${className} card-clickable`}
      style={computedStyle}
      onClick={handleClick}
    >
      <p className="card-titulo">{titulo}</p>
      
      <div className="card-conteudo-central">
        <h1 className="card-valor">{valor}</h1>
        
        <div className="card-icone">
          {typeof icone === 'string' && icone.includes('.') ? (
            <img src={icone} alt={titulo} />
          ) : (
            <span>{icone}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default PainelCard;