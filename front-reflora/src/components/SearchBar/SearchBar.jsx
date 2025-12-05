import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

const SearchBar = ({
  value = "",
  onChange,
  onSearch,
  placeholder = "Pesquisar...",
  modo = "auto",
  isLoading = false, // ✅ exibe loading opcional
}) => {
  const [localValue, setLocalValue] = useState(value);

  const handleInputChange = (e) => {
    const novoValor = e.target.value;
    setLocalValue(novoValor);

    if (modo === "auto" && onChange) {
      onChange(novoValor);
    }
  };

  const handleSearchClick = () => {
    if (modo === "manual" && onSearch) {
      onSearch(localValue);
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder}
        value={modo === "auto" ? value : localValue}
        onChange={handleInputChange}
      />
      <button
        onClick={handleSearchClick}
        className="botao-buscar"
        disabled={modo === "auto"}
      >
        {isLoading ? <span className="loader"></span> : <FaSearch />}
      </button>
    </div>
  );
};

export default SearchBar;
