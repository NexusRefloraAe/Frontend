import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import EditarPlantioSementes from "./EditarPlantioSementes/EditarPlantioSementes";
import ModalExcluir from "../../../components/ModalExcluir/ModalExcluir";
import ModalDetalheGenerico from "../../../components/ModalDetalheGenerico/ModalDetalheGenerico";
import DetalhesPlantio from "./DetalhesPlantio/DetalhesPlantio";
import { plantioService } from "../../../services/plantioService";

const HistoricoPlantio = () => {
  const [sementes, setSementes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de paginação
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [termoBusca, setTermoBusca] = useState('');

  // Estados dos Modais...
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalDetalheAberto, setModalDetalheAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);

  // 2. FUNÇÃO PARA CARREGAR DADOS DO BACKEND
  const carregarDados = async (pagina = 0, busca = '') => {
    try {
      setLoading(true);
      // Chama o serviço que bate em /movimentacoes/plantioMuda
      const data = await plantioService.getAll(busca, pagina);
      
      // O seu controller retorna um Page (content, totalPages, etc)
      setSementes(data.content);
      setTotalPaginas(data.totalPages);
      setPaginaAtual(data.number); // ou pagina
      
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      alert("Erro ao buscar dados.");
    } finally {
      setLoading(false);
    }
  };

  // Carrega ao montar
  useEffect(() => {
    carregarDados(0, '');
  }, []);

  // Handlers de Modais (Visualizar, Fechar) mantêm-se iguais...
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
  const handleExcluir = (item) => {
    setItemSelecionado(item);
    setModalDetalheAberto(false);
    setModalExclusaoAberto(true);
  };
  const handleCancelarEdicao = () => { setModalEdicaoAberto(false); setItemSelecionado(null); };
  const handleCancelarExclusao = () => { setModalExclusaoAberto(false); setItemSelecionado(null); };

  // 3. ATUALIZAR (Integração com PUT)
  const handleSalvarEdicao = async (dadosEditados) => {
    try {
        await plantioService.update(dadosEditados.id, dadosEditados);
        alert("Plantio atualizado com sucesso!");
        
        setModalEdicaoAberto(false);
        setItemSelecionado(null);
        carregarDados(paginaAtual, termoBusca); // Recarrega a tabela
    } catch (error) {
        console.error("Erro ao atualizar:", error);
        alert("Erro ao salvar edição.");
    }
  }

  // 4. EXCLUIR (Integração com DELETE)
  const handleConfirmarExclusao = async () => {
    if (itemSelecionado) {
      try {
          await plantioService.delete(itemSelecionado.id);
          alert("Excluído com sucesso.");
          
          setModalExclusaoAberto(false);
          setItemSelecionado(null);
          carregarDados(paginaAtual, termoBusca); // Recarrega a tabela
      } catch (error) {
          console.error("Erro ao excluir:", error);
          alert("Erro ao excluir item.");
      }
    }
  }

  // 5. FUNÇÕES DA TABELA (Busca e Paginação)
  const handleBusca = (novoTermo) => {
      setTermoBusca(novoTermo);
      carregarDados(0, novoTermo);
  }

  const handleMudarPagina = (novaPagina) => {
      // O componente de paginação geralmente envia index 1, o back espera 0. Ajuste se necessário.
      carregarDados(novaPagina - 1, termoBusca); 
  }

  // Colunas mapeadas com os campos que vêm do DTO do Java
  // (Veja no controller: MovimentacaoSementesHistoricoResponseDTO)
  const colunas = [
    { key: "lote", label: "Lote" },
    { key: "nomePopularSemente", label: "Nome popular" }, // Java: setNomePopularSemente
    { key: "dataPlantio", label: "Data de plantio" },
    { key: "qtdSemente", label: "Qtd. Sementes" },      // Java: setQtdSemente
    { key: "quantidadePlantada", label: "Qtd. Plantada" },
    { key: "tipoPlantioDescricao", label: "Tipo de Plantio" }, // Java: setTipoPlantioDescricao
  ];

  return (
    <div className="historico-container-banco">
      {/* ... (Modais detalhe/edição/exclusão renderizados aqui) ... */}
      
      {modalDetalheAberto && itemSelecionado && (
         <ModalDetalheGenerico 
            item={itemSelecionado} onClose={handleFecharModalDetalhe}
            onEditar={() => handleEditar(itemSelecionado)}
            onExcluir={() => handleExcluir(itemSelecionado)}
            titulo="Detalhes do Plantio" camposDetalhes={[]} 
            mostrarHistorico={false} mostrarExportar={false} mostrarAcoes={true}
         >
            <DetalhesPlantio item={itemSelecionado} />
         </ModalDetalheGenerico>
      )}

      <EditarPlantioSementes
        isOpen={modalEdicaoAberto}
        onCancelar={handleCancelarEdicao}
        plantio={itemSelecionado}
        onSalvar={handleSalvarEdicao}
      />

      <ModalExcluir
        isOpen={modalExclusaoAberto}
        onClose={handleCancelarExclusao}
        onConfirm={handleConfirmarExclusao}
        nomeItem={itemSelecionado?.nomePopularSemente}
        titulo="Excluir Plantio"
        mensagem="Tem certeza?"
        textoConfirmar="Excluir"
        textoCancelar="Cancelar"
      />

      <div className="historico-content-banco">
        <main>
          {loading ? <p>Carregando...</p> : (
              <TabelaComBuscaPaginacao
                titulo="Histórico de Plantio"
                dados={sementes}
                colunas={colunas}
                chaveBusca="nomePopularSemente" // Campo para o placeholder da busca
                
                // Passando as funções reais
                onPesquisar={handleBusca}
                
                // Configuração da paginação se o componente suportar props externas
                paginaAtual={paginaAtual + 1} // +1 para visual
                totalPaginas={totalPaginas}
                onPaginaChange={handleMudarPagina}

                onEditar={handleEditar}
                onConfirmar={handleVisualizar}
                onExcluir={handleExcluir}
              />
          )}
        </main>
      </div>
    </div>
  );
};

export default HistoricoPlantio;