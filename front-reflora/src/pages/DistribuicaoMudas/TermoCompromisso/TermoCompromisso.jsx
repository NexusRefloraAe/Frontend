import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Paginacao from '../../../components/Paginacao/Paginacao';
import { FaEdit, FaFileExport } from 'react-icons/fa';
import { distribuicaoService } from '../../../services/distribuicaoService';
import { getBackendErrorMessage } from '../../../utils/errorHandler';
import './TermoCompromisso.css';

const TermoCompromisso = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // 1. DADOS SEGUROS (Garantia de integridade dos dados vindos da Revisão)
    const { dadosRevisao, mudas, totalMudas } = location.state || {
        dadosRevisao: {},
        mudas: [],
        totalMudas: 0
    };

    // --- LÓGICA DE PAGINAÇÃO E LAYOUT (Mantém a estética da tabela com 8 linhas) ---
    const [paginaAtual, setPaginaAtual] = useState(1);
    const ITENS_POR_PAGINA = 8;
    const listaMudasCompleta = Array.isArray(mudas) ? mudas : [];
    const totalPaginas = Math.ceil(listaMudasCompleta.length / ITENS_POR_PAGINA) || 1;
    
    const mudasPaginaAtual = listaMudasCompleta.slice(
        (paginaAtual - 1) * ITENS_POR_PAGINA, 
        paginaAtual * ITENS_POR_PAGINA
    );

    const linhasVaziasCount = Math.max(0, ITENS_POR_PAGINA - mudasPaginaAtual.length);
    const linhasVazias = Array(linhasVaziasCount).fill(null);

    // --- FORMATAÇÃO DOS DADOS DE LOCALIZAÇÃO (Sede vs Distribuição) ---
    const instituicao = dadosRevisao?.instituicao || '____________________';
    const respDistribuicao = dadosRevisao?.responsavelDistribuicao || '____________________';
    const respRecebimento = dadosRevisao?.responsavelRecebimento || '____________________';

    // 💡 Formatação da Sede (Onde a AFINK está)
    const cidadeSede = dadosRevisao?.municipioSede || dadosRevisao?.cidadeSede;
    const textoSede = (cidadeSede && dadosRevisao?.estadoSede) 
        ? `${cidadeSede} - ${dadosRevisao.estadoSede}` 
        : '____________________';

    // 💡 Formatação da Distribuição (Para onde as mudas vão)
    const cidadeDist = dadosRevisao?.municipioDistribuicao || dadosRevisao?.cidadeDistribuicao;
    const textoDist = (cidadeDist && dadosRevisao?.estadoDistribuicao) 
        ? `${cidadeDist} - ${dadosRevisao.estadoDistribuicao}` 
        : '____________________';

    const formatarDataExibicao = (valorData) => {
        if (!valorData) return "___/___/_____";
        if (typeof valorData === 'string' && valorData.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [ano, mes, dia] = valorData.split('-');
            return `${dia}/${mes}/${ano}`;
        }
        return valorData;
    };

    // 💡 AÇÃO DE EFETIVAR NO BANCO E BAIXAR O PDF OFICIAL
    const handleConfirmarESalvar = async () => {
        try {
            setLoading(true);

            const payload = {
                responsavelDistribuicao: dadosRevisao.responsavelDistribuicao,
                responsavelRecebimento: dadosRevisao.responsavelRecebimento,
                instituicao: dadosRevisao.instituicao,
                estadoSede: dadosRevisao.estadoSede,
                municipioSede: cidadeSede,
                estadoDistribuicao: dadosRevisao.estadoDistribuicao,
                municipioDistribuicao: cidadeDist,
                dataEntrega: formatarDataExibicao(dadosRevisao.dataEntrega),
                itens: listaMudasCompleta.map(m => ({
                    canteiroId: m.canteiroId, 
                    quantidade: m.quantidade
                }))
            };

            const distribuicaoSalva = await distribuicaoService.salvar(payload);

            const pdfBlob = await distribuicaoService.baixarTermoPdf(distribuicaoSalva.id);
            const url = window.URL.createObjectURL(new Blob([pdfBlob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Termo_AFINK_${distribuicaoSalva.id}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            alert("Distribuição confirmada com sucesso!");
            navigate('/distribuicao-mudas', { state: { tabDestino: 'relatorio-distribuicao' } });

        } catch (error) {
            alert(`Erro ao salvar: ${getBackendErrorMessage(error)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="termo-compromisso">
            <div className="termo-compromisso__documento">
                <h2>TERMO DE COMPROMISSO E RESPONSABILIDADE</h2>

                <p className="termo-compromisso__texto">
                    Este documento oficializa a entrega de <strong>{totalMudas.toLocaleString()}</strong> mudas, realizada em <strong>{formatarDataExibicao(dadosRevisao.dataEntrega)}</strong> pela <strong>AFINK</strong>,
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
                        <tr><th>Espécie</th><th>Quantidade</th></tr>
                    </thead>
                    <tbody>
                        {mudasPaginaAtual.map((muda, index) => (
                            <tr key={`muda-${index}`}>
                                <td>{muda.nome}</td>
                                <td>{muda.quantidade.toLocaleString()}</td>
                            </tr>
                        ))}
                        {linhasVazias.map((_, index) => (
                            <tr key={`vazio-${index}`}><td>&nbsp;</td><td>&nbsp;</td></tr>
                        ))}
                    </tbody>
                </table>

                {totalPaginas > 1 && (
                    <div className="termo-compromisso__paginacao">
                        <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} onPaginaChange={setPaginaAtual} />
                    </div>
                )}

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
                    <button type="button" className="termo-compromisso__button termo-compromisso__button--secondary" onClick={() => navigate(-1)} disabled={loading}>
                        <FaEdit /> Voltar / Editar
                    </button>
                    <button type="button" className="termo-compromisso__button termo-compromisso__button--primary" onClick={handleConfirmarESalvar} disabled={loading}>
                        <FaFileExport /> {loading ? "Salvando..." : "Confirmar e Imprimir"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermoCompromisso;