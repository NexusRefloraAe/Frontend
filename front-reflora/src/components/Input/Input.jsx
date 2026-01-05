import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import ptBR from 'date-fns/locale/pt-BR'; // Importa idioma português
import "react-datepicker/dist/react-datepicker.css"; // Estilos padrão
import "./Input.css";
import CustomSelect from "../CustomSelect/CustomSelect";

// Registra o idioma
registerLocale('pt-BR', ptBR);

const Input = ({
  label,
  type = "text",
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
  ...rest
}) => {
  const isSelect = type === "select";
  const isStepper = type === "number" && onIncrement && onDecrement;
  const isDate = type === "date";

  // Função para converter o evento do DatePicker para o padrão do HTML
  // Isso garante que seus formulários (AuthForm/FormGeral) continuem funcionando sem alterações
  const handleDateChange = (date) => {
    if (onChange) {
      onChange({
        target: {
          name: name,
          value: date // Retorna o objeto Date ou null
        }
      });
    }
  };

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
            {...rest}
          />
          <div className="stepper-controls">
            <button type="button" onClick={onDecrement}>-</button>
            <button type="button" onClick={onIncrement}>+</button>
          </div>
        </div>

      ) : isSelect ? (
        <CustomSelect
          name={name}
          value={value}
          onChange={onChange}
          options={options}
          placeholder={placeholder}
          disabled={readOnly || rest.disabled}
        />

      ) : isDate ? (
        <div className="input-field-container date-picker-container">
           <DatePicker
              selected={value ? new Date(value) : null} // Converte string para Date se necessário
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              locale="pt-BR"
              placeholderText={placeholder || "dd/mm/aaaa"}
              className="input-field" // Reusa sua classe CSS existente
              id={name}
              name={name}
              disabled={readOnly || rest.disabled}
              autoComplete="off"
              required={required}
              showPopperArrow={false} // Remove a setinha do balão
              {...rest}
           />
           
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
            {...rest}
          />
          {icon && (
            <img
              src={icon}
              alt="Ícone"
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