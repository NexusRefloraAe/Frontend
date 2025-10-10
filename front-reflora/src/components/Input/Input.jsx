import React from 'react';
import './Input.css';

const Input = ({ label, type = 'text', name, placeholder, value, onChange }) => {
  return (
    <div className="input-group">
      <label htmlFor={name} className="input-label">{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input-field"
      />
    </div>
  );
};

export default Input;