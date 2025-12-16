import { useState } from "react"
import LinhaSemente from "./LinhaSemente"
import Paginacao from "../Paginacao/Paginacao"
import ModalDetalheSemente from "../ModalDetalheSemente/ModalDetalheSemente"
import ExportButton from "../ExportButton/ExportButton"
import search from '../../assets/search.svg'
import arrows from '../../assets/arrows-up-down.svg'
import { sementesService } from "../../services/sementesService"

function Listasementes({ 
    sementes, 
    paginaAtual, 
    totalPaginas, 
    onPageChange, 
    termoBusca, 
    onSearchChange,
    loading,
    onEditar, // Recebido do Banco.jsx
    onDeletar, // Recebido do Banco.jsx    
    ordemAtual,
    direcaoAtual,
    onOrdenar
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

    const handleDownloadPDFBackend = async () => {
        try {
            // 1. Chama o serviço
            const response = await sementesService.exportarRelatorioPdf(termoBusca);

            // 2. Extrai o nome do arquivo do Header
            const disposition = response.headers['content-disposition'];
            let fileName = 'relatorio_sementes.pdf'; // Nome padrão caso falhe

            if (disposition && disposition.includes('attachment')) {
                // Regex para pegar o texto dentro de filename="texto" ou filename=texto
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                
                if (matches != null && matches[1]) { 
                    // Remove aspas extras se existirem
                    fileName = matches[1].replace(/['"]/g, '');
                }
            }

            // 3. Cria o Blob e faz o download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName); // Usa o nome que veio do Java
            
            document.body.appendChild(link);
            link.click();
            
            // 4. Limpeza
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Erro ao baixar PDF:", error);
            alert("Erro ao gerar o relatório PDF.");
        }
    };

    // --- NOVA FUNÇÃO CSV ---
    const handleDownloadCSVBackend = async () => {
        try {
            // 1. Chama o serviço de CSV
            const response = await sementesService.exportarRelatorioCsv(termoBusca);

            // 2. Extrai nome do arquivo (Mesma lógica do PDF)
            const disposition = response.headers['content-disposition'];
            let fileName = 'relatorio_sementes.csv'; // Fallback

            if (disposition) {
                const filenameRegex = /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/i;
                const matches = filenameRegex.exec(disposition);
                if (matches && matches[1]) { 
                    fileName = matches[1].replace(/['"]/g, '');
                    fileName = decodeURIComponent(fileName); 
                }
            }

            // 3. Download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Erro ao baixar CSV:", error);
            alert("Erro ao gerar o relatório CSV.");
        }
    };

    const renderSeta = (campo) => {
        // Se a coluna não for a que está sendo ordenada atualmente, mostra a imagem padrão (neutra)
        if (ordemAtual !== campo) {
            return <img src={arrows} alt="Ordenar" style={{ opacity: 0.5, width: '12px', marginLeft: '5px' }} />;
        }

        return (
            <img 
                src={arrows} 
                alt="Ordenar" 
                style={{ 
                    width: '12px', 
                    marginLeft: '5px',
                    transform: direcaoAtual === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                }} 
            />
        );
    }

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
                                <th onClick={() => onOrdenar('lote')} style={{cursor: 'pointer'}}>
                                    Lote{renderSeta('lote')}
                                </th>
                                <th onClick={() => onOrdenar('dataDeCadastro')} style={{cursor: 'pointer'}}>
                                    Data Cadastro{renderSeta('dataDeCadastro')}
                                </th>
                                <th onClick={() => onOrdenar('nomePopular')} style={{cursor: 'pointer'}}>
                                    Nome popular{renderSeta('nomePopular')}
                                </th>
                                <th onClick={() => onOrdenar('quantidade')} style={{cursor: 'pointer'}}>
                                    Qtd Atual{renderSeta('quantidade')}
                                </th>
                                <th>Qtd Saída</th>
                                <th>Finalidade</th>
                          </tr>
                        </thead>
                        <tbody>
                            {sementes.map((semente, index) => (
                                <LinhaSemente 
                                    key={`${semente.id}-${index}`} 
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
                    <ExportButton 
                        data={sementes} 
                        columns={colunasparaExportar} 
                        fileName="sementes_exportadas" 
                        onExportPDF={handleDownloadPDFBackend}
                        onExportCSV={handleDownloadCSVBackend}
                    />
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