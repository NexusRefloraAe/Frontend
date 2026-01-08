import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Paginacao from '../../../components/Paginacao/Paginacao';
import { FaEdit, FaFileExport } from 'react-icons/fa';
import './TermoCompromisso.css';

const TermoCompromisso = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 1. DADOS SEGUROS
    const { dadosRevisao, mudas, totalMudas } = location.state || {
        dadosRevisao: {},
        mudas: [],
        totalMudas: 0
    };

    // --- LÓGICA DE PAGINAÇÃO ---
    const [paginaAtual, setPaginaAtual] = useState(1);
    const ITENS_POR_PAGINA = 8;
    const listaMudasCompleta = Array.isArray(mudas) ? mudas : [];
    const totalPaginas = Math.ceil(listaMudasCompleta.length / ITENS_POR_PAGINA) || 1;
    const indiceUltimoItem = paginaAtual * ITENS_POR_PAGINA;
    const indicePrimeiroItem = indiceUltimoItem - ITENS_POR_PAGINA;
    const mudasPaginaAtual = listaMudasCompleta.slice(indicePrimeiroItem, indiceUltimoItem);
    const linhasVaziasCount = Math.max(0, ITENS_POR_PAGINA - mudasPaginaAtual.length);
    const linhasVazias = Array(linhasVaziasCount).fill(null);

    // --- FORMATAÇÃO DOS DADOS ---
    const instituicao = dadosRevisao?.instituicao || '____________________';
    const total = totalMudas || 0;
    const respDistribuicao = dadosRevisao?.responsavelDistribuicao || '____________________';
    const respRecebimento = dadosRevisao?.responsavelRecebimento || '____________________';

    const cidadeSede = dadosRevisao?.cidadeSede;
    const ufSede = dadosRevisao?.estadoSede;
    const textoSede = (cidadeSede && ufSede) ? `${cidadeSede} - ${ufSede}` : '____________________';

    const cidadeDist = dadosRevisao?.cidadeDistribuicao;
    const ufDist = dadosRevisao?.estadoDistribuicao;
    const textoDist = (cidadeDist && ufDist) ? `${cidadeDist} - ${ufDist}` : '____________________';

    let textoData = "___/___/_____";
    if (dadosRevisao?.dataEntrega) {
        const valorData = dadosRevisao.dataEntrega;
        if (typeof valorData === 'string' && valorData.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [ano, mes, dia] = valorData.split('-');
            textoData = `${dia}/${mes}/${ano}`;
        } else {
            try {
                const dataObj = new Date(valorData);
                if (!isNaN(dataObj.getTime())) {
                    textoData = dataObj.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                }
            } catch (e) {
                console.error("Erro data", e);
                textoData = valorData;
            }
        }
    }

    const handleEdit = () => navigate(-1);

    // --- AÇÃO DE EXPORTAR ---
    const handleExport = () => {
        window.print();

        const novaDistribuicao = {
            id: new Date().getTime(),
            instituicao: instituicao,
            cidade: cidadeDist || "N/A",
            estado: ufDist || "UF",
            dataEntrega: dadosRevisao?.dataEntrega || new Date().toISOString().split('T')[0],
            quantidade: total,
            responsavelRecebimento: respRecebimento,
            mudasDetalhadas: listaMudasCompleta 
        };

        setTimeout(() => {
            if (window.confirm("Deseja confirmar a distribuição e ir para o relatório?")) {
                navigate('/distribuicao-mudas', {
                    state: {
                        novaDistribuicao: novaDistribuicao,
                        tabDestino: 'relatorio-distribuicao'
                    }
                });
            }
        }, 500);
    };

    return (
        <div className="termo-compromisso">
            <div className="termo-compromisso__documento">
                <h2>TERMO DE COMPROMISSO E RESPONSABILIDADE</h2>

                <p className="termo-compromisso__texto">
                    Este documento oficializa a entrega de <strong>{total.toLocaleString()}</strong> mudas, realizada em <strong>{textoData}</strong> pela <strong>AFINK</strong>,
                    sediada em <strong>{textoSede}</strong> e representada neste ato pelo(a) Sr(a). <strong>{respDistribuicao}</strong>.
                    <br /><br />
                    A doação é destinada à instituição <strong>{instituicao}</strong> e recebida pelo(a) Sr(a). <strong>{respRecebimento}</strong>,
                    que destinará os exemplares para ações de plantio e distribuição no município de <strong>{textoDist}</strong>.
                    <br /><br />
                    Ao aceitar esta doação, a instituição beneficiária compromete-se a assumir a gestão e o cuidado integral das
                    espécies abaixo relacionadas, assegurando sua preservação:
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
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {totalPaginas > 1 && (
                    <div className="termo-compromisso__paginacao">
                        <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} onPaginaChange={setPaginaAtual} />
                    </div>
                )}

                {/* === ASSINATURAS === */}
                <div className="assinaturas-container">
                    <div className="assinatura-box">
                        <div className="assinatura-linha"></div>
                        <small>Responsável AFINK</small>
                    </div>
                    <div className="assinatura-box">
                        <div className="assinatura-linha"></div>  
                        <small>Responsável {instituicao}</small>
                    </div>
                </div>

                <div className="termo-compromisso__actions">
                    <button type="button" className="termo-compromisso__button termo-compromisso__button--secondary" onClick={handleEdit}>
                        <FaEdit /> Voltar / Editar
                    </button>
                    <button type="button" className="termo-compromisso__button termo-compromisso__button--primary" onClick={handleExport}>
                        <FaFileExport /> Confirmar e Imprimir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermoCompromisso;