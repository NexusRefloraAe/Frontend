import React, { useState, useEffect, useCallback } from "react";
import insumoService from "../../../services/insumoService";
import ModalExcluir from "../../../components/ModalExcluir/ModalExcluir";
// Importe seus componentes de Edição se quiser editar por aqui também
import ListaInsumos from "../../../components/ListaInsumos/ListaInsumos";
// IMPORTA O NOVO MODAL
import EditarCadastroInsumo from "./EditarCadastroInsumo";

const GerenciarInsumos = () => {
  // Lista completa (todos os dados vindos do banco)
  const [todosInsumos, setTodosInsumos] = useState([]);
  // Lista filtrada (pela busca)
  const [insumosFiltrados, setInsumosFiltrados] = useState([]);

  const [loading, setLoading] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");

  // Estados de Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const ITENS_POR_PAGINA = 10; // Defina quantos itens quer por página

  // Estados dos Modais
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [itemParaExcluir, setItemParaExcluir] = useState(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [itemParaEditar, setItemParaEditar] = useState(null);

  // 1. Busca TUDO do backend
  const fetchInsumos = useCallback(async () => {
    setLoading(true);
    try {
      const dados = await insumoService.getAll();
      setTodosInsumos(dados);
      setInsumosFiltrados(dados); // Inicialmente, filtrados = todos
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar insumos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsumos();
  }, [fetchInsumos]);

  // 2. Efeito para filtrar quando o usuário digita
  useEffect(() => {
    let resultados = todosInsumos;
    if (termoBusca) {
      resultados = todosInsumos.filter((i) =>
        i.nome.toLowerCase().includes(termoBusca.toLowerCase())
      );
    }
    setInsumosFiltrados(resultados);
    setPaginaAtual(1); // Volta pra página 1 se filtrar
  }, [termoBusca, todosInsumos]);

  // 3. Lógica de Paginação (O "Pulo do Gato")
  // Calcula o índice inicial e final para "fatiar" o array
  const indexUltimoItem = paginaAtual * ITENS_POR_PAGINA;
  const indexPrimeiroItem = indexUltimoItem - ITENS_POR_PAGINA;
  const insumosAtuais = insumosFiltrados.slice(
    indexPrimeiroItem,
    indexUltimoItem
  );

  // Calcula total de páginas baseado no tamanho da lista filtrada
  const totalPaginas = Math.ceil(insumosFiltrados.length / ITENS_POR_PAGINA);

  // --- AÇÕES ---
  const handleSolicitarExclusao = (item) => {
    setItemParaExcluir(item);
    setModalExcluirAberto(true);
  };

  const handleConfirmarExclusao = async () => {
    if (!itemParaExcluir) return;
    try {
      await insumoService.delete(itemParaExcluir.id);
      alert("Insumo excluído!");
      setModalExcluirAberto(false);
      setItemParaExcluir(null);
      fetchInsumos();
    } catch (error) {
      alert("Erro ao excluir.");
    }
  };

  const handleExportar = async (formato) => {
    // Prepara os parâmetros baseados nos seus estados de filtro
    const params = {
      tipoInsumo: "FERRAMENTA", // Hardcoded pois este é o histórico de ferramentas
      dataInicio: filtros.dataInicio || null,
      dataFim: filtros.dataFim || null,
    };

    try {
      if (formato === "pdf") {
        await insumoService.downloadPdf(params);
      } else {
        await insumoService.downloadCsv(params);
      }
    } catch (error) {
      console.error(`Erro ao exportar ${formato}:`, error);
      alert("Erro ao gerar o arquivo. Verifique a conexão com o servidor.");
    }
  };

  const handleEditar = (item) => {
    setItemParaEditar(item);
    setModalEdicaoAberto(true);
  };

  const handleSalvarEdicao = () => {
    fetchInsumos();
  };

  return (
    <div className="container-banco">
      <div className="content-banco">
        <main>
          <div className="content-lista-full">
            <ListaInsumos
              // Passamos apenas a "fatia" atual para a tabela
              insumos={insumosAtuais}
              loading={loading}
              termoBusca={termoBusca}
              onSearchChange={(t) => setTermoBusca(t)}
              onEditar={handleEditar}
              onSolicitarExclusao={handleSolicitarExclusao}
              // Passamos os dados da paginação calculada
              paginaAtual={paginaAtual}
              totalPaginas={totalPaginas}
              onPageChange={setPaginaAtual}
            />
          </div>
        </main>
      </div>

      <ModalExcluir
        isOpen={modalExcluirAberto}
        onClose={() => setModalExcluirAberto(false)}
        onConfirm={handleConfirmarExclusao}
        titulo="Excluir Insumo Definitivamente"
        mensagem={`Deseja excluir "${itemParaExcluir?.nome}" e todo o histórico?`}
        nomeItem={itemParaExcluir?.nome}
      />

      <EditarCadastroInsumo
        isOpen={modalEdicaoAberto}
        onClose={() => setModalEdicaoAberto(false)}
        item={itemParaEditar}
        onSalvar={handleSalvarEdicao}
      />
    </div>
  );
};

export default GerenciarInsumos;
