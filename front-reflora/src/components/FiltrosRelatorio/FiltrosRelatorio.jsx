// FiltrosRelatorio.js (versão genérica)
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
  // Novas props opcionais para relatório de insumos
  mostrarTipoInsumo = false,
  tipoInsumo = 'Material',
  mostrarNomeInsumo = false
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
    <form className={`filtros-relatorio ${mostrarTipoInsumo ? 'com-tipo-insumo' : ''}`} onSubmit={handleSubmit}>
      {/* Seletor de Tipo de Insumo - apenas se mostrarTipoInsumo for true */}
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

      {/* Campo Nome do Insumo - apenas se mostrarNomeInsumo for true */}
      {mostrarNomeInsumo ? (
        <div className="filtro-group">
          <label className="filtro-label">Nome do Insumo</label>
          <Input
            name="nomeInsumo"
            type="text"
            value={filtros.nomeInsumo || ''}
            onChange={handleChange}
            placeholder="Digite o nome do insumo"
            className="filtro-input"
          />
        </div>
      ) : (
        /* Campo Nome Popular padrão - mantém compatibilidade */
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
      )}

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