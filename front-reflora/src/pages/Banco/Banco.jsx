import React from 'react'
import '../Banco/Banco.css'
import cadastrar from '../../assets/cadastrar.png'
import listar from '../../assets/listar.png'
import arrows from '../../assets/arrows-up-down.svg'
import search from '../../assets/search.svg'
import bell from '../../assets/bell.svg'

function Banco() {
    return (
        <div className="container-banco">
            <header className="title-content-banco">
                <h1>Banco de Sementes</h1>
                <img src={bell} alt="" />
            </header>
            <div className="content-banco">
                <nav className="bottons-banco">
                    <ul>
                        <li><button><img src={cadastrar} alt="Cadastrar Semente" />Cadastrar Semente</button></li>
                        <li><button><img src={listar} alt="Listar Sementes" />Listar Sementes</button></li>
                    </ul>
                </nav>
                <main>
                    <section className="content-semente">
                        <div className="header-content-semente">
                            <h1>Lista de Sementes Cadastradas</h1>
                            <div className="input-search">
                                <input type="text" placeholder='Pesquisar por lote ou nome' />
                                <img src={search} alt="" />
                            </div>
                        </div>
                        <div className="infos-sementes-card">
                            <table>
                                <tr>
                                    <th>Lote   <img src={arrows} alt="Ordenar"/></th>
                                    <th>Data Cadastro    <img src={arrows} alt="Ordenar"/></th>
                                    <th>Nome popular    <img src={arrows} alt="Ordenar"/></th>
                                    <th>Quantidade Atual <img src={arrows} alt="Ordenar"/></th>
                                    <th>Quantidade Saida</th>
                                    <th>Finalidade</th>
                                </tr>
                                <tr>
                                    <td>A001</td>
                                    <td>xx/xx/xxxx</td>
                                    <td>Ipê-amarelo</td>
                                    <td>2000 kg</td>
                                    <td>200 g</td>
                                    <td>Teste de germinação</td>
                                </tr>
                                <tr>
                                    <td>A001</td>
                                    <td>xx/xx/xxxx</td>
                                    <td>Ipê-amarelo</td>
                                    <td>2000 kg</td>
                                    <td>200 g</td>
                                    <td>Teste de germinação</td>
                                </tr>
                                <tr>
                                    <td>A001</td>
                                    <td>xx/xx/xxxx</td>
                                    <td>Ipê-amarelo</td>
                                    <td>2000 kg</td>
                                    <td>200 g</td>
                                    <td>Teste de germinação</td>
                                </tr>
                                <tr>
                                    <td>A001</td>
                                    <td>xx/xx/xxxx</td>
                                    <td>Ipê-amarelo</td>
                                    <td>2000 kg</td>
                                    <td>200 g</td>
                                    <td>Teste de germinação</td>
                                </tr>
                                <tr>
                                    <td>A001</td>
                                    <td>xx/xx/xxxx</td>
                                    <td>Ipê-amarelo</td>
                                    <td>2000 kg</td>
                                    <td>200 g</td>
                                    <td>Teste de germinação</td>
                                </tr>
                                <tr>
                                    <td>A001</td>
                                    <td>xx/xx/xxxx</td>
                                    <td>Ipê-amarelo</td>
                                    <td>2000 kg</td>
                                    <td>200 g</td>
                                    <td>Teste de germinação</td>
                                </tr>
                            </table>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}

export default Banco
