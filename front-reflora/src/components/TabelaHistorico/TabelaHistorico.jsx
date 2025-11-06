import React from 'react'
import './TabelaHistorico.css'

/**
 * 
 * @param {object} props
 * @param {Array<object>} props.colunas - Array com definição das colunas
 * @param {Array<object>} props.dados - Array com os dados das linhas
 * @param {'entrada'|'saida'} props.variant - Para aplicar o estilo (verde.vermelho)
 */

function TabelaHistorico({ colunas, dados, variant = 'default' }) {
    return (
        <table className={`tabela-historico tabela-historico--${variant}`}>
            <thead>
                <tr>
                    {colunas.map((col) => (
                        <th key={col.chave}>
                            {col.titulo}
                            {col.sortable && <span className="icone-ordenar">⇅</span>}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {dados.map((linha, index) => (
                    <tr key={index}>
                        {colunas.map((col) => (
                            <td key={col.chave}>{linha[col.chave]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default TabelaHistorico
