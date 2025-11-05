import React from 'react';

const Relatorio = () => {
  return (
    <div className="relatorio-vistorias">
      <h2>Relatório de Vistorias</h2>
      
      <div className="relatorio-filtros">
        <div className="filtro-group">
          <label>Data Inicial:</label>
          <input type="date" />
        </div>
        <div className="filtro-group">
          <label>Data Final:</label>
          <input type="date" />
        </div>
        <div className="filtro-group">
          <label>Lote:</label>
          <select>
            <option value="">Todos</option>
            <option value="A001">A001</option>
            <option value="B002">B002</option>
          </select>
        </div>
        <button className="btn-gerar-relatorio">Gerar Relatório</button>
      </div>

      <div className="relatorio-resultados">
        <h3>Resumo das Vistorias</h3>
        <div className="resumo-cards">
          <div className="resumo-card">
            <h4>Total de Vistorias</h4>
            <span className="numero">15</span>
          </div>
          <div className="resumo-card">
            <h4>Estado Bom/Excelente</h4>
            <span className="numero">12</span>
          </div>
          <div className="resumo-card">
            <h4>Necessita Atenção</h4>
            <span className="numero">3</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relatorio;