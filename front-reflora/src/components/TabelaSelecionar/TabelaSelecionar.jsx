import { useState, useEffect } from "react";
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
  onDetalheCanteiro, // Nova prop para abrir detalhes do canteiro
  itensPorPagina = 7,
  habilitarBusca = true,
  modoBusca = "auto",
  chaveQuantidade = "quantidade",
  textoBotaoConfirmar = "Confirmar Saída"
}) {
  const [termoBusca, setTermoBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [linhasSelecionadas, setLinhasSelecionadas] = useState({});
  const [quantidades, setQuantidades] = useState({});

  // 🔹 Controla o tempo de busca
  useEffect(() => {
    if (modoBusca === "auto") {
      setIsLoading(true);
      const timeout = setTimeout(() => setIsLoading(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [termoBusca]);

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
  }, [dados, chaveQuantidade]);

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

  const handleSearchManual = (valor) => {
    setIsLoading(true);
    setTimeout(() => {
      setTermoBusca(valor);
      setPaginaAtual(1);
      setIsLoading(false);
    }, 500);
  };

  const handleSelecionarLinha = (index) => {
    setLinhasSelecionadas(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleQuantidadeChange = (index, valor) => {
    const valorNumerico = Math.max(0, parseInt(valor) || 0);
    const disponivel = quantidades[index]?.disponivel || 0;
    
    // Não permite quantidade maior que o disponível
    const quantidadeFinal = Math.min(valorNumerico, disponivel);
    
    setQuantidades(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        saida: quantidadeFinal
      }
    }));

    if (onQuantidadeChange) {
      onQuantidadeChange(dadosPagina[index], quantidadeFinal);
    }
  };

  const handleConfirmarSelecao = () => {
    const selecionados = [];
    Object.keys(linhasSelecionadas).forEach(index => {
      if (linhasSelecionadas[index] && quantidades[index]?.saida > 0) {
        selecionados.push({
          item: dadosPagina[parseInt(index)],
          quantidade: quantidades[index].saida
        });
      }
    });

    if (onSelecionar) {
      onSelecionar(selecionados);
    }
  };

  // 🔹 Nova função para abrir detalhes do canteiro
  const handleAbrirDetalheCanteiro = (canteiro) => {
    if (onDetalheCanteiro) {
      onDetalheCanteiro(canteiro);
    }
  };

  const temSelecionados = Object.values(linhasSelecionadas).some(selecionado => selecionado);

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
                <th key={coluna.key}>
                  {coluna.label} <FaArrowsAltV className="icone-ordenar" />
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
            ) : dadosPagina.length > 0 ? (
              dadosPagina.map((item, index) => {
                const quantidadeInfo = quantidades[index] || { saida: 0, disponivel: 0 };
                const isSelecionado = linhasSelecionadas[index];

                return (
                  <tr key={index} className={isSelecionado ? "linha-selecionada" : ""}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelecionado}
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
                            title="Clique para ver detalhes do canteiro"
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
                        onChange={(e) => handleQuantidadeChange(index, e.target.value)}
                        disabled={!isSelecionado}
                        className="input-quantidade"
                        placeholder="0"
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={colunas.length + 2}>
                  <div className="no-results">
                    Nenhum resultado encontrado 😕
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="tabela-selecionar-footer">
        <Paginacao
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          onPaginaChange={setPaginaAtual}
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