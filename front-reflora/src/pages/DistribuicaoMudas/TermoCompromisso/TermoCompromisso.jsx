import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Paginacao from '../../../components/Paginacao/Paginacao';
import { FaEdit, FaFileExport } from 'react-icons/fa'; 
import './TermoCompromisso.css';

const TermoCompromisso = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Fallback de dados para teste
    const fallbackState = {
        dadosRevisao: {
            instituicao: 'SEMAS',
            cidadeSede: 'ARARUNA',
            estadoSede: 'PB',
            cidadeDistribuicao: 'BAÍA DA TRAIÇÃO',
            estadoDistribuicao: 'PB',
            responsavelDistribuicao: 'MARCELO',      
            responsavelRecebimento: 'THAIGO FARIAS',
            dataEntrega: '' 
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

    // --- FORMATAÇÃO DOS DADOS ---
    const instituicao = dadosRevisao.instituicao || '_______';
    const total = totalMudas || 0;
    const respDistribuicao = dadosRevisao.responsavelDistribuicao || '_______';
    const respRecebimento = dadosRevisao.responsavelRecebimento || '_______';

    const cidadeSede = dadosRevisao.cidadeSede;
    const ufSede = dadosRevisao.estadoSede;
    const textoSede = (cidadeSede && ufSede) ? `${cidadeSede} - ${ufSede}` : (cidadeSede || '_______');

    const cidadeDist = dadosRevisao.cidadeDistribuicao;
    const ufDist = dadosRevisao.estadoDistribuicao;
    const textoDist = (cidadeDist && ufDist) ? `${cidadeDist} - ${ufDist}` : (cidadeDist || '_______');

    let textoData = "_______";
    if (dadosRevisao.dataEntrega) {
        if (dadosRevisao.dataEntrega.includes('-')) {
            const [ano, mes, dia] = dadosRevisao.dataEntrega.split('-');
            textoData = `${dia}/${mes}/${ano}`;
        } else {
            textoData = dadosRevisao.dataEntrega;
        }
    }

    const handleEdit = () => navigate(-1);

    // --- AÇÃO DE EXPORTAR E SALVAR (SIMULAÇÃO) ---
    const handleExport = () => {
        // 1. Abre a janela de impressão do navegador
        window.print();

        // 2. Prepara os dados para enviar ao Relatório
        const novaDistribuicao = {
            id: new Date().getTime(), // Gera um ID temporário
            instituicao: instituicao,
            cidade: cidadeDist || "Cidade",
            estado: ufDist || "UF",
            dataEntrega: dadosRevisao.dataEntrega, // Mantém formato original para ordenação
            quantidade: total,
            responsavelRecebimento: respRecebimento,
            mudasDetalhadas: mudas
        };

        // 3. Após fechar a impressão (ou imediato), navega para o Relatório
        // IMPORTANTE: Ajuste a rota '/distribuicao-mudas' para a rota principal onde fica o Layout de Abas
        // Enviamos 'activeTab' caso seu layout suporte troca automática de abas via state
        setTimeout(() => {
            if(window.confirm("Deseja confirmar a distribuição e ir para o relatório?")) {
                navigate('/distribuicao-mudas', { 
                    state: { 
                        novaDistribuicao: novaDistribuicao,
                        tabDestino: 'relatorio-distribuicao' // Dica para o TabsLayout abrir na aba certa
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
                    Este documento oficializa a entrega de <strong>{total}</strong> mudas, realizada em <strong>{textoData}</strong> pela <strong>AFINK</strong>, 
                    sediada em <strong>{textoSede}</strong> e representada neste ato pelo(a) Sr(a). <strong>{respDistribuicao}</strong>.
                    <br/><br/>
                    A doação é destinada à instituição <strong>{instituicao}</strong> e recebida pelo(a) Sr(a). <strong>{respRecebimento}</strong>, 
                    que destinará os exemplares para ações de plantio e distribuição no município de <strong>{textoDist}</strong>.
                    <br/><br/>
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
                                <td>-</td>
                                <td>0</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {totalPaginas > 1 && (
                    <div className="termo-compromisso__paginacao">
                        <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} onPaginaChange={setPaginaAtual} />
                    </div>
                )}

                <div className="assinaturas-container" style={{ marginTop: '60px', display: 'flex', justifyContent: 'space-between', gap: '40px' }}>
                     <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ borderTop: '1px solid #333', margin: '0 20px', paddingTop: '10px' }}></div>
                        <strong>{respDistribuicao}</strong><br/>
                        <small>Responsável AFINK</small>
                     </div>
                     <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ borderTop: '1px solid #333', margin: '0 20px', paddingTop: '10px' }}></div>
                        <strong>{respRecebimento}</strong><br/>
                        <small>Responsável {instituicao}</small>
                     </div>
                </div>

                <div className="termo-compromisso__actions">
                    <button type="button" className="termo-compromisso__button termo-compromisso__button--secondary" onClick={handleEdit}>
                        <FaEdit /> Editar
                    </button>
                    <button type="button" className="termo-compromisso__button termo-compromisso__button--primary" onClick={handleExport}>
                        <FaFileExport /> Exportar Termo
                    </button>
                </div>
            </div> 
        </div>
    );
};

export default TermoCompromisso;