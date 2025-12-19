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

// ... (Mantenha as definições de colunasEntrada, colunasSaida e colunasparaExportar como estavam)

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
    
    const [sementeDetalhada, setSementeDetalhada] = useState(null);
    const [paginaHistorico, setPaginaHistorico] = useState(1);
    const [historicoEntrada, setHistoricoEntrada] = useState([]);
    const [historicoSaida, setHistoricoSaida] = useState([]);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
    const [loading, setLoading] = useState(true);

    const formatarData = (dataString) => {
        if (!dataString) return '-';
        if (dataString.includes('/')) return dataString;
        try {
            return new Date(dataString).toLocaleDateString('pt-BR');
        } catch (e) {
            return dataString;
        }
    };

    const obterTotalPaginas = (objetoLista) => {
        if (!objetoLista) return 0;
        if (objetoLista.page && typeof objetoLista.page.totalPages === 'number') {
            return objetoLista.page.totalPages;
        }
        if (typeof objetoLista.totalPages === 'number') {
            return objetoLista.totalPages;
        }
        return 0;
    };

    useEffect(() => {
        const carregarDados = async () => {
            setLoading(true);
            try {
                const detalhes = await sementesService.getById(sementeResumo.id);
                
                if (detalhes?.fotoSementeResponseDTO?.url) {
                    let url = detalhes.fotoSementeResponseDTO.url;
                    if (url.includes("reflora-minio")) url = url.replace("reflora-minio", "localhost");
                    else if (url.includes("minio")) url = url.replace("minio", "localhost");
                    detalhes.fotoUrl = url;
                }
                setSementeDetalhada(detalhes);

                try {
                    const hist = await sementesService.getHistorico(sementeResumo.id, paginaHistorico - 1, 2);
                    
                    const formatarItem = (item) => ({
                        ...item,
                        data: formatarData(item.data),
                        camaraFriaFormatada: item.camaraFria ? 'Sim' : 'Não'
                    });

                    setHistoricoEntrada(hist?.entradas?.content?.map(formatarItem) || []);
                    setHistoricoSaida(hist?.saidas?.content?.map(formatarItem) || []);
                    
                    const paginasEntrada = obterTotalPaginas(hist?.entradas);
                    const paginasSaida = obterTotalPaginas(hist?.saidas);
                    const maximo = Math.max(paginasEntrada, paginasSaida);
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
            onDeletar(sementeResumo.id);
        }
        setModalExcluirAberto(false);
        onClose(); 
    };

    const dados = sementeDetalhada || sementeResumo;

    const baixarArquivo = (response, defaultName) => {
        const disposition = response.headers['content-disposition'];
        let fileName = defaultName;

        if (disposition) {
            const filenameRegex = /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/i;
            const matches = filenameRegex.exec(disposition);
            if (matches && matches[1]) { 
                fileName = matches[1].replace(/['"]/g, '');
                fileName = decodeURIComponent(fileName); 
            }
        }

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    };

    const handleDownloadHistoricoPDF = async () => {
        try {
            const id = sementeResumo.id;
            const response = await sementesService.exportarHistoricoPdf(id);
            baixarArquivo(response, `historico_${id}.pdf`);
        } catch (error) {
            console.error("Erro ao baixar PDF do histórico:", error);
            alert("Erro ao gerar o PDF do histórico.");
        }
    };

    const handleDownloadHistoricoCSV = async () => {
        try {
            const id = sementeResumo.id;
            const response = await sementesService.exportarHistoricoCsv(id);
            baixarArquivo(response, `historico_${id}.csv`);
        } catch (error) {
            console.error("Erro ao baixar CSV do histórico:", error);
            alert("Erro ao gerar o CSV do histórico.");
        }
    };

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
                            
                            <div className="detalhe-info">
                                <p><strong>Lote:</strong> {dados.lote}</p>
                                <p><strong>Data do Cadastro:</strong> {dados.dataDeCadastro}</p>
                                <p><strong>Nome Popular:</strong> {dados.nomePopular}</p>
                                <p><strong>Nome Científico:</strong> {dados.nomeCientifico || '-'}</p>
                                <p><strong>Família:</strong> {dados.familia || '-'}</p>
                                <p><strong>Origem:</strong> {dados.origem || '-'}</p>
                                <p><strong>Quantidade Atual:</strong> {dados.quantidade} {dados.unidadeDeMedida}</p>
                                <p><strong>Armazenamento:</strong> {dados.estahNaCamaraFria ? 'Câmara Fria' : 'Armazenamento Comum'}</p>
                                
                                {/* --- ALTERADO: Exibindo Cidade e UF --- */}
                                <p><strong>Localização (Cidade/UF):</strong> {dados.cidade && dados.uf ? `${dados.cidade} - ${dados.uf}` : (dados.localizacaoDaColeta || '-')}</p>
                            </div>
                            
                            <div className="detalhe-acoes">
                                <button onClick={() => setModalExcluirAberto(true)} title="Excluir">
                                    <img src={deleteIcon} alt="Deletar" />
                                </button>
                                <button onClick={() => {
                                    onEditar(sementeDetalhada || sementeResumo);
                                    onClose(); 
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
                            <Paginacao
                                paginaAtual={paginaHistorico}
                                totalPaginas={totalPaginas}
                                onPaginaChange={setPaginaHistorico}
                            />
                            <ExportButton 
                                data={dadosParaExportar} 
                                columns={colunasparaExportar} 
                                fileName={`historico_movimentacao_${sementeResumo.id}`}
                                onExportPDF={handleDownloadHistoricoPDF}
                                onExportCSV={handleDownloadHistoricoCSV}
                            />
                        </div>
                    </div>
                </div>
            </div>

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