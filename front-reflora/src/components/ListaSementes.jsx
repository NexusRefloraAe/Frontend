import { useState } from "react"

function Listasementes({ sementes }) {

    const [termoBusca, setTermoBusca] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 7;

    const sementesFiltradas = sementes.filter((semente) =>
        semente.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
        semente.id.toLowerCase().includes(termoBusca.toLowerCase())
    );

    const indiceUltimoItem = paginaAtual * itensPorPagina;
    const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
    const sementesPaginaAtual = sementesFiltradas.slice(indicePrimeiroItem, indiceUltimoItem);

    const totalPaginas = Math.ceil(sementesFiltradas.length / itensPorPagina);

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
                                <th>Lote   <img src={arrows} alt="Ordenar" /></th>
                                <th>Data Cadastro    <img src={arrows} alt="Ordenar" /></th>
                                <th>Nome popular    <img src={arrows} alt="Ordenar" /></th>
                                <th>Quantidade Atual <img src={arrows} alt="Ordenar" /></th>
                                <th>Quantidade Saida</th>
                                <th>Finalidade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sementesPaginaAtual.map((semente) => (
                                <LinhaSemente key={semente.id} semente={semente} />
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="footer-content">
                    <nav>
                        <ul>
                            <li><a href="#">Previous</a></li>
                            <li><a href="#" className='active'><span>1</span></a></li>
                            <li><a href="#">2</a></li>
                            <li><a href="#">3</a></li>
                            <li><a href="#">...</a></li>
                            <li><a href="#">67</a></li>
                            <li><a href="#">68</a></li>
                            <li><a href="#">Next</a></li>
                        </ul>
                    </nav>
                    <button>Exportar <img src={share} alt="" /></button>
                </div>
            </section>
        </div>
    )
}

export default Listasementes
