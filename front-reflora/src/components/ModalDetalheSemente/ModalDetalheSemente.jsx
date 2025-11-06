import React, { useState, useEffect } from 'react'
import './ModalDetalheSemente.css'
import Paginacao from '../Paginacao/Paginacao'
import Button from '../Button/Button'
import ModalExcluir from '../ModalExcluir/ModalExcluir' // Importar o ModalExcluir
//Icons
import closeIcon from '../../assets/close.svg'
import editIcon from '../../assets/edit.svg'
import deleteIcon from '../../assets/delete.svg'
import shareIcon from '../../assets/Share.svg'

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
        ])
        setHistoricoSaida([
            { lote: 'A001', data: '10/07/2025', nome: 'Eucalipito', qtd: 500, finalidade: 'Germinação' },
            { lote: 'A002', data: '12/08/2025', nome: 'Pau-Brasil', qtd: 300, finalidade: 'Plantio' },
        ])
    }, [semente.id]);

    const handleAbrirModalExcluir = () => {
        setModalExcluirAberto(true);
    };

    const handleFecharModalExcluir = () => {
        setModalExcluirAberto(false);
    };

    const handleConfirmarExclusao = () => {
        // Lógica para excluir a semente
        console.log('Excluindo semente:', semente.id);
        
        // Fechar ambos os modais após a exclusão
        setModalExcluirAberto(false);
        onClose(); // Fecha o modal de detalhes também
        
        // Aqui você pode adicionar a chamada API para excluir a semente
        // await api.excluirSemente(semente.id);
    };

    return (
        <>
            <div className='modal-overlay' onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className='modal-close-button' onClick={onClose}>
                        <img src={closeIcon} alt="Fechar" />
                    </button>

                    <h2>Detalhes da Semente</h2>

                    <div className="detalhe-container">
                        <div className="detalhe-imagens">
                            <img src={semente.imagem} alt={semente.nome} />
                        </div>
                        <div className="detalhe-info">
                            <p><strong>Lote:</strong> {semente.id}</p>
                            <p><strong>Data do Cadastro:</strong> {semente.dataCadastro}</p>
                            <p><strong>Nome Popular:</strong> {semente.nome}</p>
                            <p><strong>Nome Científico:</strong> {semente.nomeCientifico}</p>
                            <p><strong>Família:</strong> {semente.familia}</p>
                            <p><strong>Origem:</strong> {semente.origem}</p>
                            <p><strong>Quantidade Atual:</strong> {semente.qtdAtual}</p>
                            <p><strong>Local de armazenamento:</strong> Câmara fria</p>
                            <p><strong>Localização de Coleta:</strong> Araruna (-6.558, -35.742)</p>
                        </div>
                        <div className="detalhe-acoes">
                            <button onClick={handleAbrirModalExcluir}>
                                <img src={deleteIcon} alt="Deletar" />
                            </button>
                            <button>
                                <img src={editIcon} alt="Editar" />
                            </button>
                        </div>
                    </div>
                    <div className="historico-container">
                        <h3>Histórico de Movimentação</h3>
                        <div className="historico-tabelas">
                            <div className="tabela-wrapper">
                                <h4 className='tabela-entrada'>Entradas</h4>
                                {/* Tabela de entradas aqui */}
                            </div>
                            <div className="tabela-wrapper">
                                <h4 className='tabela-saida'>Saídas</h4>
                                {/* Tabela de saídas aqui */}
                            </div>
                        </div>

                        <div className="footer-content">
                            <Paginacao 
                                paginaAtual={paginaHistorico} 
                                totalPaginas={3} 
                                onPaginaChange={setPaginaHistorico} 
                            />
                            <Button variant='primary' icon={shareIcon}>Exportar</Button>
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

export default ModalDetalheSemente