import React, { useState, useRef, useEffect } from "react";
import "./CustomSelectStyle.css";

const CustomSelect = ({
  name,
  value,
  onChange,
  options = [],
  placeholder,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selected = options.find(opt => opt.value === value);

  // Fecha ao clicar fora
  useEffect(() => {
    const close = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleSelect = (option) => {
    onChange({
      target: {
        name,
        value: option.value,
      },
    });
    setOpen(false);
  };

  return (
    <div className="custom-select-wrapper" ref={wrapperRef}>
      <button
        type="button"
        className="custom-select-trigger"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <span className={`arrow ${open ? "open" : ""}`}>▾</span>
      </button>

      {open && (
        <ul className="custom-select-dropdown">
          {options.map(option => (
            <li
              key={option.value}
              className={option.value === value ? "selected" : ""}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
