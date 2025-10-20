import React from 'react';
import './Input.css';

const Input = ({ 
  label, 
  type = 'text', 
  name, 
  placeholder, 
  value, 
  onChange, 
  required, 
  icon, 
  onIconClick,
  options, 
  readOnly = false
}) => {
  const isSelect = type === 'select';
  
  return (
    <div className="input-component-wrapper">
      {label && <label htmlFor={name}>{label}</label>}
      <div className="input-field-container">
        {isSelect ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="input-field"
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            className="input-field"
            style={{ paddingRight: icon ? '2.5rem' : 'var(--espacamento-sm)' }}
          />
        )}
 
        {icon && !isSelect && (
          <img
            src={icon}
            alt="Ícone do Input"
            className="input-icon"
            onClick={onIconClick}
          />
        )}
      </div>
    </div>
  );
};

export default Input;