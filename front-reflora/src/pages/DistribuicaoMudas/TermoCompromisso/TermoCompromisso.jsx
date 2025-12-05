import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Paginacao from '../../../components/Paginacao/Paginacao';
import './TermoCompromisso.css';

const TermoCompromisso = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Fallback de dados (com Araruna / Cacimba de Dentro)
    const fallbackState = {
        dadosRevisao: {
            instituicao: 'SEMAS',
            cidadeSede: 'ARARUNA',
            cidadeDistribuicao: 'CACIMBA DE DENTRO',
            responsavelRecebimento: 'THAIGO FARIAS'
        },
        mudas: [
            { nome: 'Ipê-branco', quantidade: 4000 },
            { nome: 'Ipê-Amarelo', quantidade: 3000 },
            { nome: 'Ipê-roxo', quantidade: 4000 },
            { nome: 'Pau-Brasil', quantidade: 100 },
            { nome: 'Sibipiruna', quantidade: 50 },
            { nome: 'Jacarandá', quantidade: 75 },
            { nome: 'Angico', quantidade: 200 },
            { nome: 'Jatobá', quantidade: 30 },
            { nome: 'Muda Teste 9', quantidade: 10 },
        ],
        totalMudas: 11000
    };

    const { dadosRevisao, mudas, totalMudas } = location.state || fallbackState;

    // --- LÓGICA DE PAGINAÇÃO ---
    const [paginaAtual, setPaginaAtual] = useState(1);
    const ITENS_POR_PAGINA = 8; // 8 linhas por página

    const listaMudasCompleta = mudas || [];
    const totalPaginas = Math.ceil(listaMudasCompleta.length / ITENS_POR_PAGINA);

    const indiceUltimoItem = paginaAtual * ITENS_POR_PAGINA;
    const indicePrimeiroItem = indiceUltimoItem - ITENS_POR_PAGINA;
    const mudasPaginaAtual = listaMudasCompleta.slice(indicePrimeiroItem, indiceUltimoItem);

    const linhasVaziasCount = Math.max(0, ITENS_POR_PAGINA - mudasPaginaAtual.length);
    const linhasVazias = Array(linhasVaziasCount).fill(null);
    // --- FIM PAGINAÇÃO ---

    const instituicao = dadosRevisao.instituicao || '_______';
    const municipioSede = dadosRevisao.cidadeSede || '_______';
    const municipioDist = dadosRevisao.cidadeDistribuicao || '_______';
    const responsavel = dadosRevisao.responsavelRecebimento || '_______';
    const total = totalMudas || 0;

    const handleEdit = () => navigate(-1);
    const handleExport = () => window.print();

    return (
        // 1. O container RAIZ (fundo cinza)
        <div className="termo-compromisso">

            {/* 2. O "PAPEL" BRANCO (agora contém TUDO, incluindo botões) */}
            <div className="termo-compromisso__documento">
                <h2>TERMO DE COMPROMISSO E RESPONSABILIDADE</h2>

                <p className="termo-compromisso__texto">
                    A AFINK (...) declara a
                    doação de <strong>{total}</strong> mudas para <strong>{instituicao}</strong> no município de <strong>{municipioSede}</strong> e município de
                    distribuição <strong>{municipioDist}</strong> que contará com a participação de <strong>{responsavel}</strong> e
                    que a partir desta data o presente município assumirá a inteira responsabilidade e a direção de
                    todos os serviços de cuidados com estas mudas.
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

                {/* Paginação (DENTRO do "papel") */}
                {totalPaginas > 1 && (
                    <div className="termo-compromisso__paginacao">
                        <Paginacao
                            paginaAtual={paginaAtual}
                            totalPaginas={totalPaginas}
                            onPaginaChange={setPaginaAtual}
                        />
                    </div>
                )}

                {/* 3. BOTÕES (AGORA DENTRO do "papel") */}
                <div className="termo-compromisso__actions">
                    <button
                        type="button"
                        className="termo-compromisso__button termo-compromisso__button--secondary"
                        onClick={handleEdit}
                    >
                        Editar
                    </button>
                    <button
                        type="button"
                        className="termo-compromisso__button termo-compromisso__button--primary"
                        onClick={handleExport}
                    >
                        Exportar Termo
                    </button>
                </div>
            </div> 
            {/* Fim do termo-compromisso__documento */}
        </div>
    );
};

export default TermoCompromisso;