import { useState } from "react"
import LinhaSemente from "./LinhaSemente"
import Paginacao from "../Paginacao/Paginacao"
import ModalDetalheSemente from "../ModalDetalheSemente/ModalDetalheSemente"
import ExportButton from "../ExportButton/ExportButton"
import search from '../../assets/search.svg'
import arrows from '../../assets/arrows-up-down.svg'
import { sementesService } from "../../services/sementesService"

// Removemos a importação do CSS específico se ele não existir, 
// pois estamos usando o estilo global do BancoSementes.css

function Listasementes({ 
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
            const response = await sementesService.exportarRelatorioPdf(termoBusca);
            const disposition = response.headers['content-disposition'];
            let fileName = 'relatorio_sementes.pdf';

            if (disposition && disposition.includes('attachment')) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) { 
                    fileName = matches[1].replace(/['"]/g, '');
                }
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Erro ao baixar PDF:", error);
            alert("Erro ao gerar o relatório PDF.");
        }
    };

    const handleDownloadCSVBackend = async () => {
        try {
            const response = await sementesService.exportarRelatorioCsv(termoBusca);
            const disposition = response.headers['content-disposition'];
            let fileName = 'relatorio_sementes.csv';

            if (disposition) {
                const filenameRegex = /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/i;
                const matches = filenameRegex.exec(disposition);
                if (matches && matches[1]) { 
                    fileName = matches[1].replace(/['"]/g, '');
                    fileName = decodeURIComponent(fileName); 
                }
            }

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
        // Removemos a div wrapper desnecessária
        <>
            {/* MUDANÇA AQUI:
               Removemos a <section class="content-semente"> pois o Pai já controla o container.
               Usamos apenas uma div simples ou Fragment para agrupar.
            */}
            
            <div className="header-content-semente">
                <h1>Lista de Sementes Cadastradas</h1>
                <div className="input-search">
                    <input 
                        type="text" 
                        placeholder='Pesquisar por lote ou nome' 
                        value={termoBusca} 
                        onChange={(e) => onSearchChange(e.target.value)} 
                    />
                    <img src={search} alt="Buscar" />
                </div>
            </div>

            <div className="infos-sementes-card">
                {loading ? <p style={{padding:'20px', textAlign: 'center'}}>Carregando...</p> : (
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

            {sementeSelecionada && (
                <ModalDetalheSemente
                    sementeResumo={sementeSelecionada}
                    onClose={handleFecharDetalhes}
                    onEditar={onEditar}   
                    onDeletar={onDeletar} 
                />
            )}
        </>
    )
}

export default Listasementes;