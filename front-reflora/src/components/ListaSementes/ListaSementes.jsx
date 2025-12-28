import React, { useState } from "react";
import ModalDetalheSemente from "../ModalDetalheSemente/ModalDetalheSemente";
import { sementesService } from "../../services/sementesService";
import editIcon from '../../assets/edit.svg';
import deleteIcon from '../../assets/delete.svg';
import { FaExchangeAlt } from "react-icons/fa";

// Componentes
import TabelaComBuscaPaginacao from "../TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
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
    loading,
    onEditar, 
    onSolicitarExclusao,
    ordemAtual,
    direcaoAtual,
    onOrdenar
}) {

    const [sementeSelecionada, setSementeSelecionada] = useState(null);
    const [itensPorPagina, setItensPorPagina] = useState(10); 

    // --- 1. Colunas ---
    const colunas = [
        { key: 'lote', label: 'Lote', sortable: true },
        // Alterei a key para 'dataFormatada' que criaremos abaixo
        { key: 'dataDeCadastro', label: 'Data Cadastro', sortable: true }, 
        { key: 'nomeRenderizado', label: 'Nome Popular', sortable: true, sortKey:'nomePopular' }, 
        { key: 'quantidadeAtualFormatada', label: 'Qtd Atual', sortable: true, sortKey:'quantidade'},
        // Estes campos não existem na entidade bruta, mas vamos tratar para não quebrar
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

    // --- 2. Handlers ---
    const handleVerDetalhes = (semente) => setSementeSelecionada(semente);
    const handleFecharDetalhes = () => setSementeSelecionada(null);

    const handleDownloadPDFBackend = async () => {
        try {
            const response = await sementesService.exportarRelatorioPdf(termoBusca);
            
            // 1. Tenta pegar o nome do arquivo enviado pelo Back-end
            let fileName = 'relatorio_sementes.pdf'; // Nome padrão (fallback)
            
            const disposition = response.headers['content-disposition'];
            if (disposition) {
                // Regex para extrair o texto depois de filename=
                const filenameRegex = /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/i;
                const matches = filenameRegex.exec(disposition);
                if (matches && matches[1]) { 
                    fileName = matches[1].replace(/['"]/g, '');
                    fileName = decodeURIComponent(fileName); 
                }
            }

            // 2. Cria o link de download usando o fileName dinâmico
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            
            // AQUI ESTÁ A MUDANÇA: Usamos a variável fileName
            link.setAttribute('download', fileName); 
            
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            // Boa prática: liberar memória
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Erro PDF:", error);
            alert("Erro ao baixar PDF.");
        }
    };

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

    // --- FUNÇÃO AUXILIAR PARA FORMATAR DATA ---
    const formatarData = (data) => {
        if (!data) return '-';
        // Se vier como Array [2024, 10, 2] (Padrão Java LocalDate sem formatação)
        if (Array.isArray(data)) {
            const [ano, mes, dia] = data;
            return `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;
        }
        // Se vier como String "2024-10-02"
        if (typeof data === 'string' && data.includes('-')) {
            const [ano, mes, dia] = data.split('-');
            return `${dia}/${mes}/${ano}`;
        }
        return data;
    };

    // --- 3. Dados Formatados (Correção aqui) ---
    const dadosFormatados = (sementes || []).map((semente, index) => {
        
        // CORREÇÃO CRÍTICA:
        // O Back-end já manda 'quantidadeAtualFormatada' pronto (ex: "1500 G").
        // Só calculamos se ele NÃO vier (fallback).
        const qtdTexto = semente.quantidadeAtualFormatada 
            ? semente.quantidadeAtualFormatada
            : (semente.quantidade ? `${semente.quantidade} ${semente.unidadeDeMedida || ''}` : '0');

        return {
            ...semente,
            id: `${semente.id}-${index}`,
            // Data: O Back-end DTO já manda string "22/11/2025" às vezes. 
            // O formatarData cuida disso, mas se já vier pronto, mantemos.
            dataFormatada: formatarData(semente.dataDeCadastro),
            
            // Quantidade: Usamos a lógica corrigida acima
            quantidadeAtualFormatada: qtdTexto,
            
            // Saída e Finalidade: O Back-end DTO também já manda isso!
            // Se vier do back, usamos. Se não, usamos o padrão.
            quantidadeSaidaFormatada: semente.quantidadeSaidaFormatada || '-', 
            finalidadeAtual: semente.finalidadeAtual || 'Estoque',    

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
                    <button onClick={() => onSolicitarExclusao(semente)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} title="Excluir">
                        <img src={deleteIcon} alt="Excluir" style={{ width: '18px' }} />
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
        <div style={{ width: '100%' }}>
            <TabelaComBuscaPaginacao
                titulo="Lista de Sementes Cadastradas"

                onOrdenar={onOrdenar} 
                ordemAtual={ordemAtual}
                direcaoAtual={direcaoAtual}
                
                // Dados e Colunas
                dados={dadosFormatados}
                colunas={colunas}
                
                // Busca
                termoBusca={termoBusca}
                onPesquisar={onSearchChange}
                mostrarBusca={true}
                placeholderBusca="Pesquisar por lote ou nome"
                
                paginaAtual={null} 
                
                footerContent={
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', // Separa os itens nas pontas
                        width: '100%',
                        alignItems: 'center', 
                        marginTop: '15px',
                        flexWrap: 'wrap',
                        gap: '10px'
                    }}>
                        {/* Item 1: Vai para a Esquerda */}
                        <Paginacao 
                            paginaAtual={paginaAtual} 
                            totalPaginas={totalPaginas} 
                            onPaginaChange={onPageChange} 
                        />
                        
                        {/* Item 2: Vai para a Direita */}
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