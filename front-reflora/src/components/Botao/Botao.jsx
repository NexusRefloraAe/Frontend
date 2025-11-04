import React from 'react';
import './Botao.css';

const Botao = ({ variant = 'primary', children, onClick, disabled = false, className = "" }) => {
  return (
    <button
      className={`botao botao-${variant} ${disabled ? 'desativado' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Botao;