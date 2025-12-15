import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import ModalDetalheGenerico from "../../../components/ModalDetalheGenerico/ModalDetalheGenerico";
import ModalExcluir from "../../../components/ModalExcluir/ModalExcluir";
import EditarTeste from "./EditarTeste/EditarTeste";
import DetalhesTestes from "./DetalhesTestes/DetalhesTestes";

// 1. Importe o serviço correto
import { testeGerminacaoService } from "../../../services/testeGerminacaoService";

const HistoricoTestes = () => {
  const [sementes, setSementes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de Paginação
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [termoBusca, setTermoBusca] = useState('');

  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalDetalheAberto, setModalDetalheAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);

  // 2. Carregar dados da API
  const carregarDados = async (pagina = 0, busca = '') => {
    try {
      setLoading(true);
      // Chama o endpoint /movimentacoes/testeGerminacao
      const data = await testeGerminacaoService.getAll(busca, pagina);
      
      // Ajuste conforme o retorno do Page do Spring
      setSementes(data.content || []); 
      setTotalPaginas(data.totalPages || 0);
      setPaginaAtual(data.number || 0);

    } catch (error) {
      console.error("Erro ao carregar testes:", error);
      alert("Erro ao buscar histórico de testes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados(0, '');
  }, []);

  // Handlers de Modais
  const handleVisualizar = (item) => {
    setItemSelecionado(item);
    setModalDetalheAberto(true);
  };

  const handleFecharModalDetalhe = () => {
    setModalDetalheAberto(false);
    setItemSelecionado(null);
  };

  const handleEditar = (item) => {
    setItemSelecionado(item);
    setModalDetalheAberto(false);
    setModalEdicaoAberto(true);
  };

  const handleExcluirTeste = (item) => {
    setItemSelecionado(item);
    setModalDetalheAberto(false);
    setModalExclusaoAberto(true);
  };

  const handleCancelarEdicao = () => {
    setModalEdicaoAberto(false);
    setItemSelecionado(null);
  }

  const handleCancelarExclusao = () => {
    setModalExclusaoAberto(false);
    setItemSelecionado(null);
  };

  // 3. Salvar Edição (PUT)
  const handleSalvarEdicao = async (dadosEditados) => {
    try {
      // O id vem no objeto da linha
      await testeGerminacaoService.update(dadosEditados.id, dadosEditados);
      alert("Teste atualizado com sucesso!");
      
      setModalEdicaoAberto(false);
      setItemSelecionado(null);
      carregarDados(paginaAtual, termoBusca); // Atualiza a tabela
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao salvar a edição.");
    }
  }

  // 4. Confirmar Exclusão (DELETE)
  const handleConfirmarExclusao = async () => {
    if (itemSelecionado) {
      try {
        await testeGerminacaoService.delete(itemSelecionado.id);
        alert("Teste excluído com sucesso.");
        
        setModalExclusaoAberto(false);
        setItemSelecionado(null);
        carregarDados(paginaAtual, termoBusca); // Atualiza a tabela
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir o teste.");
      }
    }
  }

  // 5. Funções da Tabela
  const handleBusca = (novoTermo) => {
    setTermoBusca(novoTermo);
    carregarDados(0, novoTermo);
  };

  const handleMudarPagina = (novaPagina) => {
    // Componente de paginação visual costuma usar base 1, API usa base 0
    carregarDados(novaPagina - 1, termoBusca);
  };

  // 🧩 COLUNAS MAPEADAS PARA O DTO DO JAVA
  // Baseado no MovimentacaoSementeController.java -> convertToHistoricoDto
  const colunas = [
    { key: "lote", label: "Lote" },
    { key: "nomePopularSemente", label: "Nome popular" }, // Backend envia 'nomePopularSemente'
    { key: "dataPlantio", label: "Data do Teste" },      // Backend usa 'dataPlantio' para a data do registro
    { key: "qtdSemente", label: "Quantidade" },          // Backend envia 'qtdSemente'
    { key: "estahNaCamaraFria", label: "Câmara Fria" }, // Backend envia 'estahNaCamaraFria' ("Sim"/"Não")
    { key: "dataGerminacao", label: "Data Germinação" },
    { key: "qtdGerminou", label: "Qntd Germinou(und)" }, // Verifique se o DTO usa 'qtd' ou 'quantidade'
    { key: "taxaGerminacao", label: "Taxa Germinou %" }, // Backend envia 'taxaGerminacao'
  ];

  return (
    <div className="historico-container-banco">

      {/* Renderização dos 3 modais */}

      {modalDetalheAberto && itemSelecionado && (
        <ModalDetalheGenerico
          item={itemSelecionado}
          titulo="Detalhes do Teste"
          camposDetalhes={[]} 
          onClose={handleFecharModalDetalhe}
          onEditar={() => handleEditar(itemSelecionado)}
          onExcluir={() => handleExcluirTeste(itemSelecionado)}
          mostrarHistorico={false}
          mostrarExportar={false}
          mostrarAcoes={true}
        >
          <DetalhesTestes item={itemSelecionado} />
        </ModalDetalheGenerico>
      )}

      <EditarTeste
        isOpen={modalEdicaoAberto}
        onCancelar={handleCancelarEdicao}
        onSalvar={handleSalvarEdicao}
        teste={itemSelecionado} 
      />

      <ModalExcluir
        isOpen={modalExclusaoAberto}
        onClose={handleCancelarExclusao}
        onConfirm={handleConfirmarExclusao}
        nomeItem={itemSelecionado?.nomePopularSemente} // Ajustado para a chave correta
        titulo="Excluir Teste"
        mensagem={`Você tem certeza que deseja excluir o teste do lote ${itemSelecionado?.lote}?`}
        textoConfirmar="Excluir"
        textoCancelar="Cancelar"
      />

      <div className="historico-content-banco">
        <main>
          {loading ? <p>Carregando...</p> : (
            <TabelaComBuscaPaginacao
              titulo="Histórico de Teste de Germinação"
              dados={sementes}
              colunas={colunas}
              chaveBusca="nomePopularSemente" // Placeholder da busca
              
              onPesquisar={handleBusca}
              
              paginaAtual={paginaAtual + 1}
              totalPaginas={totalPaginas}
              onPaginaChange={handleMudarPagina}

              onEditar={handleEditar}
              onConfirmar={handleVisualizar}
              onExcluir={handleExcluirTeste}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default HistoricoTestes;