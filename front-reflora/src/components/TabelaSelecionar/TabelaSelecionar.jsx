import React, { useState, useEffect } from "react";
import Paginacao from "../Paginacao/Paginacao";
import Button from "../Button/Button";
import { FaArrowsAltV } from "react-icons/fa";
import SearchBar from "../SearchBar/SearchBar";
import "./TabelaSelecionar.css";

function TabelaSelecionar({
  titulo,
  dados,
  colunas,
  chaveBusca,
  onSelecionar,
  onQuantidadeChange,
  onDetalheCanteiro,
  itensPorPagina = 7,
  habilitarBusca = true,
  modoBusca = "auto",
  chaveQuantidade = "quantidade",
  textoBotaoConfirmar = "Confirmar Saída",
  paginaAtual: paginaPai, // Propriedade do pai (servidor)
  totalPaginas: totalPaginasPai, // Propriedade do pai (servidor)
  onPageChange, // Função do pai (servidor)

  onOrdenar,
  ordemAtual,
  direcaoAtual
}) {
  const [termoBusca, setTermoBusca] = useState("");
  const [paginaInterna, setPaginaInterna] = useState(1); // Estado para modo local
  const [isLoading, setIsLoading] = useState(false);
  const [linhasSelecionadas, setLinhasSelecionadas] = useState({});
  const [quantidades, setQuantidades] = useState({});

  // 🔹 Define se a lógica segue o Servidor ou Interno
  const ehServidor = modoBusca === "server";
  
  // Define qual valor de página e total usar
  const paginaAtualEfetiva = ehServidor ? paginaPai : paginaInterna;
  const totalPaginasEfetivo = ehServidor ? totalPaginasPai : Math.ceil((habilitarBusca ? dados.filter(i => i[chaveBusca]?.toLowerCase().includes(termoBusca.toLowerCase())).length : dados.length) / itensPorPagina);

  const handleMudarPagina = (novaPagina) => {
    if (ehServidor) {
      onPageChange(novaPagina);
    } else {
      setPaginaInterna(novaPagina);
    }
  };

  // 🔹 Controla o tempo de busca (Apenas modo Auto)
  useEffect(() => {
    if (modoBusca === "auto") {
      setIsLoading(true);
      const timeout = setTimeout(() => setIsLoading(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [termoBusca, modoBusca]);

  // 🔹 Inicializar quantidades quando dados mudam
  useEffect(() => {
    const novasQuantidades = {};
    dados.forEach((item, index) => {
      novasQuantidades[index] = {
        saida: 0,
        disponivel: item[chaveQuantidade] || 0
      };
    });
    setQuantidades(novasQuantidades);
    // Resetar seleções ao mudar de página/dados para evitar bugs visuais
    setLinhasSelecionadas({});
  }, [dados, chaveQuantidade]);

  // 🔹 Lógica de Exibição dos Dados
  let dadosExibidos = [];

  if (ehServidor) {
    // No modo servidor, os dados recebidos já são a página correta. NÃO fatiar.
    dadosExibidos = dados;
  } else {
    // No modo auto, filtramos e fatiamos localmente
    const filtrados = habilitarBusca
      ? dados.filter((item) =>
          item[chaveBusca]?.toLowerCase().includes(termoBusca.toLowerCase())
        )
      : dados;
    
    const indiceUltimo = paginaInterna * itensPorPagina;
    const indicePrimeiro = indiceUltimo - itensPorPagina;
    dadosExibidos = filtrados.slice(indicePrimeiro, indiceUltimo);
  }

  const handleSearchManual = (valor) => {
    setIsLoading(true);
    // Se for servidor, o pai deve lidar com a busca, aqui apenas resetamos a página visual
    if (ehServidor) {
        // Se houver uma prop onSearchChange do pai, chame-a aqui
    }
    setTimeout(() => {
      setTermoBusca(valor);
      ehServidor ? onPageChange(1) : setPaginaInterna(1);
      setIsLoading(false);
    }, 500);
  };

  const handleSelecionarLinha = (index) => {
    setLinhasSelecionadas(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleLocalQuantidadeChange = (index, valor) => {
    const valorNumerico = Math.max(0, parseInt(valor) || 0);
    const disponivel = quantidades[index]?.disponivel || 0;
    const quantidadeFinal = Math.min(valorNumerico, disponivel);
    
    setQuantidades(prev => ({
      ...prev,
      [index]: { ...prev[index], saida: quantidadeFinal }
    }));

    if (onQuantidadeChange) {
      onQuantidadeChange(dadosExibidos[index], quantidadeFinal);
    }
  };

  const handleConfirmarSelecao = () => {
    const selecionados = [];
    Object.keys(linhasSelecionadas).forEach(index => {
      const idx = parseInt(index);
      if (linhasSelecionadas[idx] && quantidades[idx]?.saida > 0) {
        selecionados.push({
          item: dadosExibidos[idx],
          quantidade: quantidades[idx].saida
        });
      }
    });

    if (onSelecionar) onSelecionar(selecionados);
  };

  const handleAbrirDetalheCanteiro = (canteiro) => {
    if (onDetalheCanteiro) onDetalheCanteiro(canteiro);
  };

  const temSelecionados = Object.values(linhasSelecionadas).some(sel => sel);

  return (
    <div className="tabela-selecionar-wrapper">
      <div className="tabela-selecionar-header">
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

      <div className="tabela-selecionar-content">
        <table>
          <thead>
            <tr>
              <th>Selecionar</th>
              {colunas.map((coluna) => (
                <th key={coluna.key} onClick={() => onOrdenar && onOrdenar(coluna.key)}>
                  {coluna.label}
                  {ordemAtual === coluna.key || (ordemAtual === 'quantidadePlantada' && coluna.key === 'Quantidade') || (ordemAtual === 'nomePopularSemente' && coluna.key === 'NomePopular') ? (
                        direcaoAtual === 'asc' ? <FaArrowsAltV className="icone-ordenar"/> : <FaArrowsAltV className="icone-ordenar"/>
                    ) : (
                        <FaArrowsAltV className="icone-ordenar" />
                    )}
                </th>
              ))}
              <th>Quantidade Saída</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={colunas.length + 2}>
                  <div className="loading-text">Carregando...</div>
                </td>
              </tr>
            ) : dadosExibidos.length > 0 ? (
              dadosExibidos.map((item, index) => {
                const quantidadeInfo = quantidades[index] || { saida: 0, disponivel: 0 };
                const isSelecionado = linhasSelecionadas[index];

                return (
                  <tr key={index} className={isSelecionado ? "linha-selecionada" : ""}>
                    <td>
                      <input
                        type="checkbox"
                        checked={!!isSelecionado}
                        onChange={() => handleSelecionarLinha(index)}
                        className="checkbox-selecao"
                      />
                    </td>
                    {colunas.map((coluna) => (
                      <td key={coluna.key}>
                        {coluna.key === "NomeCanteiro" ? (
                          <button
                            className="nome-canteiro-clicavel"
                            onClick={() => handleAbrirDetalheCanteiro(item)}
                          >
                            <strong>{item[coluna.key]}</strong>
                          </button>
                        ) : (
                          item[coluna.key]
                        )}
                      </td>
                    ))}
                    <td>
                      <input
                        type="number"
                        min="0"
                        max={quantidadeInfo.disponivel}
                        value={quantidadeInfo.saida}
                        onChange={(e) => handleLocalQuantidadeChange(index, e.target.value)}
                        disabled={!isSelecionado}
                        className="input-quantidade"
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={colunas.length + 2}>
                  <div className="no-results">Nenhum resultado encontrado 😕</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="tabela-selecionar-footer">
        <Paginacao
          paginaAtual={paginaAtualEfetiva}
          totalPaginas={totalPaginasEfetivo}
          onPaginaChange={handleMudarPagina}
        />
        <Button 
          variant={temSelecionados ? "primary" : "secondary"}
          onClick={handleConfirmarSelecao}
          disabled={!temSelecionados}
          className="botao-confirmar-saida"
        >
          {textoBotaoConfirmar}
        </Button>
      </div>
    </div>
  );
}

export default TabelaSelecionar;