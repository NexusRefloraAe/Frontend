import React from 'react';
import './TabelaHistorico.css';

/**
 * TabelaHistorico - Componente genérico para exibir listas simples (ex: histórico).
 * * @param {Array} colunas - [{ key: 'nome', label: 'Nome', render: (item)=>... }]
 * @param {Array} dados - Lista de objetos de dados.
 * @param {string} variant - 'entrada' (verde), 'saida' (vermelho) ou 'default'.
 */
function TabelaHistorico({ colunas = [], dados = [], variant = 'default' }) {
    
    // Define a classe baseada na variante
    const variantClass = ['entrada', 'saida'].includes(variant) ? variant : 'default';

    return (
        <div className="tabela-historico-container">
            <table className={`tabela-historico tabela-historico--${variantClass}`}>
                <thead>
                    <tr>
                        {colunas.map((col, index) => (
                            <th key={col.key || index}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    {col.label || col.titulo}
                                    {col.sortable && <span className="icone-ordenar">⇅</span>}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {dados && dados.length > 0 ? (
                        dados.map((item, rowIndex) => (
                            <tr key={item.id || rowIndex}>
                                {colunas.map((col, colIndex) => (
                                    <td key={col.key || colIndex}>
                                        {/* Suporte a renderização customizada ou valor direto */}
                                        {col.render ? col.render(item) : (item[col.key] || item[col.chave] || '-')}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={colunas.length} style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                Nenhum registro encontrado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TabelaHistorico;