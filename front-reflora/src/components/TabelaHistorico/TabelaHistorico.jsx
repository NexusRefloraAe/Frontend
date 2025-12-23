import React from 'react';
import PropTypes from 'prop-types'; // Opcional: Boa prática para documentar props
import './TabelaHistorico.css';

/**
 * Componente de tabela estilizado para exibir históricos de movimentação.
 * * @param {object} props
 * @param {Array<{titulo: string, chave: string, sortable?: boolean}>} props.colunas - Definição das colunas.
 * @param {Array<object>} props.dados - Os dados a serem exibidos nas linhas.
 * @param {'entrada'|'saida'|'default'} [props.variant='default'] - Variante de estilo para o cabeçalho (verde ou vermelho).
 */
function TabelaHistorico({ colunas, dados, variant = 'default' }) {
    
    // Garante que a variante seja uma das classes esperadas ou usa default
    const variantClass = ['entrada', 'saida'].includes(variant) ? variant : 'default';

    return (
        /* NOTA: Se esta tabela for usada em telas pequenas, envolva-a 
           em uma div com overflow-x: auto no componente pai, como fizemos 
           com a TabelaResponsiva anteriormente.
        */
        <table className={`tabela-historico tabela-historico--${variantClass}`}>
            <thead>
                <tr>
                    {colunas.map((col, index) => (
                        // Usando index como fallback para key se 'chave' não for única ou existir
                        <th key={col.chave || index} scope="col">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>{col.titulo}</span>
                                {/* Usei um span para o ícone, ajuste se for usar imagem */}
                                {col.sortable && <span className="icone-ordenar" title="Ordenar">⇅</span>}
                            </div>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {dados && dados.length > 0 ? (
                    dados.map((linha, rowIndex) => (
                        <tr key={linha.id || rowIndex}> {/* Tente usar um ID único da linha se tiver */}
                            {colunas.map((col, colIndex) => (
                                <td key={col.chave || colIndex}>
                                    {linha[col.chave] !== undefined && linha[col.chave] !== null ? linha[col.chave] : '-'}
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    // Exibe uma mensagem bonita se não houver dados
                    <tr>
                        <td colSpan={colunas.length} style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                            Nenhum registro encontrado.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

// Validação de Props (Opcional, mas recomendado)
TabelaHistorico.propTypes = {
    colunas: PropTypes.arrayOf(PropTypes.shape({
        titulo: PropTypes.string.isRequired,
        chave: PropTypes.string.isRequired,
        sortable: PropTypes.boolean
    })).isRequired,
    dados: PropTypes.array,
    variant: PropTypes.oneOf(['entrada', 'saida', 'default'])
};

export default TabelaHistorico;