import React, { useState, useEffect } from 'react'
import Paginacao from '../Paginacao/Paginacao'
import ExportButton from '../ExportButton/ExportButton'
import TabelaHistorico from '../TabelaHistorico/TabelaHistorico'
import ModalExcluir from '../ModalExcluir/ModalExcluir'
import closeIcon from '../../assets/close.svg'
import editIcon from '../../assets/edit.svg'
import deleteIcon from '../../assets/delete.svg'
import './ModalDetalheGenerico.css';

/**
 * @param {object} props
 * @param {object} props.item - Objeto com os detalhes do item a ser exibido no modal
 * @param {string} props.titulo - Título do modal
 * @param {array} props.camposDetalhes - Array de objetos com { label, chave, valorPadrao } para os campos de detalhe
 * @param {array} props.colunasEntrada - Colunas para a tabela de entradas
 * @param {array} props.colunasSaida - Colunas para a tabela de saídas
 * @param {array} props.dadosEntrada - Dados para a tabela de entradas
 * @param {array} props.dadosSaida - Dados para a tabela de saídas
 * @param {function} props.onCarregarHistorico - Função para carregar dados do histórico
 * @param {function(): void} props.onClose - Função para fechar o modal
 * @param {function(): void} props.onEditar - Função para editar o item
 * @param {function(): void} props.onExcluir - Função para excluir o item
 * @param {function(): void} props.onExportar - Função para exportar dados
 * @param {string} props.textoExclusao - Texto personalizado para a exclusão
 * @param {boolean} props.mostrarAcoes - Se mostra os botões de ação (editar/excluir)
 * @param {boolean} props.mostrarHistorico - Se mostra a seção de histórico
 * @param {boolean} props.mostrarExportar - Se mostra o botão de exportar
 * @param {ReactNode} props.children - Conteúdo adicional personalizado
 */
