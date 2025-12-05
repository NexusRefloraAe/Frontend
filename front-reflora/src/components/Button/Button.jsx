import React from 'react';
import './Button.css';

const Button = ({ children, variant = 'primary', icon, type = 'button', onClick }) => {
  const buttonClass = `button button--${variant}`;

  return (
    <button type={type} className={buttonClass} onClick={onClick}>
      {icon && <span className="button-icon">{icon}</span>}
      <span className="button-label">{children}</span>
    </button>
  );
};

export default Button;
