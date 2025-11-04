import React, { useState, useEffect } from 'react';
import './Filtro.css';

const Filtro = ({
  tipo = 'generico', // 'generico' ou 'data-lote'
  campos = [],
  dados = [],
  onFiltrar,
  placeholder = "Filtrar...",
  className = "",
  mostrarContador = true,
  textoContador = "resultados encontrados",
  loteOptions = [], // Para tipo 'data-lote'
  dataInicioDefault = '01/01/2025',
  dataFimDefault = '31/02/2025'
}) => {
  const [filtro, setFiltro] = useState('');
  const [filtroLote, setFiltroLote] = useState('');
  const [filtroDataInicio, setFiltroDataInicio] = useState(dataInicioDefault);
  const [filtroDataFim, setFiltroDataFim] = useState(dataFimDefault);

  const [resultados, setResultados] = useState(dados);

  // Aplica filtro genérico (texto)
  useEffect(() => {
    if (tipo === 'generico') {
      if (!filtro.trim()) {
        setResultados(dados);
        if (onFiltrar) onFiltrar(dados);
        return;
      }

      const termo = filtro.toLowerCase().trim();
      const dadosFiltrados = dados.filter(item =>
        campos.some(campo => {
          const valor = item[campo];
          if (valor === null || valor === undefined) return false;
          return String(valor).toLowerCase().includes(termo);
        })
      );

      setResultados(dadosFiltrados);
      if (onFiltrar) onFiltrar(dadosFiltrados);
    }
  }, [filtro, dados, campos, tipo, onFiltrar]);

  // Aplica filtro específico (lote + datas)
  useEffect(() => {
    if (tipo === 'data-lote') {
      let filtrados = [...dados];

      if (filtroLote) {
        filtrados = filtrados.filter(item => item.lote === filtroLote);
      }

      if (filtroDataInicio || filtroDataFim) {
        filtrados = filtrados.filter(item => {
          const dataItem = new Date(item.dataVistoria?.split('/').reverse().join('-'));
          const inicio = filtroDataInicio ? new Date(filtroDataInicio.split('/').reverse().join('-')) : null;
          const fim = filtroDataFim ? new Date(filtroDataFim.split('/').reverse().join('-')) : null;

          if (inicio && dataItem < inicio) return false;
          if (fim && dataItem > fim) return false;
          return true;
        });
      }

      setResultados(filtrados);
      if (onFiltrar) onFiltrar(filtrados);
    }
  }, [filtroLote, filtroDataInicio, filtroDataFim, dados, tipo, onFiltrar]);

  const handleLimparFiltro = () => {
    if (tipo === 'generico') {
      setFiltro('');
    } else {
      setFiltroLote('');
      setFiltroDataInicio(dataInicioDefault);
      setFiltroDataFim(dataFimDefault);
    }
  };

  const aplicarFiltros = () => {
    if (tipo === 'data-lote') {
      // Já está sendo aplicado via useEffect
    }
  };

  return (
    <div className={`filtro-container ${className}`}>
      {tipo === 'generico' && (
        <div className="filtro-input-group">
          <input
            type="text"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder={placeholder}
            className="filtro-input"
          />
          {filtro && (
            <button
              type="button"
              onClick={handleLimparFiltro}
              className="filtro-limpar-btn"
              aria-label="Limpar filtro"
            >
              ×
            </button>
          )}
        </div>
      )}

      {tipo === 'data-lote' && (
        <div className="filtro-data-lote">
          <div className="filtro-item">
            <label>Lote da Muda</label>
            <select value={filtroLote} onChange={(e) => setFiltroLote(e.target.value)}>
              <option value="">Todos</option>
              {loteOptions.map(lote => (
                <option key={lote} value={lote}>{lote}</option>
              ))}
            </select>
          </div>

          <div className="filtro-item">
            <label>Data início</label>
            <input
              type="text"
              placeholder="DD/MM/YYYY"
              value={filtroDataInicio}
              onChange={(e) => setFiltroDataInicio(e.target.value)}
            />
          </div>

          <div className="filtro-item">
            <label>Data fim</label>
            <input
              type="text"
              placeholder="DD/MM/YYYY"
              value={filtroDataFim}
              onChange={(e) => setFiltroDataFim(e.target.value)}
            />
          </div>

          <button
            className="filtro-pesquisar-btn"
            onClick={aplicarFiltros}
          >
            Pesquisar 🔍
          </button>
        </div>
      )}

      {mostrarContador && (
        <div className="filtro-contador">
          {resultados.length} {textoContador}
          {tipo === 'generico' && filtro && (
            <span className="filtro-termo">
              para: "{filtro}"
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Filtro;