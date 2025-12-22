import React, { useState, useEffect, useCallback } from "react";
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

  // 2. Carregar dados da API e CALCULAR A TAXA se necessário
  const carregarDados = async (pagina = 0, busca = '') => {
    try {
      setLoading(true);
      const data = await testeGerminacaoService.getAll(busca, pagina);
      
      const listaVindaDoBack = data.content || [];

      // --- LÓGICA DE CORREÇÃO/CÁLCULO NO FRONT ---
      const listaProcessada = listaVindaDoBack.map(item => {
          let taxa = item.taxaGerminacao;
          const total = item.qtdSemente;
          const germinou = item.qtdGerminou;

          // Se o backend não mandou a taxa, mas temos os números, calculamos agora:
          if ((!taxa || taxa === '-' || taxa === null) && total > 0 && germinou != null) {
              const valorCalculado = (germinou / total) * 100;
              // Formata para 2 casas decimais (ex: "15.50")
              taxa = valorCalculado.toFixed(2);
          }

          // Adiciona o símbolo % se não tiver e se for um valor válido
          if (taxa && taxa !== '-' && !String(taxa).includes('%')) {
              taxa = `${taxa}%`;
          }

          return { ...item, taxaGerminacao: taxa || '-' };
      });
      // ---------------------------------------------

      setSementes(listaProcessada);
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
      await testeGerminacaoService.update(dadosEditados.id, dadosEditados);
      alert("Teste atualizado com sucesso!");
      
      setModalEdicaoAberto(false);
      setItemSelecionado(null);
      carregarDados(paginaAtual, termoBusca); 
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
        carregarDados(paginaAtual, termoBusca); 
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir o teste.");
      }
    }
  }

  // 5. FUNÇÕES DA TABELA (Busca e Paginação)
  const handleBusca = useCallback((novoTermo) => {
      setTermoBusca(novoTermo);
      // We call carregarDados passing the new term immediately
      carregarDados(0, novoTermo);
  }, []);

  const handleMudarPagina = (novaPagina) => {
    // Componente de paginação visual costuma usar base 1, API usa base 0
    carregarDados(novaPagina - 1, termoBusca);
  };

  // --- NOVA LÓGICA DE DOWNLOAD (Igual ao HistoricoPlantio) ---
  const realizarDownload = (response, defaultName) => {
      const disposition = response.headers['content-disposition'];
      let fileName = defaultName;

      if (disposition) {
          const filenameRegex = /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/i;
          const matches = filenameRegex.exec(disposition);
          if (matches && matches[1]) { 
              fileName = matches[1].replace(/['"]/g, '');
              fileName = decodeURIComponent(fileName); 
          }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
      try {
          const response = await testeGerminacaoService.exportarPdf(termoBusca);
          realizarDownload(response, 'relatorio_germinacao.pdf');
      } catch (error) {
          console.error("Erro export PDF:", error);
          alert("Erro ao gerar PDF.");
      }
  };

  const handleExportCSV = async () => {
      try {
          const response = await testeGerminacaoService.exportarCsv(termoBusca);
          realizarDownload(response, 'relatorio_germinacao.csv');
      } catch (error) {
          console.error("Erro export CSV:", error);
          alert("Erro ao gerar CSV.");
      }
  };

  // 🧩 COLUNAS MAPEADAS
  const colunas = [
    { key: "lote", label: "Lote" },
    { key: "nomePopularSemente", label: "Nome popular" }, 
    { key: "dataPlantio", label: "Data do Teste" },      
    { key: "qtdSemente", label: "Quantidade" },          
    { key: "estahNaCamaraFria", label: "Câmara Fria" }, 
    { key: "dataGerminacao", label: "Data Germinação" },
    { key: "qtdGerminou", label: "Qtd Germinou(und)" },
    { key: "taxaGerminacao", label: "Taxa Germinou %" }, // Agora virá preenchido pelo cálculo do front
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
        nomeItem={itemSelecionado?.nomePopularSemente} 
        titulo="Excluir Teste"
        mensagem={`Você tem certeza que deseja excluir o teste do lote ${itemSelecionado?.lote}?`}
        textoConfirmar="Excluir"
        textoCancelar="Cancelar"
      />

      <div className="historico-content-banco">
        <main>
          <TabelaComBuscaPaginacao
            titulo="Histórico de Teste de Germinação"
            dados={sementes}
            colunas={colunas}
            chaveBusca="nomePopularSemente" 
            
            onPesquisar={handleBusca}
            isLoading={loading}
            modoBusca="auto"
            
            paginaAtual={paginaAtual + 1}
            totalPaginas={totalPaginas}
            onPaginaChange={handleMudarPagina}

            onEditar={handleEditar}
            onConfirmar={handleVisualizar}
            onExcluir={handleExcluirTeste}

            onExportPDF={handleExportPDF}
            onExportCSV={handleExportCSV}
          />
        </main>
      </div>
    </div>
  );
};

export default HistoricoTestes;