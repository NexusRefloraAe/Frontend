import React from 'react';
import './TabelaResponsiva.css'; 
import { FaSearch, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const TabelaResponsiva = ({
  titulo,
  colunas,       
  dados,         
  termoBusca,    
  onPesquisar,   
  placeholderBusca = "Pesquisar...",
  footerContent, 
  onOrdenar,     
  ordemAtual,    
  direcaoAtual   
}) => {

  const renderSortIcon = (coluna) => {
    if (!coluna.sortable) return null;
    if (ordemAtual !== coluna.sortKey && ordemAtual !== coluna.key) {
        return <FaSort style={{marginLeft: 5, opacity: 0.3}} size={10} />;
    }
    return direcaoAtual === 'asc' 
      ? <FaSortUp style={{marginLeft: 5}} size={10} /> 
      : <FaSortDown style={{marginLeft: 5}} size={10} />;
  };

  return (
    <div className="tabela-container">
      
      {/* 1. TOPO */}
      <div className="tabela-top-bar">
        {titulo && <h2 className="tabela-titulo">{titulo}</h2>}
        
        {onPesquisar && (
          <div className="tabela-busca-wrapper">
            <FaSearch color="#888" size={14} />
            <input
              type="text"
              className="tabela-busca-input"
              placeholder={placeholderBusca}
              value={termoBusca || ''}
              onChange={(e) => onPesquisar(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* 2. ÁREA DE SCROLL */}
      <div className="tabela-scroll-area">
        <table className="tabela-table">
          <thead>
            <tr>
              {colunas.map((col, idx) => (
                <th 
                  key={idx} 
                  onClick={() => col.sortable && onOrdenar && onOrdenar(col.sortKey || col.key)}
                  style={{ cursor: col.sortable ? 'pointer' : 'default', width: col.width }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: col.align || 'flex-start' }}>
                    {col.label}
                    {renderSortIcon(col)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {dados && dados.length > 0 ? (
              dados.map((item, rowIdx) => (
                <tr key={item.id || rowIdx}>
                  {colunas.map((col, colIdx) => (
                    <td key={`${rowIdx}-${colIdx}`} style={{ textAlign: col.align || 'left' }}>
                      {/* AQUI ESTÁ A MUDANÇA: Se tiver render, usa ele. Se não, texto normal */}
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={colunas.length} style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. RODAPÉ */}
      {footerContent && (
        <div className="tabela-footer">
          {footerContent}
        </div>
      )}

    </div>
  );
};

export default TabelaResponsiva;