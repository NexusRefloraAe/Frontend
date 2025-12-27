import React, { useRef } from "react";
import "./CustomDateStyle.css";

const CustomDate = ({
  name,
  value,
  onChange,
  placeholder = "Selecione a data",
  disabled = false
}) => {
  const inputRef = useRef(null);

  const openCalendar = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.showPicker?.(); // Chrome / Mobile
      inputRef.current.focus();
    }
  };

  return (
    <div className={`custom-date ${disabled ? "disabled" : ""}`}>
      <input
        ref={inputRef}
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="custom-date__native"
      />

      <div className="custom-date__display" onClick={openCalendar}>
        <span className={value ? "has-value" : "placeholder"}>
          {value
            ? new Date(value).toLocaleDateString("pt-BR")
            : placeholder}
        </span>

        <svg
          className="custom-date__icon"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </div>
    </div>
  );
};

export default CustomDate;
