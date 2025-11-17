import React, { useState, useEffect } from 'react'
import './ModalDetalheSemente.css'
import Paginacao from '../Paginacao/Paginacao'
import ExportButton from '../ExportButton/ExportButton'
import TabelaHistorico from '../TabelaHistorico/TabelaHistorico'
import ModalExcluir from '../ModalExcluir/ModalExcluir'
//Icons
import closeIcon from '../../assets/close.svg'
import editIcon from '../../assets/edit.svg'
import deleteIcon from '../../assets/delete.svg'
import shareIcon from '../../assets/Share.svg'

const colunasparaExportar = [
    { label: 'Tipo', key: 'tipo' },
    { label: 'Lote', key: 'lote' },
    { label: 'Data', key: 'data' },
    { label: 'Nome Popular', key: 'nome' },
    { label: 'Quantidade (kg)', key: 'qtd' },
    { label: 'Câmara Fria', key: 'camaraFria' },
];

const colunasEntrada = [
    { titulo: 'Lote', chave: 'lote', sortable: true },
    { titulo: 'Data', chave: 'data', sortable: true },
    { titulo: 'Nome Popular', chave: 'nome', sortable: true },
    { titulo: 'Quantidade (kg)', chave: 'qtd', sortable: true },
    { titulo: 'Câmara Fria', chave: 'camaraFria', sortable: true },
];

const colunasSaida = [
    { titulo: 'Lote', chave: 'lote', sortable: true },
    { titulo: 'Data', chave: 'data', sortable: true },
    { titulo: 'Nome Popular', chave: 'nome', sortable: true },
    { titulo: 'Quantidade (kg)', chave: 'qtd', sortable: true },
    { titulo: 'Câmara Fria', chave: 'camaraFria', sortable: true },
];

/**
 * @param {object} props
 * @param {object} props.semente - Objeto com os detalhes da semente a ser exibida no modal
 * @param {function(): void} props.onClose - Função para fechar o modal
 */
function ModalDetalheSemente({ semente, onClose }) {
    const [paginaHistorico, setPaginaHistorico] = useState(1);
    const [historicoEntrada, setHistoricoEntrada] = useState([]);
    const [historicoSaida, setHistoricoSaida] = useState([]);
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);



    useEffect(() => {
        setHistoricoEntrada([
            { lote: 'A001', data: '20/05/2025', nome: 'Eucalipito', qtd: 2000, camaraFria: 'Sim' },
            { lote: 'A002', data: '15/06/2025', nome: 'Pau-Brasil', qtd: 1500, camaraFria: 'Não' },
            { lote: 'A003', data: '18/06/2025', nome: 'Ipê-amarelo', qtd: 1000, camaraFria: 'Sim' },
            { lote: 'A004', data: '25/06/2025', nome: 'Jacarandá', qtd: 800, camaraFria: 'Não' },
            { lote: 'A005', data: '30/06/2025', nome: 'Copaíba', qtd: 600, camaraFria: 'Sim' },
            { lote: 'A006', data: '05/07/2025', nome: 'Barbatimão', qtd: 400, camaraFria: 'Não' },
        ])
        setHistoricoSaida([
            { lote: 'A001', data: '10/07/2025', nome: 'Eucalipito', qtd: 500, camaraFria: 'Sim' },
            { lote: 'A002', data: '12/08/2025', nome: 'Pau-Brasil', qtd: 300, camaraFria: 'Não' },
        ])
    }, [semente.id]);

    const dadosParaExportar = [
        ...historicoEntrada.map(item => ({ ...item, tipo: 'Entrada' })),
        ...historicoSaida.map(item => ({ ...item, tipo: 'Saída' })),
    ];

    const handleFecharModalExcluir = () => {
        setModalExcluirAberto(false);
    };

    const handleConfirmarExclusao = () => {
        console.log("Semente excluída:", semente);
        setModalExcluirAberto(false);
        onClose();
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
                            <button>
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
                            <ExportButton data={dadosParaExportar} columns={colunasparaExportar} fileName={`historico_movimentacao_${semente.id}`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Exclusão */}
            <ModalExcluir
                isOpen={modalExcluirAberto}
                onClose={handleFecharModalExcluir}
                onConfirm={handleConfirmarExclusao}
                nomeItem={semente.nome}
                titulo="Confirmar Exclusão"
                mensagem={`Tem certeza que deseja excluir a semente "${semente.nome}" (Lote: ${semente.id})? Esta ação não pode ser desfeita.`}
                textoConfirmar="Excluir"
                textoCancelar="Cancelar"
            />
        </>
    )
}

export default ModalDetalheSemente;