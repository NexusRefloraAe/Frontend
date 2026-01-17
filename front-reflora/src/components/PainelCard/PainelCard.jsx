import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PainelCard.css';

function PainelCard({ titulo, valor, icone, corFundo, rota, style, className = '' }) {
  const navigate = useNavigate();

  // Combina a cor de fundo interna com estilos extras (como a borda) vindos do pai
  const computedStyle = {
    backgroundColor: corFundo || '#fff',
    ...style 
  };

  const handleClick = () => {
    if (rota) navigate(rota);
  };

  // Função auxiliar para renderizar o ícone de forma segura
  const renderIcone = () => {
    if (!icone) return null; // Se não tiver ícone, não renderiza nada

    // Se for string (caminho do import ou Base64), usa tag <img>
    if (typeof icone === 'string') {
      return <img src={icone} alt={titulo} className="card-icon-img" />;
    }

    // Se for um objeto/componente (ex: <FaIcon />), renderiza direto
    return icone;
  };

  return (
    <div
      className={`card ${className} ${rota ? 'card-clickable' : ''}`} // Adiciona classe clickable só se tiver rota
      style={computedStyle}
      onClick={handleClick}
    >
      <p className="card-titulo">{titulo}</p>
      
      <div className="card-conteudo-central">
        <h1 className="card-valor">{valor}</h1>
        
        <div className="card-icone">
          {renderIcone()}
        </div>
      </div>
    </div>
  );
}

export default PainelCard;