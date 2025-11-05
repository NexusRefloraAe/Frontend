import { useState, useEffect } from "react";
import LinhaTabelaAcoes from "./LinhaTabelaAcoes";
import Paginacao from "../Paginacao/Paginacao";
import { FaArrowsAltV } from "react-icons/fa";
import ExportButton from "../ExportButton/ExportButton";
import SearchBar from "../SearchBar/SearchBar";
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
  habilitarBusca = true,
  modoBusca = "auto", // 🔹 "auto" ou "manual"
}) {
  const [termoBusca, setTermoBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // 🔹 Controla o tempo de busca (simulando atraso real)
  useEffect(() => {
    if (modoBusca === "auto") {
      setIsLoading(true);
      const timeout = setTimeout(() => setIsLoading(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [termoBusca]);

  // 🔹 Filtragem de dados
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

  const handleSearchManual = (valor) => {
    setIsLoading(true);
    setTimeout(() => {
      setTermoBusca(valor);
      setPaginaAtual(1);
      setIsLoading(false);
    }, 500);
  };

  return (
    <section className="historico-container-banco">
      <div className="historico-header-content-semente">
        <h1>{titulo}</h1>

        {habilitarBusca && (
          <SearchBar
            value={termoBusca}
            onChange={setTermoBusca}
            onSearch={handleSearchManual}
            placeholder={`Pesquisar por ${colunas[1]?.label ?? "termo"}...`}
            modo={modoBusca}
            isLoading={isLoading}
          />
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
            {isLoading ? (
              <tr>
                <td colSpan={colunas.length + (temAcoes ? 1 : 0)}>
                  <div className="loading-text">Carregando...</div>
                </td>
              </tr>
            ) : dadosPagina.length > 0 ? (
              dadosPagina.map((item, index) => (
                <LinhaTabelaAcoes
                  key={index}
                  item={item}
                  colunas={colunas}
                  onEditar={onEditar}
                  onConfirmar={onConfirmar}
                  onExcluir={onExcluir}
                />
              ))
            ) : (
              <tr>
                <td colSpan={colunas.length + (temAcoes ? 1 : 0)}>
                  <div className="no-results">
                    Nenhum resultado encontrado 😕
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="historico-footer-content">
        <Paginacao
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          onPaginaChange={setPaginaAtual}
        />
        <ExportButton
          data={dadosFiltrados}
          columns={colunas}
          fileName={titulo || "relatorio"}
        />
      </div>
    </section>
  );
}

export default TabelaComBuscaPaginacao;
