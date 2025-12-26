import React, { useState, useEffect, useCallback } from "react";
import TabelaSelecionar from "../../../components/TabelaSelecionar/TabelaSelecionar";
import ModalDetalheGenerico from "../../../components/ModalDetalheGenerico/ModalDetalheGenerico";
import EditarPlantioCanteiro from "../EditarPlantioCanteiro/EditarPlantioCanteiro";

import { canteiroService } from "../../../services/canteiroService";
import { plantioCanteiroService } from "../../../services/plantioCanteiroService";
import { getBackendErrorMessage } from "../../../utils/errorHandler";

const Historico = () => {

    // --- ESTADOS DE DADOS ---
    const [canteiros, setCanteiros] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    // --- ESTADOS DE CONTROLE DE UI ---
    const [modalDetalheAberto, setModalDetalheAberto] = useState(false);
    const [canteiroSelecionado, setCanteiroSelecionado] = useState(null); 
    const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);

    // --- ESTADOS PARA O HISTÓRICO DETALHADO ---
    const [historicoEntradas, setHistoricoEntradas] = useState([]);
    const [historicoSaidas, setHistoricoSaidas] = useState([]);

    // --- ESTADOS DE PAGINAÇÃO E BUSCA ---
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [termoBusca, setTermoBusca] = useState('');
    const itensPorPagina = 10; 

    // --- ESTADOS DE ORDENAÇÃO ---
    const [ordem, setOrdem] = useState('nomeCanteiro'); // Ajustado para o padrão do seu DTO
    const [direcao, setDirecao] = useState('asc');

    // --- BUSCAR DADOS DO BACKEND ---
    const fetchCanteiros = useCallback(async () => {
        setLoading(true);
        try {
            const data = await canteiroService.getAll(
                termoBusca, 
                paginaAtual - 1, 
                itensPorPagina, 
                ordem, 
                direcao
            );

            // --- CORREÇÃO DO MAPEAMENTO ---
            const dadosFormatados = data.content.map(c => ({
                id: c.id,
                // Mapeia exatamente os campos que vieram no seu Postman
                NomeCanteiro: c.nomeCanteiro, 
                NomePopular: c.nomePopularSemente,
                Quantidade: c.quantidadePlantada,
                
                // Mantém o resto dos dados originais (caso precise na edição)
                ...c 
            }));

            setCanteiros(dadosFormatados);
            const total = data.totalPages || 1;
            setTotalPaginas(total);
            setErro('');

        } catch (error) {
            console.error("Erro ao buscar canteiros:", error);
            const msg = getBackendErrorMessage(error);
            setErro(msg);
        } finally {
            setLoading(false);
        }
    }, [termoBusca, paginaAtual, ordem, direcao]);

    useEffect(() => {
        fetchCanteiros();
    }, [fetchCanteiros]);

    // --- MANIPULADORES ---
    const handleBusca = (novoTermo) => {
        setTermoBusca(novoTermo);
        setPaginaAtual(1);
    };

    const handleTrocaPagina = (novaPagina) => {
        setPaginaAtual(novaPagina);
    };

    const handleOrdenar = (chaveColuna) => {
        // Mapeia o nome da coluna visual para o campo no Java (DTO)
        let campoBackend = 'nomeCanteiro'; 

        switch(chaveColuna) {
            case 'NomeCanteiro': campoBackend = 'nomeCanteiro'; break; 
            case 'NomePopular': campoBackend = 'nomePopularSemente'; break; // Campo do DTO
            case 'Quantidade': campoBackend = 'quantidadePlantada'; break;
            default: campoBackend = 'nomeCanteiro';
        }

        if (campoBackend === ordem) {
            setDirecao(direcao === 'asc' ? 'desc' : 'asc');
        } else {
            setOrdem(campoBackend);
            setDirecao('asc');
        }
        setPaginaAtual(1);
    };

    // --- AÇÕES DO MODAL ---

    const handleDetalheCanteiro = async (canteiro) => {
        try {
            // 1. Busca Detalhes Básicos
            const detalhes = await canteiroService.getById(canteiro.id);
            setCanteiroSelecionado(detalhes);

            // 2. Busca Histórico Detalhado
            const historico = await canteiroService.getHistoricoDetalhado(canteiro.id);
            
            const mapHistorico = (lista) => lista.map(item => ({
                nomePopular: item.nomePopularMuda,
                data: item.data,
                quantidade: item.quantidade
            }));

            if (historico && historico.entradas) {
                setHistoricoEntradas(mapHistorico(historico.entradas.content));
            }
            if (historico && historico.saidas) {
                setHistoricoSaidas(mapHistorico(historico.saidas.content));
            }

            setModalDetalheAberto(true);
        } catch (error) {
            console.error(error);
            alert("Erro ao carregar detalhes do canteiro.");
        }
    };

    const handleFecharModalDetalhe = () => {
        setModalDetalheAberto(false);
        setCanteiroSelecionado(null);
        setHistoricoEntradas([]);
        setHistoricoSaidas([]);
    };

    const handleEditarCanteiro = (canteiro) => {
        // Prepara objeto seguro para edição, evitando undefined
        const itemSafe = {
            ...canteiro,
            // Prioriza os campos que vieram no JSON do Postman
            nome: canteiro.nomeCanteiro || canteiro.nome || "",
            quantidade: canteiro.quantidadePlantada || canteiro.quantidade || 0,
            especie: canteiro.nomePopularSemente || canteiro.especies || ""
        };
        setCanteiroSelecionado(itemSafe);
        setModalDetalheAberto(false);
        setModalEdicaoAberto(true);
    };

    const handleSalvarEdicao = async (dadosParaAtualizar) => {
        setLoading(true);
        try {
            // Agora chamamos o service de PLANTIO (Lote)
            // dadosParaAtualizar já vem do formulário com: { id, quantidade, dataPlantio }
            await plantioCanteiroService.update(dadosParaAtualizar.id, {
                quantidade: dadosParaAtualizar.quantidade,
                data: dadosParaAtualizar.dataPlantio // O service formatará para dd/MM/yyyy
            });

            alert("Lote atualizado com sucesso!");
            
            // Fecha o modal e limpa estados
            setModalEdicaoAberto(false);
            setCanteiroSelecionado(null);
            
            // Recarrega a tabela principal (para atualizar a soma total de mudas do canteiro)
            fetchCanteiros(); 
        } catch (error) {
            console.error(error);
            alert(getBackendErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleCancelarEdicao = () => {
        setModalEdicaoAberto(false);
        setCanteiroSelecionado(null);
    };

    const handleExcluirCanteiro = async (itemParaExcluir) => {
        // Se itemParaExcluir for null (pode acontecer dependendo de quem chama), tenta pegar do selecionado
        const canteiro = itemParaExcluir || canteiroSelecionado;

        if (!canteiro || !canteiro.id) {
            alert("Erro: Não foi possível identificar o canteiro para exclusão.");
            return;
        }

        try {
            await canteiroService.delete(canteiro.id);
            alert("Canteiro excluído com sucesso!");
            fetchCanteiros(); 
            handleFecharModalDetalhe();
        } catch (error) {
            // Usa seu utilitário de erro
            const msg = getBackendErrorMessage(error);
            alert(`Erro ao excluir: ${msg}`);
        }
    };

    const handleExportarCanteiro = (c) => alert("Exportar: " + (c.nomeCanteiro || c.nome));
    const handleSelecionarItens = () => {}; 
    const handleQuantidadeChange = () => {};

    // --- DEFINIÇÃO DAS COLUNAS (Chaves batem com o Map do fetch) ---
    const colunas = [
        { key: "NomeCanteiro", label: "Nome dos Canteiros" },
        { key: "NomePopular", label: "Nome Popular" },
        { key: "Quantidade", label: "Quantidade" },
    ];

    const downloadArquivo = (blob, nomeArquivo) => {
        const disposition = blob.headers['content-disposition'];
        let fileName = nomeArquivo;

        if (disposition) {
            const filenameRegex = /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/i;
            const matches = filenameRegex.exec(disposition);
            if (matches && matches[1]) { 
                fileName = matches[1].replace(/['"]/g, '');
                fileName = decodeURIComponent(fileName); 
            }
        }

        const url = window.URL.createObjectURL(new Blob([blob.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName); // Nome que aparecerá para o usuário
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    // --- HANDLERS DE EXPORTAÇÃO ---
    const handleExportarPdf = async (item) => {
        try {
            setLoading(true);
            const blob = await canteiroService.exportarHistoricoPdf(item.id);
            // Gera nome: Historico_NomeDoCanteiro.pdf
            const nomeArquivo = `Historico_${item.nomeCanteiro || item.nome || 'Canteiro'}.pdf`;
            downloadArquivo(blob, nomeArquivo);
        } catch (error) {
            console.error("Erro ao baixar PDF:", error);
            alert("Erro ao exportar PDF.");
        } finally {
            setLoading(false);
        }
    };

    const handleExportarCsv = async (item) => {
        try {
            setLoading(true);
            const blob = await canteiroService.exportarHistoricoCsv(item.id);
            const nomeArquivo = `Historico_${item.nomeCanteiro || item.nome || 'Canteiro'}.csv`;
            downloadArquivo(blob, nomeArquivo);
        } catch (error) {
            console.error("Erro ao baixar CSV:", error);
            alert("Erro ao exportar CSV.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="historico-page-container">
            <div className="historico-content-wrapper">
                {erro && <p style={{color: 'red'}}>{erro}</p>}
                
                <TabelaSelecionar
                    titulo="Histórico de Canteiro"
                    dados={canteiros}
                    colunas={colunas}
                    loading={loading}
                    
                    itensPorPagina={itensPorPagina}
                    paginaAtual={paginaAtual}
                    totalPaginas={totalPaginas}
                    onPageChange={handleTrocaPagina}
                    
                    termoBusca={termoBusca}
                    onSearchChange={handleBusca}
                    habilitarBusca={true}

                    ordemAtual={ordem}
                    direcaoAtual={direcao}
                    onOrdenar={handleOrdenar}

                    onDetalheCanteiro={handleDetalheCanteiro}
                    onSelecionar={handleSelecionarItens}
                    onQuantidadeChange={handleQuantidadeChange}
                    chaveBusca="NomePopular"
                />
            </div>

            {/* MODAL DE DETALHES */}
            {modalDetalheAberto && canteiroSelecionado && (
                <ModalDetalheGenerico
                    isOpen={modalDetalheAberto} 
                    item={canteiroSelecionado}
                    camposDetalhes={[
                        // Aqui você ajusta conforme o retorno do getById (CanteiroDetailsDTO)
                        { label: 'Nome:', chave: 'nome' }, 
                        { label: 'Data de cadastro:', chave: 'dataCriacao' },
                        { label: 'Quantidade atual:', chave: 'quantidadePlantada' },
                        { label: 'Espaço disponível', chave: 'espacoDisponivel' },
                        { label: 'Capacidade de armazenamento:', chave: 'capacidadeMaxima' },
                    ]}
                    colunasEntrada={[
                        { titulo: 'Nome Popular', chave: 'nomePopular' },
                        { titulo: 'Data', chave: 'data' },
                        { titulo: 'Quantidade', chave: 'quantidade' },
                    ]}
                    colunasSaida={[
                        { titulo: 'Nome Popular', chave: 'nomePopular' },
                        { titulo: 'Data', chave: 'data' },
                        { titulo: 'Quantidade', chave: 'quantidade' },
                    ]}
                    dadosEntrada={historicoEntradas}
                    dadosSaida={historicoSaidas}

                    onExportarPdf={() => handleExportarPdf(canteiroSelecionado)}
                    onExportarCsv={() => handleExportarCsv(canteiroSelecionado)}
                    
                    onClose={handleFecharModalDetalhe}
                    onEditar={handleEditarCanteiro}
                    onExcluir={handleExcluirCanteiro}
                    onExportar={handleExportarCanteiro}
                    textoExclusao="o canteiro"
                    mostrarAcoes={true}
                    mostrarHistorico={true}
                />
            )}

            {/* MODAL DE EDIÇÃO */}
            {modalEdicaoAberto && canteiroSelecionado && (
                <div className="modal-overlay" onClick={handleCancelarEdicao}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '700px', width: '95%', padding: '0'}}>
                        <button className="modal-close-button" onClick={handleCancelarEdicao} style={{position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', zIndex: 10}}>✕</button>
                        
                        <EditarPlantioCanteiro
                            itemParaEditar={canteiroSelecionado}
                            onSave={handleSalvarEdicao}
                            onCancel={handleCancelarEdicao}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Historico;