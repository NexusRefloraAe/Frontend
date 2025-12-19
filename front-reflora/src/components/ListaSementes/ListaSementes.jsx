import React, { useState } from "react"
import ModalDetalheSemente from "../ModalDetalheSemente/ModalDetalheSemente"
import { sementesService } from "../../services/sementesService"
import editIcon from '../../assets/edit.svg'
import deleteIcon from '../../assets/delete.svg'

// Componentes
import TabelaComBuscaPaginacao from "../TabelaComBuscaPaginacao/TabelaComBuscaPaginacao"
import Paginacao from "../Paginacao/Paginacao" // <--- Importante: Vamos usar este componente

function ListaSementes({ 
    sementes, 
    paginaAtual, 
    totalPaginas, 
    onPageChange, 
    termoBusca, 
    onSearchChange,
    loading,
    onEditar, 
    onDeletar, 
    ordemAtual,
    direcaoAtual,
    onOrdenar
}) {

    const [sementeSelecionada, setSementeSelecionada] = useState(null);
    const [itensPorPagina, setItensPorPagina] = useState(10); 

    // --- 1. Colunas ---
    const colunas = [
        { key: 'lote', label: 'Lote', sortable: true },
        { key: 'dataDeCadastro', label: 'Data Cadastro', sortable: true },
        { key: 'nomeRenderizado', label: 'Nome Popular', sortable: true }, 
        { key: 'quantidadeAtualFormatada', label: 'Qtd Atual', sortable: true },
        { key: 'quantidadeSaidaFormatada', label: 'Qtd Saída', sortable: false },
        { key: 'finalidadeAtual', label: 'Finalidade', sortable: false },
        { key: 'acoesRenderizadas', label: 'Ações', sortable: false } 
    ];

    // --- 2. Handlers ---
    const handleVerDetalhes = (semente) => setSementeSelecionada(semente);
    const handleFecharDetalhes = () => setSementeSelecionada(null);

    const handleDownloadPDFBackend = async () => {
        try {
            const response = await sementesService.exportarRelatorioPdf(termoBusca);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'relatorio_sementes.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Erro PDF:", error);
            alert("Erro ao baixar PDF.");
        }
    };

    // --- 3. Dados Formatados ---
    const dadosFormatados = sementes.map(semente => ({
        ...semente,
        nomeRenderizado: (
            <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); handleVerDetalhes(semente); }}
                style={{ fontWeight: 'bold', color: '#2e7d32', textDecoration: 'none' }}
            >
                {semente.nomePopular}
            </a>
        ),
        acoesRenderizadas: (
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => onEditar(semente)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} title="Editar">
                    <img src={editIcon} alt="Editar" style={{ width: '18px' }} />
                </button>
                <button onClick={() => onDeletar(semente.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} title="Excluir">
                    <img src={deleteIcon} alt="Excluir" style={{ width: '18px' }} />
                </button>
            </div>
        )
    }));

    return (
        <div style={{ width: '100%' }}>
            
            <TabelaComBuscaPaginacao
                titulo="Lista de Sementes Cadastradas"
                
                // Dados e Colunas
                dados={dadosFormatados}
                colunas={colunas}
                
                // Busca
                termoBusca={termoBusca}
                onBuscaChange={onSearchChange}
                mostrarBusca={true}
                placeholderBusca="Pesquisar por lote ou nome"
                
                // IMPORTANTE: Passamos null aqui para desligar a paginação interna do componente
                // pois vamos injetar a nossa paginação manual no footerContent
                paginaAtual={null} 
                
                // Rodapé Customizado: Exportar (Esq) + Paginação (Dir)
                footerContent={
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginTop: '15px',
                        flexWrap: 'wrap',
                        gap: '10px'
                    }}>
                        {/* Lado Esquerdo: Exportar */}
                        <div>
                            <button 
                                className="btn-exportar"
                                style={{
                                    backgroundColor: '#2e7d32',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    fontSize: '14px'
                                }}
                                onClick={handleDownloadPDFBackend}
                            >
                                Exportar 
                                <span style={{fontSize: '12px'}}>🔗</span>
                            </button>
                        </div>

                        {/* Lado Direito: Nossa Paginação Manual */}
                        <div>
                            <Paginacao 
                                paginaAtual={paginaAtual} 
                                totalPaginas={totalPaginas} 
                                onPaginaChange={onPageChange} 
                            />
                        </div>
                    </div>
                }
            />

            {sementeSelecionada && (
                <ModalDetalheSemente
                    sementeResumo={sementeSelecionada}
                    onClose={handleFecharDetalhes}
                    onEditar={onEditar}   
                    onDeletar={onDeletar} 
                />
            )}
        </div>
    );
}

export default ListaSementes;