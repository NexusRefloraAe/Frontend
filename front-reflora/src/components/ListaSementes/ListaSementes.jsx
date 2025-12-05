import { useState } from "react"
import LinhaSemente from "./LinhaSemente"
import Paginacao from "../Paginacao/Paginacao"
import ModalDetalheSemente from "../ModalDetalheSemente/ModalDetalheSemente"
import ExportButton from "../ExportButton/ExportButton"
//Icons
import search from '../../assets/search.svg'
import arrows from '../../assets/arrows-up-down.svg'
import share from '../../assets/Share.svg'

function Listasementes({ sementes }) {

    const [termoBusca, setTermoBusca] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [sementeSelecionada, setSementeSelecionada] = useState(null);

    const itensPorPagina = 7;

    const colunasparaExportar = [
        { label: 'Lote', key: 'id' },
        { label: 'Data Cadastro', key: 'dataCadastro' },
        { label: 'Nome Popular', key: 'nome' },
        { label: 'Quantidade Atual (kg)', key: 'qtdAtual' },
        { label: 'Quantidade Saída (kg)', key: 'qtdSaida' },
        { label: 'Finalidade', key: 'finalidade' },
    ];

    const sementesFiltradas = sementes.filter((semente) =>
        semente.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
        semente.id.toLowerCase().includes(termoBusca.toLowerCase())
    );

    const indiceUltimoItem = paginaAtual * itensPorPagina;
    const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
    const sementesPaginaAtual = sementesFiltradas.slice(indicePrimeiroItem, indiceUltimoItem);

    const totalPaginas = Math.ceil(sementesFiltradas.length / itensPorPagina);

    const handleVerDetalhes = (semente) => {
        setSementeSelecionada(semente);
    };

    const handleFecharDetalhes = () => {
        setSementeSelecionada(null);
    };

    const handlePageChange = (novapagina) => {
        setPaginaAtual(novapagina);
    }

    return (
        <div>
            <section className="content-semente">
                <div className="header-content-semente">
                    <h1>Lista de Sementes Cadastradas</h1>
                    <div className="input-search">
                        <input type="text" placeholder='Pesquisar por lote ou nome' value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)} />
                        <img src={search} alt="" />
                    </div>
                </div>
                <div className="infos-sementes-card">
                    <table>
                        <thead>
                            <tr>
                                <th>Lote<img src={arrows} alt="Ordenar" /></th>
                                <th>Data Cadastro<img src={arrows} alt="Ordenar" /></th>
                                <th>Nome popular<img src={arrows} alt="Ordenar" /></th>
                                <th>Quantidade Atual<img src={arrows} alt="Ordenar" /></th>
                                <th>Quantidade Saida</th>
                                <th>Finalidade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sementesPaginaAtual.map((semente) => (
                                <LinhaSemente key={semente.id} semente={semente} onVerDetalhes={handleVerDetalhes} />
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="footer-content">
                    <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} onPaginaChange={handlePageChange} />
                    <ExportButton data={sementesFiltradas} columns={colunasparaExportar} fileName="sementes_exportadas" />
                </div>
            </section>

            {sementeSelecionada && (
                <ModalDetalheSemente
                    semente={sementeSelecionada}
                    onClose={handleFecharDetalhes}
                />
            )}
        </div>
    )
}

export default Listasementes
