import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Paginacao from '../../../components/Paginacao/Paginacao';
import { FaEdit, FaFileExport } from 'react-icons/fa'; 
import './TermoCompromisso.css';

const TermoCompromisso = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Fallback de dados para teste (caso acesse direto)
    const fallbackState = {
        dadosRevisao: {
            instituicao: 'SEMAS',
            cidadeSede: 'ARARUNA',
            estadoSede: 'PB',
            cidadeDistribuicao: 'BAÍA DA TRAIÇÃO',
            estadoDistribuicao: 'PB',
            responsavelDistribuicao: 'MARCELO',      // Quem entrega (AFINK)
            responsavelRecebimento: 'THAIGO FARIAS'  // Quem recebe (Instituição)
        },
        mudas: [],
        totalMudas: 0
    };

    const { dadosRevisao, mudas, totalMudas } = location.state || fallbackState;

    // --- LÓGICA DE PAGINAÇÃO ---
    const [paginaAtual, setPaginaAtual] = useState(1);
    const ITENS_POR_PAGINA = 8;
    const listaMudasCompleta = mudas || [];
    const totalPaginas = Math.ceil(listaMudasCompleta.length / ITENS_POR_PAGINA);
    const indiceUltimoItem = paginaAtual * ITENS_POR_PAGINA;
    const indicePrimeiroItem = indiceUltimoItem - ITENS_POR_PAGINA;
    const mudasPaginaAtual = listaMudasCompleta.slice(indicePrimeiroItem, indiceUltimoItem);
    const linhasVaziasCount = Math.max(0, ITENS_POR_PAGINA - mudasPaginaAtual.length);
    const linhasVazias = Array(linhasVaziasCount).fill(null);
    // ---------------------------

    // --- FORMATAÇÃO DOS DADOS ---
    const instituicao = dadosRevisao.instituicao || '_______';
    const total = totalMudas || 0;

    // Definição clara de quem entrega e quem recebe
    const respDistribuicao = dadosRevisao.responsavelDistribuicao || '_______'; // Representante AFINK
    const respRecebimento = dadosRevisao.responsavelRecebimento || '_______';   // Representante Instituição

    // Formata Cidade / UF Sede (Onde fica a instituição)
    const cidadeSede = dadosRevisao.cidadeSede;
    const ufSede = dadosRevisao.estadoSede;
    const textoSede = (cidadeSede && ufSede) ? `${cidadeSede} - ${ufSede}` : (cidadeSede || '_______');

    // Formata Cidade / UF Distribuição (Onde as mudas vão)
    const cidadeDist = dadosRevisao.cidadeDistribuicao;
    const ufDist = dadosRevisao.estadoDistribuicao;
    const textoDist = (cidadeDist && ufDist) ? `${cidadeDist} - ${ufDist}` : (cidadeDist || '_______');

    const handleEdit = () => navigate(-1);
    const handleExport = () => window.print();

    return (
        <div className="termo-compromisso">
            <div className="termo-compromisso__documento">
                <h2>TERMO DE COMPROMISSO E RESPONSABILIDADE</h2>

                {/* TEXTO ATUALIZADO E MAIS PROFISSIONAL */}
                <p className="termo-compromisso__texto">
                    Pelo presente instrumento, a <strong>AFINK</strong>, neste ato representada pelo(a) Sr(a). <strong>{respDistribuicao}</strong>, 
                    formaliza a doação e entrega de <strong>{total}</strong> mudas para a instituição <strong>{instituicao}</strong> 
                    (sediada em <strong>{textoSede}</strong>).
                    <br/><br/>
                    A entrega é recebida pelo(a) Sr(a). <strong>{respRecebimento}</strong>, responsável designado(a) pela instituição beneficiária. 
                    As mudas destinam-se ao plantio/distribuição no município de <strong>{textoDist}</strong>. 
                    <br/><br/>
                    A partir desta data, a referida instituição assume a inteira responsabilidade pela guarda, 
                    manutenção e direção de todos os serviços de cuidados com as espécies abaixo relacionadas:
                </p>

                <table className="termo-compromisso__tabela">
                    <thead>
                        <tr>
                            <th>Espécie</th>
                            <th>Quantidade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mudasPaginaAtual.map((muda, index) => (
                            <tr key={index}>
                                <td>{muda.nome}</td>
                                <td>{muda.quantidade}</td>
                            </tr>
                        ))}
                        {linhasVazias.map((_, index) => (
                            <tr key={`vazio-${index}`}>
                                <td>-</td>
                                <td>0</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {totalPaginas > 1 && (
                    <div className="termo-compromisso__paginacao">
                        <Paginacao
                            paginaAtual={paginaAtual}
                            totalPaginas={totalPaginas}
                            onPaginaChange={setPaginaAtual}
                        />
                    </div>
                )}

                {/* AREA DE ASSINATURAS (Sugestão Visual para Termo) */}
                <div className="assinaturas-container" style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                     <div style={{ textAlign: 'center', flex: 1, borderTop: '1px solid #333', paddingTop: '10px' }}>
                        <small>Responsável AFINK</small><br/>
                        <strong>{respDistribuicao}</strong>
                     </div>
                     <div style={{ textAlign: 'center', flex: 1, borderTop: '1px solid #333', paddingTop: '10px' }}>
                        <small>Responsável Recebimento</small><br/>
                        <strong>{respRecebimento}</strong>
                     </div>
                </div>

                <div className="termo-compromisso__actions">
                    <button
                        type="button"
                        className="termo-compromisso__button termo-compromisso__button--secondary"
                        onClick={handleEdit}
                    >
                        <FaEdit /> Editar
                    </button>
                    <button
                        type="button"
                        className="termo-compromisso__button termo-compromisso__button--primary"
                        onClick={handleExport}
                    >
                        <FaFileExport /> Exportar Termo
                    </button>
                </div>
            </div> 
        </div>
    );
};

export default TermoCompromisso;