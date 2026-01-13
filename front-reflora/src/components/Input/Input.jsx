import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import "react-datepicker/dist/react-datepicker.css";
import "./Input.css";
import CustomSelect from "../CustomSelect/CustomSelect";

registerLocale("pt-BR", ptBR);

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

  const handleDateChange = (date) => {
    if (onChange) {
      let formattedValue = "";
      if (date instanceof Date && !isNaN(date)) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        formattedValue = `${year}-${month}-${day}`;
      }
      onChange({
        target: {
          name: name,
          value: formattedValue,
        },
      });
    }
  };

  const getValidDate = (val) => {
    if (!val) return null;
    if (typeof val === "string" && val.includes("-")) {
      const [year, month, day] = val.split("-");
      return new Date(year, month - 1, day);
    }
    const date = new Date(val);
    return isNaN(date.getTime()) ? null : date;
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
            disabled={rest.disabled} // Garante que o input respeite o estado desabilitado
            className="input-field"
            {...rest}
          />
          <div className="stepper-controls">
            {/* Botões agora respeitam o estado desabilitado ou somente leitura */}
            <button 
              type="button" 
              onClick={onDecrement}
              disabled={rest.disabled || readOnly} 
            >
              -
            </button>
            <button 
              type="button" 
              onClick={onIncrement}
              disabled={rest.disabled || readOnly}
            >
              +
            </button>
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
            selected={getValidDate(value)}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            locale="pt-BR"
            placeholderText={placeholder || "dd/mm/aaaa"}
            className="input-field"
            id={name}
            name={name}
            disabled={readOnly || rest.disabled}
            autoComplete="off"
            required={required}
            showPopperArrow={false}
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
            disabled={rest.disabled}
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