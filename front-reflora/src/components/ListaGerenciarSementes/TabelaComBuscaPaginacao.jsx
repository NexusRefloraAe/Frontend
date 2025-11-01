import { useState } from "react";
import LinhaTabelaAcoes from "./LinhaTabelaAcoes";
import Paginacao from "../Paginacao/Paginacao";
import { FaSearch, FaShareAlt, FaArrowsAltV } from "react-icons/fa";
import "./TabelaComBuscaPaginacao.css";

function TabelaComBuscaPaginacao({
  titulo,
  dados,
  colunas,
  chaveBusca,
  onEditar,
  onConfirmar,
  onExcluir,
  itensPorPagina = 7,
  habilitarBusca = true, // ✅ nova prop para controlar a busca
}) {
  const [termoBusca, setTermoBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  const dadosFiltrados = habilitarBusca
    ? dados.filter((item) =>
        item[chaveBusca]?.toLowerCase().includes(termoBusca.toLowerCase())
      )
    : dados;

  const indiceUltimo = paginaAtual * itensPorPagina;
  const indicePrimeiro = indiceUltimo - itensPorPagina;
  const dadosPagina = dadosFiltrados.slice(indicePrimeiro, indiceUltimo);

  const totalPaginas = Math.ceil(dadosFiltrados.length / itensPorPagina);
  const temAcoes = onEditar || onConfirmar || onExcluir;

  return (
    <section className="historico-container-banco">
      <div className="historico-header-content-semente">
        <h1>{titulo}</h1>

        {/* ✅ Só mostra a busca se habilitarBusca for true */}
        {habilitarBusca && (
          <div className="historico-input-search">
            <input
              type="text"
              placeholder={`Pesquisar por ${colunas[0]?.label ?? "termo"}...`}
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
            <FaSearch className="icone-pesquisa" />
          </div>
        )}
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
              {temAcoes && <th>Ações</th>}
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
