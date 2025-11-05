import React from 'react';
import './Button.css';

const Button = ({ children, variant = 'primary', icon, type = 'button', onClick }) => {
  const buttonClass = `button button--${variant}`;

  return (
    <button type={type} className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;