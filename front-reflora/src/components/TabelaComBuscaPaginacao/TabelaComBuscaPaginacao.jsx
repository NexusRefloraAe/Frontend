import { useState, useEffect, useRef } from "react";
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
  onVisualizar,
  onExcluir,
  itensPorPagina = 5,
  habilitarBusca = true,
  modoBusca = "auto",
  onExportPDF,
  onExportCSV,
  onPesquisar, // Função do Back-end
  footerContent,
  placeholderBusca,
  isLoading: isLoadingProp = false,
  onOrdenar,
  ordemAtual,
  direcaoAtual,
  // Props de Paginação Externa (Importantes para o modo Servidor)
  paginaAtual: paginaExterna,
  totalPaginas: totalPaginasExterno,
  onPaginaChange: onPaginaChangeExterno,
}) {
  const [termoBusca, setTermoBusca] = useState("");
  const [paginaAtualLocal, setPaginaAtualLocal] = useState(1);
  const [localLoading, setLocalLoading] = useState(false);

  const isLoading = isLoadingProp || localLoading;
  const isServerSide = !!onPesquisar;
  const isFirstRender = useRef(true);

  // --- LÓGICA DE DEFINIÇÃO DE ESTADO (HÍBRIDA) ---
  // Se for Servidor, usamos o que vem do Pai. Se for Local, usamos o estado interno.
  const pagAtualExibicao = isServerSide ? paginaExterna : paginaAtualLocal;

  const totalPaginasExibicao = isServerSide
    ? totalPaginasExterno
    : Math.ceil(dados.length / itensPorPagina);

  // Função para gerenciar a troca de página corretamente
  const handleTrocaPagina = (novaPagina) => {
    if (isServerSide && onPaginaChangeExterno) {
      // Avisa o componente pai (ex: GerarRelatorio) para buscar no banco
      onPaginaChangeExterno(novaPagina);
    } else {
      // Muda localmente para tabelas simples
      setPaginaAtualLocal(novaPagina);
    }
  };

  // --- EFEITO DE BUSCA (Debounce) ---
  useEffect(() => {
    if (!isServerSide || !habilitarBusca) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setLocalLoading(true);
    const timeoutId = setTimeout(() => {
      onPesquisar(termoBusca);
      // Ao pesquisar, resetamos para a primeira página no pai ou localmente
      if (onPaginaChangeExterno) onPaginaChangeExterno(1);
      setPaginaAtualLocal(1);
      setLocalLoading(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [termoBusca]);

  // --- LÓGICA DE EXIBIÇÃO ---
  let dadosParaExibir = [];

  if (isServerSide) {
    // No modo servidor, 'dados' já contém apenas a fatia da página atual vinda da API
    dadosParaExibir = dados;
  } else {
    // No modo local, filtramos e fatiamos o array completo aqui no front
    const dadosFiltrados = habilitarBusca && chaveBusca
      ? dados.filter((item) =>
          item[chaveBusca]?.toString().toLowerCase().includes(termoBusca.toLowerCase())
        )
      : dados;

    const indiceUltimo = pagAtualExibicao * itensPorPagina;
    const indicePrimeiro = indiceUltimo - itensPorPagina;
    dadosParaExibir = dadosFiltrados.slice(indicePrimeiro, indiceUltimo);
  }

  const temAcoes = !!(onEditar || onVisualizar || onExcluir);

  return (
    <section className="historico-container-banco">
      <div className="historico-header-content-semente">
        <h1>{titulo}</h1>
        {habilitarBusca && (
          <SearchBar
            value={termoBusca}
            onChange={(v) => setTermoBusca(v)}
            onSearch={(v) => setTermoBusca(v)}
            placeholder={placeholderBusca || `Pesquisar por ${colunas[1]?.label ?? "termo"}...`}
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
                <th
                  key={coluna.key}
                  onClick={() => {
                    if (coluna.sortable && onOrdenar) {
                      onOrdenar(coluna.sortKey || coluna.key);
                    }
                  }}
                  style={{
                    cursor: coluna.sortable ? "pointer" : "default",
                    userSelect: "none",
                    textAlign: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                    {coluna.label}
                    {coluna.sortable && (
                      <FaArrowsAltV
                        className="icone-ordenar"
                        style={{
                          opacity: ordemAtual === (coluna.sortKey || coluna.key) ? 1 : 0.3,
                          transform:
                            ordemAtual === (coluna.sortKey || coluna.key) && direcaoAtual === "asc"
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          transition: "transform 0.2s",
                        }}
                      />
                    )}
                  </div>
                </th>
              ))}
              {temAcoes && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={colunas.length + (temAcoes ? 1 : 0)}>
                  <div className="loading-text">Buscando...</div>
                </td>
              </tr>
            ) : dadosParaExibir && dadosParaExibir.length > 0 ? (
              dadosParaExibir.map((item, index) => (
                <LinhaTabelaAcoes
                  key={item.id || index}
                  item={item}
                  colunas={colunas}
                  onEditar={onEditar}
                  onVisualizar={onVisualizar}
                  onExcluir={onExcluir}
                />
              ))
            ) : (
              <tr>
                <td colSpan={colunas.length + (temAcoes ? 1 : 0)}>
                  <div className="no-results">Nenhum resultado encontrado 😕</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="historico-footer-content">
        {footerContent ? (
          footerContent
        ) : (
          <>
            <Paginacao
              paginaAtual={pagAtualExibicao}
              totalPaginas={totalPaginasExibicao}
              onPaginaChange={handleTrocaPagina}
            />
            <ExportButton
              data={dados}
              columns={colunas}
              fileName={titulo || "relatorio"}
              onExportPDF={onExportPDF}
              onExportCSV={onExportCSV}
            />
          </>
        )}
      </div>
    </section>
  );
}

export default TabelaComBuscaPaginacao;