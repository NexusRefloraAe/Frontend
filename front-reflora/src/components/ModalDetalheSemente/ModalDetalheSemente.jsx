import React, { useState, useEffect } from 'react'
import './ModalDetalheSemente.css'
import Paginacao from '../Paginacao/Paginacao'
import TabelaHistorico from '../TabelaHistorico/TabelaHistorico'
import ModalExcluir from '../ModalExcluir/ModalExcluir'
import { sementesService } from '../../services/sementesService'

import closeIcon from '../../assets/close.svg'
import editIcon from '../../assets/edit.svg'
import deleteIcon from '../../assets/delete.svg'
import ExportButton from '../ExportButton/ExportButton'

const colunasEntrada = [
    { titulo: 'Lote', chave: 'lote' },
    { titulo: 'Data', chave: 'data' },
    { titulo: 'Nome Popular', chave: 'nomePopular' },
    { titulo: 'Qtd (kg)', chave: 'quantidade' },
    { titulo: 'Câmara Fria', chave: 'camaraFriaFormatada' },
];

const colunasSaida = [
    { titulo: 'Lote', chave: 'lote' },
    { titulo: 'Data', chave: 'data' },
    { titulo: 'Nome Popular', chave: 'nomePopular' },
    { titulo: 'Qtd (kg)', chave: 'quantidade' },
    { titulo: 'Câmara Fria', chave: 'camaraFriaFormatada' },
];

const colunasparaExportar = [
    { label: 'Tipo', key: 'tipo' },
    { label: 'Lote', key: 'lote' },
    { label: 'Data', key: 'data' },
    { label: 'Nome Popular', key: 'nome' },
    { label: 'Quantidade (kg)', key: 'qtd' },
    { label: 'Câmara Fria', key: 'camaraFria' },
];

