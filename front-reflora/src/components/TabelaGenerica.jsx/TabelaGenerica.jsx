// src/components/TabelaGenerica/TabelaGenerica.js
import React, { useState, useMemo } from 'react';
import './TabelaGenerica.css';

const TabelaGenerica = ({
  colunas,
  dados,
  acoes = [],
  sortConfig = { key: null, direction: 'none' },
  onSort = () => {},
  isLoading = false,
  emptyMessage = "Nenhum resultado encontrado."
}) => {
  const [sortKey, setSortKey] = useState(sortConfig.key);
  const [sortDirection, setSortDirection] = useState(sortConfig.direction);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortKey === key && sortDirection === 'ascending') {
      direction = 'descending';
    } else if (sortKey === key && sortDirection === 'descending') {
      direction = 'none';
    }
    setSortKey(direction === 'none' ? null : key);
    setSortDirection(direction);
    onSort({ key: direction === 'none' ? null : key, direction });
  };

  const getSortIcon = (key) => {
    if (sortKey !== key) return ' ⇅';
    if (sortDirection === 'ascending') return ' ↑';
    if (sortDirection === 'descending') return ' ↓';
    return ' ⇅';
  };

  const dadosOrdenados = useMemo(() => {
    if (!sortKey) return dados;
    let sorted = [...dados];
    sorted.sort((a, b) => {
      if (a[sortKey] < b[sortKey]) {
        return sortDirection === 'ascending' ? -1 : 1;
      }
      if (a[sortKey] > b[sortKey]) {
        return sortDirection === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [dados, sortKey, sortDirection]);

  return (
    <div className="tabela-wrapper">
      <table className="tabela-generica">
        <thead>
          <tr>
            {colunas.map(coluna => (
              <th
                key={coluna.chave}
                onClick={() => coluna.sortable !== false && handleSort(coluna.chave)}
                className={coluna.sortable !== false ? 'sortable' : ''}
              >
                {coluna.nome} {coluna.sortable !== false && getSortIcon(coluna.chave)}
              </th>
            ))}
            {acoes.length > 0 && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td colSpan={colunas.length + (acoes.length > 0 ? 1 : 0)}>Carregando...</td></tr>
          ) : dadosOrdenados.length > 0 ? (
            dadosOrdenados.map((item, index) => (
              <tr key={item.id || index}>
                {colunas.map(coluna => (
                  <td key={coluna.chave}>
                    {coluna.render ? coluna.render(item) : item[coluna.chave]}
                  </td>
                ))}
                {acoes.length > 0 && (
                  <td className="coluna-acoes">
                    {acoes.map((acao, i) => (
                      <button
                        key={i}
                        className="acao-btn"
                        onClick={() => acao.onClick(item)}
                        title={acao.titulo}
                      >
                        {acao.icone}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr><td colSpan={colunas.length + (acoes.length > 0 ? 1 : 0)}>{emptyMessage}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TabelaGenerica;