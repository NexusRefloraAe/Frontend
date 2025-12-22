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
  onConfirmar,
  onExcluir,
  itensPorPagina = 5,
  habilitarBusca = true,
  modoBusca = "auto",
  onExportPDF,
  onExportCSV,
  onPesquisar,   // Função do Back-end
  footerContent, 
  placeholderBusca,
  isLoading: isLoadingProp = false, // Recebe o loading do Pai
  onOrdenar,
  ordemAtual,
  direcaoAtual
}) {
  const [termoBusca, setTermoBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  // Controle local de loading para o debounce visual
  const [localLoading, setLocalLoading] = useState(false);

  // O loading final é: ou o Pai está carregando, ou estamos no debounce local
  const isLoading = isLoadingProp || localLoading;

  const isServerSide = !!onPesquisar; 
  
  // Ref para impedir a busca automática na primeira renderização (mount)
  const isFirstRender = useRef(true);

  // --- EFEITO MÁGICO (Busca Automática com Debounce) ---
  useEffect(() => {
    // Se não for server-side ou a busca estiver desabilitada, não faz nada
    if (!isServerSide || !habilitarBusca) return;

    // Pula a primeira renderização (pois o Pai já carregou os dados iniciais)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Ativa o loading visualmente enquanto o usuário espera o debounce
    setLocalLoading(true);

    // Cria o delay de 500ms
    const timeoutId = setTimeout(() => {
      // Chama a função do pai (Back-end)
      onPesquisar(termoBusca);
      
      // Reseta paginação e tira o loading
      setPaginaAtual(1);
      setLocalLoading(false);
    }, 500);

    // Função de limpeza: Se o usuário digitar antes dos 500ms, cancela o timeout anterior
    return () => clearTimeout(timeoutId);
    
    // IMPORTANTE: Depende apenas de 'termoBusca'. 
    // Não coloque 'onPesquisar' aqui a menos que use useCallback no pai.
  }, [termoBusca]); 
  // -----------------------------------------------------

  // --- LÓGICA DE EXIBIÇÃO ---
  let dadosParaExibir = [];

  if (isServerSide) {
    dadosParaExibir = dados;
  } else {
    // Filtragem local (Client-Side)
    const dadosFiltrados = habilitarBusca && chaveBusca
      ? dados.filter((item) =>
          item[chaveBusca]?.toString().toLowerCase().includes(termoBusca.toLowerCase())
        )
      : dados;

    const indiceUltimo = paginaAtual * itensPorPagina;
    const indicePrimeiro = indiceUltimo - itensPorPagina;
    dadosParaExibir = dadosFiltrados.slice(indicePrimeiro, indiceUltimo);
  }

  const totalPaginasClient = Math.ceil((isServerSide ? dados.length : dados.length) / itensPorPagina);
  const temAcoes = onEditar || onConfirmar || onExcluir;

  // Função simples apenas para atualizar o input
  const handleInputChange = (valor) => {
    setTermoBusca(valor); 
    // O useEffect acima perceberá a mudança e fará a mágica
  };

  return (
    <section className="historico-container-banco">
      <div className="historico-header-content-semente">
        <h1>{titulo}</h1>

        {habilitarBusca && (
          <SearchBar
            value={termoBusca}
            onChange={handleInputChange} // Atualiza estado -> Dispara useEffect
            onSearch={handleInputChange} // Botão de lupa faz o mesmo (opcional no modo auto)
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
                  // --- LÓGICA DO CLIQUE PARA ORDENAR ---
                  onClick={() => {
                      // Usa sortKey se existir (nome no banco), senão usa key visual
                      if (coluna.sortable && onOrdenar) {
                          onOrdenar(coluna.sortKey || coluna.key);
                      }
                  }}
                  style={{ 
                      cursor: coluna.sortable ? 'pointer' : 'default',
                      userSelect: 'none', // Evita selecionar o texto ao clicar rápido
                      textAlign: 'center'
                  }}
                >
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'}}>
                      {coluna.label} 
                      
                      {/* --- ÍCONE COM FEEDBACK VISUAL --- */}
                      {coluna.sortable && (
                        <FaArrowsAltV 
                            className="icone-ordenar" 
                            style={{
                                // Opacidade: 1 se for a coluna ativa, 0.3 se inativa
                                opacity: (ordemAtual === (coluna.sortKey || coluna.key)) ? 1 : 0.3,
                                // Rotação: Gira 180 se for ASC, 0 se for DESC
                                transform: (ordemAtual === (coluna.sortKey || coluna.key) && direcaoAtual === 'asc') 
                                    ? 'rotate(180deg)' 
                                    : 'rotate(0deg)',
                                transition: 'transform 0.2s'
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

      {footerContent ? (
        <div className="historico-footer-content">
            {footerContent}
        </div>
      ) : (
        <div className="historico-footer-content">
          <Paginacao
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginasClient}
            onPaginaChange={setPaginaAtual}
          />
          <ExportButton
            data={dados}
            columns={colunas}
            fileName={titulo || "relatorio"}
            onExportPDF={onExportPDF}
            onExportCSV={onExportCSV}
          />
        </div>
      )}
    </section>
  );
}

export default TabelaComBuscaPaginacao;