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
  onIncrement, 
  onDecrement,
  // 1. Recebe todas as outras propriedades extras aqui (incluindo onBlur)
  ...rest 
}) => {
  
  const isSelect = type === 'select';
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
            // 2. Repassa as props extras (onBlur, disabled, etc.)
            {...rest} 
          />
          <div className="stepper-controls">
            <button type="button" onClick={onDecrement} disabled={rest.disabled}>-</button>
            <button type="button" onClick={onIncrement} disabled={rest.disabled}>+</button>
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
            // readOnly não funciona bem em select, usa-se disabled
            disabled={readOnly || rest.disabled} 
            className="input-field"
            // 2. Repassa as props extras
            {...rest}
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
            // 2. Repassa as props extras (AQUI QUE O onBlur VAI FUNCIONAR)
            {...rest}
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