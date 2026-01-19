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
  // Dentro do seu PainelCard.jsx
  const renderIcone = () => {
    if (!icone) return null;

    // Se for um emoji (como nos Relatórios), renderiza como texto
    // Verificamos se NÃO é uma imagem base64 ou caminho de arquivo
    if (typeof icone === 'string' && !icone.startsWith('data:image') && icone.length < 5) {
      return <span className="icone-emoji">{icone}</span>;
    }

    // Se for um caminho de imagem ou Base64 (como no Painel), usa <img>
    return <img src={icone} alt={titulo} className="card-icon-img" />;
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