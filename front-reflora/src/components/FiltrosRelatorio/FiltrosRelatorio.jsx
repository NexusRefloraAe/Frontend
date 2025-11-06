import React from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import './FiltrosRelatorio.css';

const FiltrosRelatorio = ({
  filtros,
  onFiltroChange,
  onPesquisar,
  isLoading = false,
  buttonText = 'Pesquisar'
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFiltroChange(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPesquisar();
  };

  return (
    <form className="filtros-relatorio" onSubmit={handleSubmit}>
      <div className="filtro-group">
        <label className="filtro-label">Nome Popular</label>
        <Input
          name="nomePopular"
          type="text"
          value={filtros.nomePopular || ''}
          onChange={handleChange}
          placeholder="Ipê-amarelo"
          className="filtro-input"
        />
      </div>

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