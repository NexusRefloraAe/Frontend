// src/components/Tabela/TabelaComBuscaPaginacao.jsx
import { useState } from "react";
import LinhaTabelaAcoes from "./LinhaTabelaAcoes";
import Paginacao from "../../../components/Paginacao/Paginacao";
import { FaSearch, FaShareAlt, FaArrowsAltV } from "react-icons/fa";

function TabelaComBuscaPaginacao({
  titulo,
  dados,
  colunas,
  chaveBusca,
  onEditar,
  onConfirmar,
  onExcluir,
  itensPorPagina = 7,
}) {
  const [termoBusca, setTermoBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  const dadosFiltrados = dados.filter((item) =>
    item[chaveBusca]?.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const indiceUltimo = paginaAtual * itensPorPagina;
  const indicePrimeiro = indiceUltimo - itensPorPagina;
  const dadosPagina = dadosFiltrados.slice(indicePrimeiro, indiceUltimo);

  const totalPaginas = Math.ceil(dadosFiltrados.length / itensPorPagina);

  return (
    <section className="historico-container-banco">
      <div className="historico-header-content-semente">
        <h1>{titulo}</h1>
        <div className="historico-input-search">
          <input
            type="text"
            placeholder={`Pesquisar por ${chaveBusca}`}
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
          <FaSearch />
        </div>
      </div>

      <div className="historico-infos-sementes-card">
        <table>
          <thead>
            <tr>
              {colunas.map((coluna) => (
                <th key={coluna.key}>
                  {coluna.label} <FaArrowsAltV className="icone-ordenar" />
                </th>
              ))}
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {dadosPagina.map((item, index) => (
              <LinhaTabelaAcoes
                key={index}
                item={item}
                colunas={colunas}
                onEditar={onEditar}
                onConfirmar={onConfirmar}
                onExcluir={onExcluir}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="historico-footer-content">
        <Paginacao
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          onPaginaChange={setPaginaAtual}
        />
        <button className="btn-exportar">
          Exportar <FaShareAlt />
        </button>
      </div>
    </section>
  );
}

export default TabelaComBuscaPaginacao;