function ModalDetalheGenerico({
    isOpen = false,
    item = {},
    titulo = 'Detalhes',
    camposDetalhes = [],
    colunasEntrada = [],
    colunasSaida = [],
    dadosEntrada = [],
    dadosSaida = [],
    onCarregarHistorico,
    onClose,
    onEditar,
    onExcluir,
    onExportarPdf, // Nova prop
    onExportarCsv, // Nova prop
    textoExclusao = 'este item',
    mostrarAcoes = true,
    mostrarHistorico = true,
    mostrarExportar = true,
    children
}) {
    // 1. Hooks SEMPRE no topo (antes de qualquer return)
    const [paginaHistorico, setPaginaHistorico] = useState(1);
    const [historicoEntrada, setHistoricoEntrada] = useState(dadosEntrada);
    const [historicoSaida, setHistoricoSaida] = useState(dadosSaida);
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

    // 2. UseEffect com proteção para item null
    useEffect(() => {
        // Se não estiver aberto ou item for nulo, não faz nada
        if (!isOpen || !item) return;

        if (onCarregarHistorico) {
            const carregarDados = async () => {
                // Proteção: usa optional chaining (?.) ou verifica se existe
                const id = item.id || item._id;
                if (!id) return;

                const dados = await onCarregarHistorico(id);
                if (dados && dados.entradas) setHistoricoEntrada(dados.entradas);
                if (dados && dados.saidas) setHistoricoSaida(dados.saidas);
            };
            carregarDados();
        } else {
            // Atualiza os dados se vierem via props (dadosEntrada/dadosSaida)
            setHistoricoEntrada(dadosEntrada.length > 0 ? dadosEntrada : [
                { data: '20/05/2025', quantidade: 300, responsavel: 'Padrão' } // Mock de fallback
            ]);
            setHistoricoSaida(dadosSaida.length > 0 ? dadosSaida : [
                { data: '30/05/2025', quantidade: 200, responsavel: 'Padrão' } // Mock de fallback
            ]);
        }
        // Dependência segura: usa item?.id
    }, [item?.id, item?._id, isOpen, onCarregarHistorico, dadosEntrada, dadosSaida]);

    // 3. Só agora fazemos o "early return" visual
    if (!isOpen || !item) return null;

    // Declarações que dependem de 'item' ou estado
    const dadosParaExportar = [
        ...historicoEntrada.map(i => ({ ...i, tipo: 'Entrada' })),
        ...historicoSaida.map(i => ({ ...i, tipo: 'Saída' })),
    ];

    const colunasparaExportar = [
        { label: 'Data', key: 'data' },
        { label: 'Nome Responsavel', key: 'responsavel' },
        { label: 'Quantidade', key: 'quantidade' },
    ];

    useEffect(() => {
        // Adicione o ?. aqui para evitar o erro de null
        if (isOpen && onCarregarHistorico && (item?.id || item?._id)) { 
            const carregarDados = async () => {
                try {
                    const dados = await onCarregarHistorico(item.id || item._id);
                    if (dados) {
                        setHistoricoEntrada(dados.entradas || []);
                        setHistoricoSaida(dados.saidas || []);
                    }
                } catch (error) {
                    console.error("Erro ao carregar histórico no modal:", error);
                }
            };
            carregarDados();
        }
        // Corrija as dependências aqui também
    }, [isOpen, item?.id, item?._id, onCarregarHistorico]); // Removido dadosEntrada e dadosSaida daqui

    if (!isOpen || !item) return null;

    const handleFecharModalExcluir = () => {
        setModalExcluirAberto(false);
    };

    const handleConfirmarExclusao = () => {
        if (onExcluir) {
            onExcluir(item);
        }
        setModalExcluirAberto(false);
        onClose();
    };

    const handleEditar = () => {
        if (onEditar) {
            onEditar(item);
        }
    };

    // const handleExportar = () => {
    //     if (onExportar) {
    //         onExportar(item);
    //     }
    // };

    const ITENS_POR_PAGINA = 2;
    const totalItens = Math.max(historicoEntrada.length, historicoSaida.length);
    const totalPaginas = Math.ceil(totalItens / ITENS_POR_PAGINA);
    const indiceUltimo = paginaHistorico * ITENS_POR_PAGINA;
    const indicePrimeiro = indiceUltimo - ITENS_POR_PAGINA;

    const entradasPagina = historicoEntrada.slice(indicePrimeiro, indiceUltimo);
    const saidasPagina = historicoSaida.slice(indicePrimeiro, indiceUltimo);

    const obterValorCampo = (campo) => {
        if (campo.valorPadrao) return campo.valorPadrao;
        if (campo.formatar && typeof campo.formatar === 'function') {
            return campo.formatar(item[campo.chave]);
        }
        return item[campo.chave] ?? 'Não informado';
    };

    const obterNomeItem = () => {
        // Adicionei 'NomeInsumo' que é usado no seu HistoricoFerramenta
        return item.nome || item.material || item.insumo || item.descricao || item.NomeInsumo || 'Item';
    };

    return (
        <>
            <div className='modal-overlay' onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className='modal-close-button' onClick={onClose}>
                        <img src={closeIcon} alt="Fechar" />
                    </button>

                    <h2>{titulo}</h2>

                    <div className="detalhe-container">
                        {item.imagem && (
                            <div className="detalhe-imagens">
                                <img src={item.imagem} alt={obterNomeItem()} />
                            </div>
                        )}

                        <div className="detalhe-info">
                            {camposDetalhes.map((campo, index) => (
                                <p key={index}>
                                    <strong>{campo.label}</strong> {obterValorCampo(campo)}
                                </p>
                            ))}

                            {children}
                        </div>

                        {mostrarAcoes && (
                            <div className="detalhe-acoes">
                                <button onClick={() => setModalExcluirAberto(true)}>
                                    <img src={deleteIcon} alt="Deletar" />
                                </button>
                                <button onClick={handleEditar}>
                                    <img src={editIcon} alt="Editar" />
                                </button>
                            </div>
                        )}
                    </div>

                    {mostrarHistorico && (
                        <div className="historico-container">
                            <h3>Histórico de Movimentação</h3>
                            <div className="historico-tabelas">
                                <div className="tabela-wrapper">
                                    <h4 className='tabela-entrada'>Entradas</h4>
                                    <TabelaHistorico
                                        colunas={colunasEntrada}
                                        dados={entradasPagina}
                                        variant="entrada"
                                    />
                                </div>
                                <div className="tabela-wrapper">
                                    <h4 className='tabela-saida'>Saídas</h4>
                                    <TabelaHistorico
                                        colunas={colunasSaida}
                                        dados={saidasPagina}
                                        variant="saida"
                                    />
                                </div>
                            </div>

                            <div className="footer-content">
                                <Paginacao
                                    paginaAtual={paginaHistorico}
                                    totalPaginas={totalPaginas}
                                    onPaginaChange={setPaginaHistorico}
                                />
                                <div>
                                    {onExportarPdf && onExportarCsv && (
                                        <ExportButton
                                            data={dadosParaExportar} 
                                            columns={colunasparaExportar} 
                                            fileName={`historico_movimentacao_canteiro${item.id}`}
                                            onExportPDF={onExportarPdf}
                                            onExportCSV={onExportarCsv}
                                        />
                                    )}
                                    {mostrarExportar && !onExportarPdf && !onExportarCsv && (
                                        <ExportButton 
                                            data={dadosParaExportar} 
                                            columns={colunasparaExportar} 
                                            fileName={`historico_movimentacao_canteiro${item.id}`} 
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Exclusão */}
            <ModalExcluir
                isOpen={modalExcluirAberto}
                onClose={handleFecharModalExcluir}
                onConfirm={handleConfirmarExclusao}
                nomeItem={obterNomeItem()}
                titulo="Confirmar Exclusão"
                mensagem={`Tem certeza que deseja excluir ${textoExclusao} "${obterNomeItem()}"? Esta ação não pode ser desfeita.`}
                textoConfirmar="Excluir"
                textoCancelar="Cancelar"
            />
        </>
    )
}

export default ModalDetalheGenerico;