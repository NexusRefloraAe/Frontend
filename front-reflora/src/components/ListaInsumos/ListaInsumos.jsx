import React from "react";
import jsPDF from 'jspdf';
// 1. IMPORTAÇÃO DIRETA (Fundamental para Vite)
import autoTable from 'jspdf-autotable';

import TabelaComBuscaPaginacao from "../TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import editIcon from '../../assets/edit.svg'; 
import deleteIcon from '../../assets/delete.svg';

function ListaInsumos({ 
    insumos, 
    listaCompletaExportacao, 
    onEditar, 
    onSolicitarExclusao,
    termoBusca,
    onSearchChange,
    paginaAtual,
    totalPaginas,
    onPageChange
}) {

    const dadosVisuais = insumos.map(item => {
        const estoqueBaixo = item.quantidadeAtual <= item.estoqueMinimo;
        const corEstoque = item.quantidadeAtual === 0 ? 'red' : (estoqueBaixo ? '#e65100' : 'green'); 

        return {
            id: item.id,
            nomeInsumo: item.nome, 
            tipo: item.tipoInsumo, 
            quantidadeRenderizada: (
                <span style={{ fontWeight: 'bold', color: corEstoque }}>
                    {item.quantidadeAtual} {item.unidadeMedida?.toLowerCase() || 'und'}
                </span>
            ),
            acoesRenderizadas: (
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button onClick={() => onEditar(item)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} title="Editar">
                        <img src={editIcon} alt="Editar" style={{ width: '18px' }} />
                    </button>
                    <button onClick={() => onSolicitarExclusao(item)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} title="Excluir">
                        <img src={deleteIcon} alt="Excluir" style={{ width: '18px' }} />
                    </button>
                </div>
            )
        };
    });

    const colunasVisuais = [
        { key: 'nomeInsumo', label: 'Nome do Insumo' },
        { key: 'tipo', label: 'Tipo' },
        { key: 'quantidadeRenderizada', label: 'Estoque Atual' },
        { key: 'acoesRenderizadas', label: 'Ações' }
    ];

    // --- FUNÇÕES DE EXPORTAÇÃO ---
    const getDadosLimpos = () => listaCompletaExportacao || insumos;

    const handleExportarPDF = () => {
        try {
            const doc = new jsPDF();
            const colunas = ["Nome", "Tipo", "Estoque"];
            const linhas = [];
            
            getDadosLimpos().forEach(item => {
                linhas.push([
                    item.nome,
                    item.tipoInsumo || item.tipo,
                    `${item.quantidadeAtual} ${item.unidadeMedida || ''}`
                ]);
            });

            doc.setFontSize(18);
            doc.setTextColor(46, 125, 50);
            doc.text("Relatório de Insumos", 14, 15);

            // 2. CORREÇÃO DE COMPATIBILIDADE:
            // Alguns sistemas carregam como 'autoTable', outros como 'autoTable.default'
            // Essa linha resolve o problema para ambos os casos.
            const gerarTabela = autoTable.default || autoTable;

            // 3. Chamamos a função passando o 'doc' como primeiro parâmetro
            gerarTabela(doc, {
                head: [colunas],
                body: linhas,
                startY: 20,
                headStyles: { fillColor: [46, 125, 50] },
                alternateRowStyles: { fillColor: [240, 253, 244] }
            });

            doc.save("estoque_insumos.pdf");
        } catch (error) {
            console.error("Erro PDF:", error);
            alert(`Erro ao gerar PDF: ${error.message}`);
        }
    };

    const handleExportarCSV = () => {
        try {
            const dados = getDadosLimpos();
            let csvContent = "Nome;Tipo;Estoque\n";

            dados.forEach(item => {
                const linha = [
                    `"${item.nome}"`, 
                    `"${item.tipoInsumo || item.tipo}"`,
                    `"${item.quantidadeAtual} ${item.unidadeMedida || ''}"`
                ];
                csvContent += linha.join(";") + "\n";
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "estoque_insumos.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Erro CSV:", error);
            alert("Erro ao gerar CSV.");
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <TabelaComBuscaPaginacao
                titulo="Estoque de Insumos (Materiais e Ferramentas)"
                dados={dadosVisuais}
                colunas={colunasVisuais}
                termoBusca={termoBusca}
                onPesquisar={onSearchChange}
                mostrarBusca={true}
                placeholderBusca="Buscar por nome..."
                paginaAtual={paginaAtual}
                totalPaginas={totalPaginas}
                onPageChange={onPageChange}
                mostrarAcoes={false} 
                onExportPDF={handleExportarPDF}
                onExportCSV={handleExportarCSV}
            />
        </div>
    );
}

export default ListaInsumos;