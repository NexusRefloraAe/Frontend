import React, { useState, useEffect, useCallback } from "react";
import insumoService from "../../../services/insumoService";
import ModalExcluir from "../../../components/ModalExcluir/ModalExcluir";
import ListaInsumos from "../../../components/ListaInsumos/ListaInsumos";
import EditarCadastroInsumo from "./EditarCadastroInsumo";

const GerenciarInsumos = () => {
  const [todosInsumos, setTodosInsumos] = useState([]);
  const [insumosFiltrados, setInsumosFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const ITENS_POR_PAGINA = 10; 

  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [itemParaExcluir, setItemParaExcluir] = useState(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [itemParaEditar, setItemParaEditar] = useState(null);

  const fetchInsumos = useCallback(async () => {
    setLoading(true);
    try {
      const dados = await insumoService.getAll();
      setTodosInsumos(dados);
      setInsumosFiltrados(dados); 
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

  useEffect(() => {
    let resultados = todosInsumos;
    if (termoBusca) {
      resultados = todosInsumos.filter((i) =>
        i.nome.toLowerCase().includes(termoBusca.toLowerCase())
      );
    }
    setInsumosFiltrados(resultados);
    setPaginaAtual(1); 
  }, [termoBusca, todosInsumos]);

  const indexUltimoItem = paginaAtual * ITENS_POR_PAGINA;
  const indexPrimeiroItem = indexUltimoItem - ITENS_POR_PAGINA;
  const insumosAtuais = insumosFiltrados.slice(
    indexPrimeiroItem,
    indexUltimoItem
  );

  const totalPaginas = Math.ceil(insumosFiltrados.length / ITENS_POR_PAGINA);

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
              insumos={insumosAtuais} // Passa a página atual para exibir
              listaCompletaExportacao={insumosFiltrados} // NOVA PROP: Passa a lista filtrada inteira para exportar
              loading={loading}
              termoBusca={termoBusca}
              onSearchChange={(t) => setTermoBusca(t)}
              onEditar={handleEditar}
              onSolicitarExclusao={handleSolicitarExclusao}
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