function ModalDetalheSemente({ sementeResumo, onClose, onEditar, onDeletar }) {
    
    // Estado para os detalhes COMPLETOS da semente (buscados do backend)
    const [sementeDetalhada, setSementeDetalhada] = useState(null);
    
    // Estados do Histórico
    const [paginaHistorico, setPaginaHistorico] = useState(1);
    const [historicoEntrada, setHistoricoEntrada] = useState([]);
    const [historicoSaida, setHistoricoSaida] = useState([]);
    const [totalPaginas, setTotalPaginas] = useState(1);
    
    // Estado do Modal de Exclusão (Apenas exclusão fica aqui)
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
    const [loading, setLoading] = useState(true);

    // Função auxiliar para evitar Invalid Date se a string for dd/MM/yyyy
    const formatarData = (dataString) => {
        if (!dataString) return '-';
        // Se já vier formatado (ex: 09/07/2024), retornamos direto
        if (dataString.includes('/')) return dataString;
        // Se for ISO ou array, tenta converter
        try {
            return new Date(dataString).toLocaleDateString('pt-BR');
        } catch (e) {
            return dataString;
        }
    };

    // Função auxiliar para ler totalPages independente da estrutura (nested ou flat)
    const obterTotalPaginas = (objetoLista) => {
        if (!objetoLista) return 0;
        // Caso 1: Estrutura aninhada (ex: entradas.page.totalPages) - Conforme seu JSON
        if (objetoLista.page && typeof objetoLista.page.totalPages === 'number') {
            return objetoLista.page.totalPages;
        }
        // Caso 2: Estrutura plana (ex: entradas.totalPages) - Padrão Spring simples
        if (typeof objetoLista.totalPages === 'number') {
            return objetoLista.totalPages;
        }
        return 0;
    };

    useEffect(() => {
        const carregarDados = async () => {
            setLoading(true);
            try {
                // 1. Busca detalhes completos
                const detalhes = await sementesService.getById(sementeResumo.id);
                
                // Ajuste da URL da foto
                if (detalhes?.fotoSementeResponseDTO?.url) {
                    let url = detalhes.fotoSementeResponseDTO.url;
                    if (url.includes("reflora-minio")) url = url.replace("reflora-minio", "localhost");
                    else if (url.includes("minio")) url = url.replace("minio", "localhost");
                    detalhes.fotoUrl = url;
                }
                setSementeDetalhada(detalhes);

                // 2. Busca histórico paginado
                try {
                    // Backend pagina do 0, frontend do 1.
                    const hist = await sementesService.getHistorico(sementeResumo.id, paginaHistorico - 1, 2);
                    
                    const formatarItem = (item) => ({
                        ...item,
                        data: formatarData(item.data),
                        camaraFriaFormatada: item.camaraFria ? 'Sim' : 'Não' // Ajuste conforme seu JSON (se vier string "Sim", ok, se bool, converte)
                    });

                    // Acessa o content. Se seu JSON tem "entradas.content", usamos isso.
                    setHistoricoEntrada(hist?.entradas?.content?.map(formatarItem) || []);
                    setHistoricoSaida(hist?.saidas?.content?.map(formatarItem) || []);
                    
                    // --- CÁLCULO DA PAGINAÇÃO CORRIGIDO ---
                    const paginasEntrada = obterTotalPaginas(hist?.entradas);
                    const paginasSaida = obterTotalPaginas(hist?.saidas);
                    
                    // Usa o maior número de páginas entre as duas listas
                    const maximo = Math.max(paginasEntrada, paginasSaida);
                    
                    console.log('Páginas Entrada:', paginasEntrada, 'Páginas Saída:', paginasSaida, 'Máximo:', maximo);

                    // Se o máximo for 0 (sem dados), define 1 para manter consistência
                    setTotalPaginas(maximo > 0 ? maximo : 1);

                } catch (errHistorico) {
                    console.warn("Não foi possível carregar o histórico:", errHistorico);
                    setHistoricoEntrada([]);
                    setHistoricoSaida([]);
                    setTotalPaginas(1);
                }

            } catch (error) {
                console.error("Erro ao carregar detalhes principais:", error);
            } finally {
                setLoading(false);
            }
        };

        if (sementeResumo?.id) {
            carregarDados();
        }
    }, [sementeResumo, paginaHistorico]);

    const dadosParaExportar = [
        ...historicoEntrada.map(item => ({ ...item, tipo: 'Entrada' })),
        ...historicoSaida.map(item => ({ ...item, tipo: 'Saída' })),
    ];

    const handleConfirmarExclusao = () => {
        if (onDeletar && sementeResumo.id) {
            onDeletar(sementeResumo.id); // Chama a função do Pai (Banco.jsx)
        }
        setModalExcluirAberto(false);
        onClose(); // Fecha o modal de detalhes também
    };

    // Se ainda está carregando ou falhou, usa o resumo da lista para exibir o básico
    const dados = sementeDetalhada || sementeResumo;

    return (
        <>
            <div className='modal-overlay' onClick={onClose}>
                <div className="modal-content-semente" onClick={(e) => e.stopPropagation()}>
                    <button className='modal-close-button' onClick={onClose}>
                        <img src={closeIcon} alt="Fechar" />
                    </button>

                    <h2>Detalhes da Semente</h2>

                    {loading && !sementeDetalhada ? (
                        <p style={{padding: '20px', textAlign: 'center'}}>Carregando detalhes...</p>
                    ) : (
                        <div className="detalhe-container">
                            <div className="detalhe-imagens">
                                {dados.fotoUrl ? (
                                    <img src={dados.fotoUrl} alt={dados.nomePopular} />
                                ) : (
                                    <div className="placeholder-foto" style={{
                                        width: '100%', height: '200px', background: '#eee', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#888', borderRadius: '8px'
                                    }}>Sem Foto</div>
                                )}
                            </div>
                            
                            {/* Exibição dos dados do Back-end */}
                            <div className="detalhe-info">
                                <p><strong>Lote:</strong> {dados.lote}</p>
                                <p><strong>Data do Cadastro:</strong> {dados.dataDeCadastro}</p>
                                <p><strong>Nome Popular:</strong> {dados.nomePopular}</p>
                                <p><strong>Nome Científico:</strong> {dados.nomeCientifico || '-'}</p>
                                <p><strong>Família:</strong> {dados.familia || '-'}</p>
                                <p><strong>Origem:</strong> {dados.origem || '-'}</p>
                                <p><strong>Quantidade Atual:</strong> {dados.quantidade} {dados.unidadeDeMedida}</p>
                                <p><strong>Armazenamento:</strong> {dados.estahNaCamaraFria ? 'Câmara Fria' : 'Armazenamento Comum'}</p>
                                <p><strong>Localização:</strong> {dados.localizacaoDaColeta || '-'}</p>
                            </div>
                            
                            <div className="detalhe-acoes">
                                <button onClick={() => setModalExcluirAberto(true)} title="Excluir">
                                    <img src={deleteIcon} alt="Deletar" />
                                </button>
                                <button onClick={() => {
                                    // Passa os dados completos para edição
                                    onEditar(sementeDetalhada || sementeResumo);
                                    onClose(); // Fecha modal para ver o formulário
                                }} title="Editar">
                                    <img src={editIcon} alt="Editar" />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="historico-container-modal">
                        <h3>Histórico de Movimentação</h3>
                        <div className="historico-tabelas">
                            <div className="tabela-wrapper">
                                <h4 className='tabela-entrada'>Entradas</h4>
                                <TabelaHistorico
                                    colunas={colunasEntrada}
                                    dados={historicoEntrada}
                                    variant="entrada"
                                />
                            </div>
                            <div className="tabela-wrapper">
                                <h4 className='tabela-saida'>Saídas</h4>
                                <TabelaHistorico
                                    colunas={colunasSaida}
                                    dados={historicoSaida}
                                    variant="saida"
                                />
                            </div>
                        </div>

                        <div className="footer-content">
                            {/* Nota: Com o JSON de exemplo (totalPages: 1), este componente 
                                retornará null e a barra ficará oculta visualmente. 
                                Ela aparecerá automaticamente quando houver 2 ou mais páginas.
                            */}
                            <Paginacao
                                paginaAtual={paginaHistorico}
                                totalPaginas={totalPaginas}
                                onPaginaChange={setPaginaHistorico}
                            />
                            <ExportButton data={dadosParaExportar} columns={colunasparaExportar} fileName={`historico_movimentacao_${sementeResumo.id}`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Exclusão Confirmada */}
            <ModalExcluir
                isOpen={modalExcluirAberto}
                onClose={() => setModalExcluirAberto(false)}
                onConfirm={handleConfirmarExclusao}
                nomeItem={dados.nomePopular}
                titulo="Confirmar Exclusão"
                mensagem={`Tem certeza que deseja excluir a semente "${dados.nomePopular}" (Lote: ${dados.lote})?`}
                textoConfirmar="Excluir"
                textoCancelar="Cancelar"
            />
        </>
    )
}

export default ModalDetalheSemente;