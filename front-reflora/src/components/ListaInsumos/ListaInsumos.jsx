import React from "react";
import TabelaComBuscaPaginacao from "../TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import editIcon from '../../assets/edit.svg'; // Ajuste o caminho dos ícones
import deleteIcon from '../../assets/delete.svg';

function ListaInsumos({ 
    insumos, 
    loading,
    onEditar, 
    onSolicitarExclusao,
    // Props de busca e paginação vindas do pai
    termoBusca,
    onSearchChange,
    // Se o backend não tiver paginação, você pode fazer paginação local ou ignorar
    paginaAtual,
    totalPaginas,
    onPageChange
}) {

    // Formatação dos dados para a tabela
    const dadosFormatados = insumos.map(item => {
        
        // Define cor do status de estoque
        const estoqueBaixo = item.quantidadeAtual <= item.estoqueMinimo;
        const corEstoque = item.quantidadeAtual === 0 ? 'red' : (estoqueBaixo ? '#e65100' : 'green'); // Vermelho, Laranja, Verde

        return {
            id: item.id,
            nomeInsumo: item.nome, // O backend retorna 'nome' na entidade Insumo
            tipo: item.tipoInsumo, // MATERIAL ou FERRAMENTA
            
            // Coluna de Quantidade com visualização visual
            quantidadeRenderizada: (
                <span style={{ fontWeight: 'bold', color: corEstoque }}>
                    {item.quantidadeAtual} {item.unidadeMedida?.toLowerCase() || 'und'}
                </span>
            ),

            // Coluna de Ações
            acoesRenderizadas: (
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button 
                        onClick={() => onEditar(item)} 
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} 
                        title="Editar Cadastro"
                    >
                        <img src={editIcon} alt="Editar" style={{ width: '18px' }} />
                    </button>
                    <button 
                        onClick={() => onSolicitarExclusao(item)} 
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} 
                        title="Excluir Cadastro e Histórico"
                    >
                        <img src={deleteIcon} alt="Excluir" style={{ width: '18px' }} />
                    </button>
                </div>
            )
        };
    });

    const colunas = [
        { key: 'nomeInsumo', label: 'Nome do Insumo' },
        { key: 'tipo', label: 'Tipo' },
        { key: 'quantidadeRenderizada', label: 'Estoque Atual' },
        { key: 'acoesRenderizadas', label: 'Ações' }
    ];

    return (
        <div style={{ width: '100%' }}>
            <TabelaComBuscaPaginacao
                titulo="Estoque de Insumos (Materiais e Ferramentas)"
                
                dados={dadosFormatados}
                colunas={colunas}
                
                // Busca
                termoBusca={termoBusca}
                onPesquisar={onSearchChange}
                mostrarBusca={true}
                placeholderBusca="Buscar por nome..."
                
                // Paginação (se houver)
                paginaAtual={paginaAtual}
                totalPaginas={totalPaginas}
                onPaginaChange={onPageChange}
                
                mostrarAcoes={false} // Já incluímos na coluna personalizada
            />
        </div>
    );
}

export default ListaInsumos;