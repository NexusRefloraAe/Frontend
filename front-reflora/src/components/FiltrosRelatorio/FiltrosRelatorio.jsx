import React from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import './FiltrosRelatorio.css';

const FiltrosRelatorio = ({
  filtros,
  onFiltroChange,
  onPesquisar,
  isLoading = false,
  buttonText = 'Pesquisar',

  // 🔹 continua existindo (insumos)
  mostrarTipoInsumo = false,
  tipoInsumo = 'Material',

  // 🔹 NOVO: configuração do campo de texto
  campoTexto = null,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFiltroChange(name, value);
  };

  const handleTipoInsumoChange = (tipo) => {
    onFiltroChange('tipoInsumo', tipo);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPesquisar();
  };

  return (
    <form
      className={`filtros-relatorio ${
        mostrarTipoInsumo ? 'com-tipo-insumo' : ''
      }`}
      onSubmit={handleSubmit}
    >
      {/* 🔹 Tipo de insumo */}
      {mostrarTipoInsumo && (
        <div className="filtro-group">
          <label className="filtro-label">Tipo de Insumo</label>
          <div className="tipo-insumo-buttons">
            <button
              type="button"
              className={tipoInsumo === 'Material' ? 'active' : ''}
              onClick={() => handleTipoInsumoChange('Material')}
            >
              Material
            </button>
            <button
              type="button"
              className={tipoInsumo === 'Ferramenta' ? 'active' : ''}
              onClick={() => handleTipoInsumoChange('Ferramenta')}
            >
              Ferramenta
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Campo de texto genérico */}
      {campoTexto && (
        <div className="filtro-group">
          <label className="filtro-label">{campoTexto.label}</label>
          <Input
            name={campoTexto.name}
            type="text"
            value={filtros[campoTexto.name] || ''}
            onChange={handleChange}
            placeholder={campoTexto.placeholder || ''}
            className="filtro-input"
          />
        </div>
      )}

      {/* 🔹 Data início */}
      <div className="filtro-group">
        <label className="filtro-label">Data início</label>
        <Input
          name="dataInicio"
          type="date"
          value={filtros.dataInicio || ''}
          onChange={handleChange}
          className="filtro-input"
        />
      </div>

      {/* 🔹 Data fim */}
      <div className="filtro-group">
        <label className="filtro-label">Data fim</label>
        <Input
          name="dataFim"
          type="date"
          value={filtros.dataFim || ''}
          onChange={handleChange}
          className="filtro-input"
        />
      </div>

      <div className="botoes-container">
        <Button
          variant="primary"
          type="submit"
          disabled={isLoading}
          className="btn-pesquisar"
        >
          {buttonText}
        </Button>
      </div>
    </form>
  );
};

export default FiltrosRelatorio;
