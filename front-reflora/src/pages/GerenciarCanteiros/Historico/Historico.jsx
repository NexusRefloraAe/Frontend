import React, { useState, useEffect, useCallback } from "react";
// Components
import TabelaResponsiva from "../../../components/TabelaResponsiva/TabelaResponsiva";
import ModalDetalheGenerico from "../../../components/ModalDetalheGenerico/ModalDetalheGenerico";
import EditarPlantioCanteiro from "../EditarPlantioCanteiro/EditarPlantioCanteiro";
import Paginacao from "../../../components/Paginacao/Paginacao";

// Services
import { canteiroService } from "../../../services/canteiroService";
import { plantioCanteiroService } from "../../../services/plantioCanteiroService";
import { getBackendErrorMessage } from "../../../utils/errorHandler";

// Styles
import "./Historico.css"; 

const Historico = () => {
    // --- ESTADOS ---
    const [canteiros, setCanteiros] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');
    
    // Seleção e Distribuição
    const [selecionados, setSelecionados] = useState([]);
    const [valoresSaida, setValoresSaida] = useState({});

    // Modais
    const [modalDetalheAberto, setModalDetalheAberto] = useState(false);
    const [canteiroSelecionado, setCanteiroSelecionado] = useState(null);
    const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
    
    // Dados Modal
    const [historicoEntradas, setHistoricoEntradas] = useState([]);
    const [historicoSaidas, setHistoricoSaidas] = useState([]);

    // Filtros
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [termoBusca, setTermoBusca] = useState('');
    const itensPorPagina = 10;
    const [ordem, setOrdem] = useState('nomeCanteiro');
    const [direcao, setDirecao] = useState('asc');

    // --- CARREGAMENTO ---
    const fetchCanteiros = useCallback(async () => {
        setLoading(true);
        try {
            const data = await canteiroService.getAll(termoBusca, paginaAtual - 1, itensPorPagina, ordem, direcao);
            const dadosFormatados = data.content.map(c => ({
                id: c.id,
                NomeCanteiro: c.nomeCanteiro,
                NomePopular: c.nomePopularSemente,
                Quantidade: c.quantidadePlantada,
                ...c
            }));
            setCanteiros(dadosFormatados);
            setTotalPaginas(data.totalPages || 1);
            setErro('');
        } catch (error) {
            setErro(getBackendErrorMessage(error));
        } finally {
            setLoading(false);
        }
    }, [termoBusca, paginaAtual, ordem, direcao]);

    useEffect(() => { fetchCanteiros(); }, [fetchCanteiros]);

    // --- INTERAÇÕES ---
    const toggleSelecao = (id) => {
        setSelecionados(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleChangeQuantidade = (id, valor) => {
        setValoresSaida(prev => ({ ...prev, [id]: valor }));
    };

    const handleAdicionarDistribuicao = () => {
        if (selecionados.length === 0) return alert("Selecione ao menos um canteiro.");
        
        const itens = selecionados.map(id => ({
            id,
            nome: canteiros.find(c => c.id === id)?.NomeCanteiro,
            quantidadeSaida: valoresSaida[id] || 0
        }));

        if (itens.some(i => i.quantidadeSaida <= 0)) return alert("Informe a quantidade para os itens selecionados.");
        
        console.log("Distribuir:", itens);
        alert(`Distribuindo ${itens.length} itens!`);
        setSelecionados([]);
        setValoresSaida({});
    };

    // --- MODAL DETALHES ---
    const handleDetalheCanteiro = async (canteiro) => {
        try {
            const detalhes = await canteiroService.getById(canteiro.id);
            const hist = await canteiroService.getHistoricoDetalhado(canteiro.id);
            
            const fmtHist = (arr) => (arr?.content || []).map(i => ({
                nomePopular: i.nomePopularMuda || '-', 
                data: i.data ? new Date(i.data).toLocaleDateString('pt-BR') : '-',
                quantidade: i.quantidade
            }));

            setHistoricoEntradas(fmtHist(hist?.entradas));
            setHistoricoSaidas(fmtHist(hist?.saidas));
            setCanteiroSelecionado(detalhes);
            setModalDetalheAberto(true);
        } catch (e) { alert("Erro ao carregar detalhes."); }
    };

    // --- COLUNAS DA TABELA (Sem coluna de Ações/Olho) ---
    const colunas = [
        {
            key: 'select', label: '', width: '40px', align: 'center',
            render: (item) => (
                <input 
                    type="checkbox" 
                    className="checkbox-selecao"
                    checked={selecionados.includes(item.id)}
                    onChange={() => toggleSelecao(item.id)}
                />
            )
        },
        { 
            key: "NomeCanteiro", label: "Nome do Canteiro", sortable: true, sortKey: "nomeCanteiro",
            render: (item) => (
                <span className="link-detalhes" onClick={() => handleDetalheCanteiro(item)} title="Ver Detalhes">
                    {item.NomeCanteiro}
                </span>
            )
        },
        { key: "NomePopular", label: "Espécie", sortable: true, sortKey: "nomePopularSemente" },
        { key: "Quantidade", label: "Qtd Atual", sortable: true, sortKey: "quantidadePlantada" },
        {
            key: "qtdSaida", label: "Qtd Saída", width: '140px', align: 'center',
            render: (item) => (
                <input
                    type="number"
                    className="input-qtd-saida"
                    placeholder="0"
                    value={valoresSaida[item.id] || ''}
                    onChange={(e) => handleChangeQuantidade(item.id, e.target.value)}
                    disabled={!selecionados.includes(item.id)}
                />
            )
        }
    ];

    const colModal = [
        { key: 'nomePopular', label: 'Nome Popular' },
        { key: 'data', label: 'Data' },
        { key: 'quantidade', label: 'Qtd' }
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
                {erro && <p style={{color:'red'}}>{erro}</p>}
                
                <TabelaResponsiva
                    titulo="Histórico de Canteiro"
                    colunas={colunas}
                    dados={canteiros}
                    termoBusca={termoBusca}
                    onPesquisar={(t) => { setTermoBusca(t); setPaginaAtual(1); }}
                    onOrdenar={(key) => { 
                        if(key === ordem) setDirecao(direcao === 'asc' ? 'desc' : 'asc');
                        else { setOrdem(key); setDirecao('asc'); }
                    }}
                    ordemAtual={ordem}
                    direcaoAtual={direcao}
                    placeholderBusca="Pesquisar canteiro..."
                    
                    footerContent={
                        <div className="table-footer-container">
                            <Paginacao 
                                paginaAtual={paginaAtual} 
                                totalPaginas={totalPaginas} 
                                onPaginaChange={setPaginaAtual} 
                            />
                            <button className="btn-adicionar" onClick={handleAdicionarDistribuicao}>
                                Adicionar
                            </button>
                        </div>
                    }
                />
            </div>

            {/* MODAL DETALHES (Com classe para esconder foto) */}
            {modalDetalheAberto && canteiroSelecionado && (
                <div className="wrapper-modal-sem-foto">
                    <ModalDetalheGenerico
                        isOpen={modalDetalheAberto}
                        onClose={() => setModalDetalheAberto(false)}
                        item={canteiroSelecionado}
                        titulo="Detalhes do Canteiro"
                        camposDetalhes={[
                            { label: 'Nome:', chave: 'nomeCanteiro' },
                            { label: 'Cadastro:', chave: 'dataCriacao', formatar: d => new Date(d).toLocaleDateString('pt-BR') },
                            { label: 'Qtd Atual:', chave: 'quantidadePlantada' },
                            { label: 'Espaço Disp.:', chave: 'espacoDisponivel' },
                            { label: 'Capacidade:', chave: 'capacidadeMaxima' }
                        ]}
                        colunasEntrada={colModal} dadosEntrada={historicoEntradas}
                        colunasSaida={colModal} dadosSaida={historicoSaidas}
                        // Botões ativos
                        onEditar={() => { setModalDetalheAberto(false); setModalEdicaoAberto(true); }}
                        onExcluir={() => alert("Excluir lógica aqui")}
                    />
                </div>
            )}

            {/* MODAL EDIÇÃO */}
            {modalEdicaoAberto && canteiroSelecionado && (
                <div className="modal-overlay" style={{position:'fixed', zIndex:99999, background:'rgba(0,0,0,0.5)', top:0, left:0, width:'100%', height:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <div style={{background:'#fff', padding:20, borderRadius:8, width:'90%', maxWidth:700}}>
                        <EditarPlantioCanteiro
                            itemParaEditar={canteiroSelecionado}
                            onSave={async (d) => { await canteiroService.update(d.id, d); fetchCanteiros(); setModalEdicaoAberto(false); }}
                            onCancel={() => setModalEdicaoAberto(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Historico;