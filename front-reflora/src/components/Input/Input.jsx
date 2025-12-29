import React from "react";
import "./Input.css";
import CustomSelect from "../CustomSelect/CustomSelect";
import CustomDate from "../CustomDate/CustomDate";

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
        <CustomDate
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={readOnly || rest.disabled}
        />

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
