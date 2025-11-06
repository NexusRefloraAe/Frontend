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
  readOnly = false,
  onIncrement, // <-- Prop nova
  onDecrement, // <-- Prop nova
}) => {
  
  const isSelect = type === 'select';
  // Verifica se deve renderizar o campo de quantidade (stepper)
  const isStepper = type === 'number' && onIncrement && onDecrement;

  return (
    <div className="input-component-wrapper">
      {label && <label htmlFor={name}>{label}</label>}

      {isStepper ? (
        <div className="input-stepper-layout">
          <input
            type="number"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            readOnly={readOnly}
            className="input-field"
          />
          <div className="stepper-controls">
            <button type="button" onClick={onDecrement}>-</button>
            <button type="button" onClick={onIncrement}>+</button>
          </div>
        </div>

      ) : isSelect ? (
        <div className="input-field-container">
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            readOnly={readOnly}
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
        </div>

      ) : (
        <div className="input-field-container">
          <input
            type={type}
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            readOnly={readOnly}
            className="input-field"
            style={{ paddingRight: icon ? '2.5rem' : 'var(--espacamento-sm)' }}
          />
          {icon && (
            <img
              src={icon}
              alt="Ícone do Input"
              className="input-icon"
              onClick={onIconClick}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Input;