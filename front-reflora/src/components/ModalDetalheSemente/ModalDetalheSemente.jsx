import React, { useState, useEffect } from 'react'
import './ModalDetalheSemente.css'
import Paginacao from '../Paginacao/Paginacao'
import TabelaHistorico from '../TabelaHistorico/TabelaHistorico'
import ModalExcluir from '../ModalExcluir/ModalExcluir'
import EditarSementes from './EditarSementes/EditarSementes'
//Icons
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
    
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
    const [modalEditarAberto, setModalEditarAberto] = useState(false);



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

    const handleFecharModalExcluir = () => {
        setModalExcluirAberto(false);
    };
    const handleFecharModalEditar = () => {
        setModalEditarAberto(false);
        semente(null);
    };

    const handleConfirmarExclusao = () => {
        if (onDeletar && sementeResumo.id) {
            onDeletar(sementeResumo.id); // Chama a função do Pai (Banco.jsx)
        }
        setModalExcluirAberto(false);
        onClose();
    };
    const handleSalvarEdicao = (dadosEditados) => {
        console.log("Semente editada:", dadosEditados);
        setModalEditarAberto(false);
    };

    const ITENS_POR_PAGINA = 2;

    const totalItens = Math.max(historicoEntrada.length, historicoSaida.length);
    const totalPaginas = Math.ceil(totalItens / ITENS_POR_PAGINA);

    const indiceUltimo = paginaHistorico * ITENS_POR_PAGINA;
    const indicePrimeiro = indiceUltimo - ITENS_POR_PAGINA;

    const entradasPagina = historicoEntrada.slice(indicePrimeiro, indiceUltimo);
    const saidasPagina = historicoSaida.slice(indicePrimeiro, indiceUltimo);

    return (
        <>
            <div className='modal-overlay' onClick={onClose}>
                <div className="modal-content-semente" onClick={(e) => e.stopPropagation()}>
                    <button className='modal-close-button' onClick={onClose}>
                        <img src={closeIcon} alt="Fechar" />
                    </button>

                    <h2>Detalhes da Semente</h2>

                    <div className="detalhe-container">
                        <div className="detalhe-imagens">
                            <img src={semente.imagem} alt={semente.nome} />
                        </div>
                        <div className="detalhe-info">
                            <p><strong>Lote:</strong>{semente.id}</p>
                            <p><strong>Data do Cadastro:</strong>{semente.dataCadastro}</p>
                            <p><strong>Nome Popular:</strong>{semente.nome}</p>
                            <p><strong>Nome Científico:</strong>{semente.nomeCientifico}</p>
                            <p><strong>Família:</strong>{semente.familia}</p>
                            <p><strong>Origem:</strong>{semente.origem}</p>
                            <p><strong>Quantidade Atual:</strong>{semente.qtdAtual}</p>
                            <p><strong>Local de armazenamento:</strong>Câmara fria</p>
                            <p><strong>Localização de Coleta:</strong>Araruna (-6.558, -35.742)</p>
                        </div>
                        <div className="detalhe-acoes">
                            <button onClick={() => setModalExcluirAberto(true)}>
                                <img src={deleteIcon} alt="Deletar" />
                            </button>
                            <button onClick={() => setModalEditarAberto(true)}>
                                <img src={editIcon} alt="Editar" />
                            </button>
                        </div>
                    </div>

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
            <EditarSementes
                isOpen={modalEditarAberto}
                semente={semente}
                onCancelar={handleFecharModalEditar}
                onSalvar={handleSalvarEdicao}
                />
        </>
    )
}

export default ModalDetalheSemente;