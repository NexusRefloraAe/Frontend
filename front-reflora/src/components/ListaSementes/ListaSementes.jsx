import React, { useState } from "react";
import ModalDetalheSemente from "../ModalDetalheSemente/ModalDetalheSemente";
import { sementesService } from "../../services/sementesService";
import editIcon from '../../assets/edit.svg';
import deleteIcon from '../../assets/delete.svg';
import { FaExchangeAlt } from "react-icons/fa";

// --- ATENÇÃO: Importe o novo componente aqui ---
import TabelaResponsiva from "../TabelaResponsiva/TabelaResponsiva"; // Ajuste o caminho conforme criou

import Paginacao from "../Paginacao/Paginacao";
import ExportButton from "../ExportButton/ExportButton";

function ListaSementes({ 
    sementes,
    onIniciarCorrecao,
    paginaAtual, 
    totalPaginas, 
    onPageChange, 
    termoBusca, 
    onSearchChange,
    onEditar, 
    onSolicitarExclusao,
    ordemAtual,
    direcaoAtual,
    onOrdenar
}) {

    const [sementeSelecionada, setSementeSelecionada] = useState(null);

    // Definição das colunas para a TabelaResponsiva
    const colunas = [
        { key: 'lote', label: 'Lote', sortable: true },
        { key: 'dataFormatada', label: 'Data Cadastro', sortable: true, sortKey: 'dataDeCadastro' }, 
        { key: 'nomeRenderizado', label: 'Nome Popular', sortable: true, sortKey: 'nomePopular' }, 
        { key: 'quantidadeAtualFormatada', label: 'Qtd Atual', sortable: true, sortKey: 'quantidade' },
        { key: 'quantidadeSaidaFormatada', label: 'Qtd Saída', sortable: false },
        { key: 'finalidadeAtual', label: 'Finalidade', sortable: false },
        { key: 'acoesRenderizadas', label: 'Ações', sortable: false } 
    ];

    const colunasparaExportar = [
        { label: 'Lote', key: 'lote' },
        { label: 'Data Cadastro', key: 'dataDeCadastro' },
        { label: 'Nome Popular', key: 'nomePopular' },
        { label: 'Qtd Atual', key: 'quantidadeAtualFormatada' },
        { label: 'Qtd Saída', key: 'quantidadeSaidaFormatada' },
        { label: 'Finalidade', key: 'finalidadeAtual' },
    ];

    // Handlers de Detalhes e Exportação (Mantidos iguais ao seu código original...)
    const handleVerDetalhes = (semente) => setSementeSelecionada(semente);
    const handleFecharDetalhes = () => setSementeSelecionada(null);

    const handleDownloadPDFBackend = async () => {
        try {
            const response = await sementesService.exportarRelatorioPdf(termoBusca);
            let fileName = 'relatorio_sementes.pdf';
            const disposition = response.headers['content-disposition'];
            if (disposition) {
                const filenameRegex = /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/i;
                const matches = filenameRegex.exec(disposition);
                if (matches && matches[1]) { 
                    fileName = decodeURIComponent(matches[1].replace(/['"]/g, '')); 
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
            console.error("Erro PDF:", error);
            alert("Erro ao baixar PDF.");
        }
    };

    const handleDownloadCSVBackend = async () => {
        try {
            const response = await sementesService.exportarRelatorioCsv(termoBusca);
            let fileName = 'relatorio_sementes.csv';
            const disposition = response.headers['content-disposition'];
            if (disposition) {
                const filenameRegex = /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/i;
                const matches = filenameRegex.exec(disposition);
                if (matches && matches[1]) { 
                    fileName = decodeURIComponent(matches[1].replace(/['"]/g, '')); 
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
            console.error("Erro CSV:", error);
            alert("Erro ao baixar CSV.");
        }
    };

    const formatarData = (data) => {
        if (!data) return '-';
        if (Array.isArray(data)) {
            const [ano, mes, dia] = data;
            return `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;
        }
        if (typeof data === 'string' && data.includes('-')) {
            const [ano, mes, dia] = data.split('-');
            return `${dia}/${mes}/${ano}`;
        }
        return data;
    };

    // --- PREPARAÇÃO DOS DADOS (Crucial para o componente renderizar certo) ---
    const dadosFormatados = (sementes || []).map((semente, index) => {
        const qtdTexto = semente.quantidadeAtualFormatada 
            ? semente.quantidadeAtualFormatada
            : (semente.quantidade ? `${semente.quantidade} ${semente.unidadeDeMedida || ''}` : '0');

        return {
            ...semente,
            id: semente.id || `idx-${index}`,
            // Chaves devem bater com "colunas" acima
            lote: semente.lote,
            dataFormatada: formatarData(semente.dataDeCadastro),
            quantidadeAtualFormatada: qtdTexto,
            quantidadeSaidaFormatada: semente.quantidadeSaidaFormatada || '-', 
            finalidadeAtual: semente.finalidadeAtual || 'Estoque',    
            
            // JSX para renderização direta
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
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <button onClick={() => onEditar(semente)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} title="Editar">
                        <img src={editIcon} alt="Editar" style={{ width: '20px', height: '20px' }} />
                    </button>
                    <button onClick={() => onSolicitarExclusao(semente)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} title="Excluir">
                        <img src={deleteIcon} alt="Excluir" style={{ width: '20px', height: '20px' }} />
                    </button>
                    {semente.idUltimoMovimentacao && (
                        <button 
                            onClick={() => onIniciarCorrecao(semente)} 
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                            title={`Mudar de ${semente.finalidadeAtual} para ${semente.finalidadeAtual === 'Plantio' ? 'Teste' : 'Plantio'}`}
                        >
                            <FaExchangeAlt color="#fb8c00" size={18} /> 
                        </button>
                    )}
                </div>
            )
        };
    });

    return (
        <div style={{ width: '100%', paddingBottom: '20px' }}>
            
            {/* NOVO COMPONENTE SUBSTITUINDO O ANTIGO */}
            <TabelaResponsiva
                titulo="Lista de Sementes Cadastradas"
                
                // Props de Dados
                colunas={colunas}
                dados={dadosFormatados}
                
                // Props de Ordenação
                onOrdenar={onOrdenar}
                ordemAtual={ordemAtual}
                direcaoAtual={direcaoAtual}

                // Props de Busca
                termoBusca={termoBusca}
                onPesquisar={onSearchChange}
                placeholderBusca="Pesquisar por lote ou nome..."

                // Footer customizado (Paginação + Exportar)
                footerContent={
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        width: '100%',
                        flexWrap: 'wrap',
                        gap: '15px'
                    }}>
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
                }
            />

            {sementeSelecionada && (
                <ModalDetalheSemente
                    sementeResumo={sementeSelecionada}
                    onClose={handleFecharDetalhes}
                    onEditar={onEditar}   
                    onSolicitarExclusao={onSolicitarExclusao} 
                />
            )}
        </div>
    );
}

export default ListaSementes;