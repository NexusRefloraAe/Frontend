import React, { useState, useEffect } from 'react';
import './ModalDetalheGenerico.css';
import Paginacao from '../Paginacao/Paginacao';
import ExportButton from '../ExportButton/ExportButton';
import TabelaResponsiva from '../TabelaResponsiva/TabelaResponsiva'; 
import ModalExcluir from '../ModalExcluir/ModalExcluir';
import closeIcon from '../../assets/close.svg';
import editIcon from '../../assets/edit.svg';
import deleteIcon from '../../assets/delete.svg';

function ModalDetalheGenerico({
    isOpen = false,
    item = {},
    titulo = 'Detalhes',
    
    // --- O QUE SERÁ EXIBIDO (Dinâmico) ---
    // Array de objetos: { label: 'Nome', chave: 'nome' }
    camposDetalhes = [], 
    
    // Configuração das Tabelas
    colunasEntrada = [], 
    colunasSaida = [],
    
    // Configuração da Exportação (Opcional)
    colunasExportar = [],
    
    // Dados e Funções
    dadosEntrada = [], 
    dadosSaida = [],
    onCarregarHistorico, 
    
    // Ações
    onClose,
    onEditar,
    onExcluir,
    mostrarAcoes = true,
    mostrarHistorico = true,
    mostrarExportar = true,
    textoExclusao = 'este item',
    children
}) {
    const [paginaHistorico, setPaginaHistorico] = useState(1);
    const [historicoEntrada, setHistoricoEntrada] = useState(dadosEntrada);
    const [historicoSaida, setHistoricoSaida] = useState(dadosSaida);
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

    // 1. Carrega histórico dinamicamente se houver função e ID
    useEffect(() => {
        if (isOpen && onCarregarHistorico && (item.id || item._id)) {
            const carregarDados = async () => {
                try {
                    const dados = await onCarregarHistorico(item.id || item._id);
                    if (dados) {
                        setHistoricoEntrada(dados.entradas || []);
                        setHistoricoSaida(dados.saidas || []);
                    }
                } catch (error) {
                    console.error("Erro ao carregar histórico:", error);
                }
            };
            carregarDados();
        } else {
            // Se não, usa os dados estáticos passados via props (ex: atualização em tempo real)
            setHistoricoEntrada(dadosEntrada);
            setHistoricoSaida(dadosSaida);
        }
    }, [isOpen, item.id, item._id, onCarregarHistorico, dadosEntrada, dadosSaida]);

    if (!isOpen || !item) return null;

    // 2. Lógica de Paginação
    const ITENS_POR_PAGINA = 5;
    const totalItens = Math.max(historicoEntrada.length, historicoSaida.length);
    const totalPaginas = Math.ceil(totalItens / ITENS_POR_PAGINA) || 1;
    const indiceUltimo = paginaHistorico * ITENS_POR_PAGINA;
    const indicePrimeiro = indiceUltimo - ITENS_POR_PAGINA;

    const entradasPagina = historicoEntrada.slice(indicePrimeiro, indiceUltimo);
    const saidasPagina = historicoSaida.slice(indicePrimeiro, indiceUltimo);

    // 3. Adaptadores
    const adaptarColunas = (cols) => cols.map(c => ({
        key: c.chave || c.key,
        label: c.titulo || c.label,
        sortable: false
    }));

    const obterValor = (campo) => {
        const val = item[campo.chave];
        // Se tiver função formatar, usa ela. Senão, mostra o valor ou traço.
        if (campo.formatar && typeof campo.formatar === 'function') {
            return campo.formatar(val, item);
        }
        return (val !== null && val !== undefined && val !== '') ? val : '-';
    };

    // Tenta pegar a imagem de várias fontes possíveis do backend
    const imagemUrl = item.imagem || item.fotoUrl || item.foto || null;
    const nomeItem = item.nome || item.nomePopular || 'Item';

    // 4. Exportação Unificada
    const dadosParaExportar = [
        ...historicoEntrada.map(i => ({ ...i, tipo: 'Entrada' })),
        ...historicoSaida.map(i => ({ ...i, tipo: 'Saída' })),
    ];

    // Se não passarem colunas de exportação, cria um padrão básico
    const colsExport = colunasExportar.length > 0 ? colunasExportar : [
        { label: 'Tipo', key: 'tipo' },
        { label: 'Data', key: 'data' },
        { label: 'Quantidade', key: 'quantidade' },
        { label: 'Lote', key: 'lote' },
        { label: 'Destino/Câmara', key: 'destino' },

    ];

    return (
        <>
            <div className='modal-overlay-generico' onClick={onClose}>
                <div className="modal-content-generico" onClick={(e) => e.stopPropagation()}>
                    
                    <div className="modal-header-generico">
                        <h2>{titulo}</h2>
                        <button className='close-btn-generico' onClick={onClose}>
                            <img src={closeIcon} alt="Fechar" />
                        </button>
                    </div>

                    <div className="modal-body-generico">
                        
                        {/* Seção Superior (Layout Responsivo) */}
                        <div className="detalhe-top-generico">
                            
                            {/* Imagem */}
                            <div className="img-wrapper-generico">
                                {imagemUrl ? (
                                    <img src={imagemUrl} alt={nomeItem} onError={(e) => e.target.style.display='none'} />
                                ) : (
                                    <div className="placeholder-generico">Sem Foto</div>
                                )}
                            </div>

                            {/* Grid de Dados (Renderiza exatamente os campos do cadastro) */}
                            <div className="info-grid-generico">
                                {camposDetalhes.map((campo, index) => (
                                    <div 
                                        className="info-item-generico" 
                                        key={index} 
                                        // style={{ gridColumn: '1 / -1' }} se quiser ocupar a linha toda
                                    >
                                        <label>{campo.label}</label>
                                        <span>{obterValor(campo)}</span>
                                    </div>
                                ))}
                                {children}
                            </div>

                            {/* Botões */}
                            {mostrarAcoes && (
                                <div className="acoes-generico">
                                    <button className="btn-generico" onClick={() => setModalExcluirAberto(true)} title="Excluir">
                                        <img src={deleteIcon} alt="Deletar" />
                                    </button>
                                    <button className="btn-generico" onClick={() => onEditar && onEditar(item)} title="Editar">
                                        <img src={editIcon} alt="Editar" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Histórico */}
                        {mostrarHistorico && (
                            <div className="hist-container-generico">
                                <h3>Histórico de Movimentação</h3>
                                
                                <div className="hist-tabelas-generico">
                                    <div className="wrapper-tab-generico">
                                        <div className="titulo-tab-generico bg-ent-gen">Entradas</div>
                                        <TabelaResponsiva 
                                            colunas={adaptarColunas(colunasEntrada)}
                                            dados={entradasPagina}
                                            onPesquisar={null} footerContent={null}
                                        />
                                    </div>

                                    <div className="wrapper-tab-generico wrapper-saida-generico">
                                        <div className="titulo-tab-generico bg-sai-gen">Saídas</div>
                                        <TabelaResponsiva 
                                            colunas={adaptarColunas(colunasSaida)}
                                            dados={saidasPagina}
                                            onPesquisar={null} footerContent={null}
                                        />
                                    </div>
                                </div>

                                <div className="footer-generico">
                                    <Paginacao paginaAtual={paginaHistorico} totalPaginas={totalPaginas} onPaginaChange={setPaginaHistorico} />
                                    {mostrarExportar && <ExportButton data={dadosParaExportar} columns={colsExport} fileName={`historico_${item.id || 'item'}`} />}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ModalExcluir
                isOpen={modalExcluirAberto}
                onClose={() => setModalExcluirAberto(false)}
                onConfirm={() => { onExcluir && onExcluir(item); setModalExcluirAberto(false); onClose(); }}
                titulo="Confirmar Exclusão"
                mensagem={`Tem certeza que deseja excluir ${textoExclusao} "${nomeItem}"?`}
                nomeItem={nomeItem}
            />
        </>
    );
}

export default ModalDetalheGenerico;