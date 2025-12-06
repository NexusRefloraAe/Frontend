import { useState } from "react"
import LinhaSemente from "./LinhaSemente"
import Paginacao from "../Paginacao/Paginacao"
import ModalDetalheSemente from "../ModalDetalheSemente/ModalDetalheSemente"
import ExportButton from "../ExportButton/ExportButton"
import search from '../../assets/search.svg'
import arrows from '../../assets/arrows-up-down.svg'

function Listasementes({ 
    sementes, 
    paginaAtual, 
    totalPaginas, 
    onPageChange, 
    termoBusca, 
    onSearchChange,
    loading,
    onEditar, // Recebido do Banco.jsx
    onDeletar // Recebido do Banco.jsx
}) {

    const [sementeSelecionada, setSementeSelecionada] = useState(null);

    const colunasparaExportar = [
        { label: 'Lote', key: 'lote' },
        { label: 'Data Cadastro', key: 'dataDeCadastro' },
        { label: 'Nome Popular', key: 'nomePopular' },
        { label: 'Qtd Atual', key: 'quantidadeAtualFormatada' },
        { label: 'Qtd Saída', key: 'quantidadeSaidaFormatada' },
        { label: 'Finalidade', key: 'finalidadeAtual' },
    ];

    const handleVerDetalhes = (semente) => {
        setSementeSelecionada(semente);
    };

    const handleFecharDetalhes = () => {
        setSementeSelecionada(null);
    };

    return (
        <div>
            <section className="content-semente">
                <div className="header-content-semente">
                    <h1>Lista de Sementes Cadastradas</h1>
                    <div className="input-search">
                        <input 
                            type="text" 
                            placeholder='Pesquisar por lote ou nome' 
                            value={termoBusca} 
                            onChange={(e) => onSearchChange(e.target.value)} 
                        />
                        <img src={search} alt="" />
                    </div>
                </div>
                <div className="infos-sementes-card">
                    {loading ? <p style={{padding:'20px'}}>Carregando...</p> : (
                    <table>
                        <thead>
                            <tr>
                                <th>Lote<img src={arrows} alt="Ordenar" /></th>
                                <th>Data Cadastro<img src={arrows} alt="Ordenar" /></th>
                                <th>Nome popular<img src={arrows} alt="Ordenar" /></th>
                                <th>Qtd Atual<img src={arrows} alt="Ordenar" /></th>
                                <th>Qtd Saída</th>
                                <th>Finalidade</th>
                          </tr>
                        </thead>
                        <tbody>
                            {sementes.map((semente) => (
                                <LinhaSemente 
                                    key={semente.id} 
                                    semente={semente} 
                                    onVerDetalhes={handleVerDetalhes}
                                    // Repassamos as funções para a linha também (para os botões da tabela)
                                    onEditar={onEditar}
                                    onDeletar={onDeletar}
                                />
                            ))}
                        </tbody>
                    </table>
                    )}
                </div>
                <div className="footer-content">
                    <Paginacao 
                        paginaAtual={paginaAtual} 
                        totalPaginas={totalPaginas} 
                        onPaginaChange={onPageChange} 
                    />
                    <ExportButton data={sementes} columns={colunasparaExportar} fileName="sementes_exportadas" />
                </div>
            </section>

            {/* --- O MODAL É CHAMADO AQUI --- */}
            {sementeSelecionada && (
                <ModalDetalheSemente
                    sementeResumo={sementeSelecionada}
                    onClose={handleFecharDetalhes}
                    
                    // CORREÇÃO CRÍTICA: Repassando as funções do Pai para o Modal
                    onEditar={onEditar}   
                    onDeletar={onDeletar} 
                />
            )}
        </div>
    )
}

export default Listasementes;