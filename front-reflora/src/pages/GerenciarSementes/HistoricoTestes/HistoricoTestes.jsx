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
  const [termoBusca, setTermoBusca] = useState("");

  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalDetalheAberto, setModalDetalheAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);

  const [ordem, setOrdem] = useState("dataPlantio");
  const [direcao, setDirecao] = useState("desc");

  const handleOrdenar = (novoCampo) => {
    let novaDirecao = "asc";
    // Compara com o estado atual para decidir se inverte
    if (novoCampo === ordem) {
      novaDirecao = direcao === "asc" ? "desc" : "asc";
    }

    // Atualiza visualmente
    setOrdem(novoCampo);
    setDirecao(novaDirecao);
    setPaginaAtual(0);

    // O PULO DO GATO: Chama a busca com os valores NOVOS calculados
    carregarDados(0, termoBusca, novoCampo, novaDirecao);
  };

  // 2. Carregar dados da API e CALCULAR A TAXA se necessário
  const carregarDados = useCallback(
    async (pagina = 0, busca = "", ordem, direcao) => {
      try {
        setLoading(true);
        const data = await testeGerminacaoService.getAll(
          busca,
          pagina,
          5,
          ordem,
          direcao
        );

        const listaVindaDoBack = data.content || [];

        // --- LÓGICA DE CORREÇÃO/CÁLCULO NO FRONT ---
        const listaProcessada = listaVindaDoBack.map((item) => {
          let taxa = item.taxaGerminacao;
          const plantadas = item.numSementesPlantadas;
          const germinaram = item.numSementesGerminaram;

          // Cálculo baseado na CONTAGEM (Amostra)
          if ((!taxa || taxa === "-") && plantadas > 0) {
            taxa = ((germinaram / plantadas) * 100).toFixed(2);
          }

          if (taxa && taxa !== "-" && !String(taxa).includes("%")) {
            taxa = `${taxa}%`;
          }

          return { ...item, taxaGerminacao: taxa || "-" };
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
    },
    []
  );

  useEffect(() => {
    carregarDados(0, "", "dataPlantio", "desc");
  }, [carregarDados]);

  // Handlers de Modais
  const handleVisualizar = async (item) => {
    try {
      setLoading(true); // Opcional: Mostra loading

      // 1. Busca o dado cru do banco (Igual ao seu JSON)
      const dadosApi = await testeGerminacaoService.getById(item.id);

      // 2. FAZ A TRADUÇÃO (O Pulo do Gato) 🐱
      // Criamos um objeto novo com os nomes que o 'DetalhesTestes' espera
      const dadosTraduzidos = {
        ...dadosApi, // Copia id, lote, datas...

        // AQUI ESTÁ A MÁGICA:
        // Pegamos o valor que está escondido dentro de 'sementes'
        // e colocamos na raiz com o nome 'nomePopularSemente'
        nomePopularSemente: dadosApi.sementes?.nomePopular || "Sem nome",

        // Tratamento para booleanos (true -> "Sim")
        estahNaCamaraFria: dadosApi.estahNaCamaraFria ? "Sim" : "Não",

        // Garante a formatação da taxa
        taxaGerminacao: formatarTaxa(
          dadosApi.taxaGerminacao,
          dadosApi.qtdGerminou,
          dadosApi.qtdSemente
        ),
      };

      // 3. Salva o objeto TRADUZIDO no estado
      setItemSelecionado(dadosTraduzidos);
      setModalDetalheAberto(true);
    } catch (error) {
      console.error("Erro ao carregar detalhes:", error);
      alert("Erro ao buscar dados.");
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar simples para calcular/formatar a taxa
  const formatarTaxa = (taxa, germinou, total) => {
    if (taxa) return `${taxa}%`.replace("%%", "%"); // Evita %%
    if (total > 0 && germinou != null) {
      return ((germinou / total) * 100).toFixed(2) + "%";
    }
    return "-";
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
  };

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
  };

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
  };

  // 5. FUNÇÕES DA TABELA (Busca e Paginação)
  const handleBusca = (novoTermo) => {
    setTermoBusca(novoTermo);
    // We call carregarDados passing the new term immediately
    carregarDados(0, novoTermo, ordem, direcao);
  };

  const handleMudarPagina = (novaPagina) => {
    // Componente de paginação visual costuma usar base 1, API usa base 0
    carregarDados(novaPagina - 1, termoBusca, ordem, direcao);
  };

  // --- NOVA LÓGICA DE DOWNLOAD (Igual ao HistoricoPlantio) ---
  const realizarDownload = (response, defaultName) => {
    const disposition = response.headers["content-disposition"];
    let fileName = defaultName;

    if (disposition) {
      const filenameRegex =
        /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/i;
      const matches = filenameRegex.exec(disposition);
      if (matches && matches[1]) {
        fileName = matches[1].replace(/['"]/g, "");
        fileName = decodeURIComponent(fileName);
      }
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    try {
      const response = await testeGerminacaoService.exportarPdf(termoBusca);
      realizarDownload(response, "relatorio_germinacao.pdf");
    } catch (error) {
      console.error("Erro export PDF:", error);
      alert("Erro ao gerar PDF.");
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await testeGerminacaoService.exportarCsv(termoBusca);
      realizarDownload(response, "relatorio_germinacao.csv");
    } catch (error) {
      console.error("Erro export CSV:", error);
      alert("Erro ao gerar CSV.");
    }
  };

  // 🧩 COLUNAS MAPEADAS
  const colunas = [
    { key: "lote", label: "Lote", sortable: true },
    {
      key: "nomePopularSemente",
      label: "Nome popular",
      sortable: true,
      sortKey: "nomePopular",
    },
    {
      key: "dataPlantio",
      label: "Data do Teste",
      sortable: true,
      sortKey: "dataPlantio",
    },
    {
      key: "qtdSemente",
      label: "Quantidade",
      sortable: true,
      sortKey: "qtdSemente",
    },
    {
      key: "unidadeDeMedida",
      label: "Und. de medida",
      sortable: true,
      sortKey: "sementes.unidadeDeMedida",
    },
    {
      key: "estahNaCamaraFria",
      label: "Câmara Fria",
      sortable: true,
      sortKey: "camaraFria",
    },
    {
      key: "dataGerminacao",
      label: "Data Germinação",
      sortable: true,
      sortKey: "dataGerminacao",
    },
    { key: "numSementesPlantadas", label: "Amostra (un)", sortable: true }, // NOVO
    { key: "numSementesGerminaram", label: "Germinou (un)", sortable: true }, // NOVO
    {
      key: "taxaGerminacao",
      label: "Taxa Germinou %",
      sortable: true,
      sortKey: "taxaGerminacao",
    }, // Agora virá preenchido pelo cálculo do front
  ];

  return (
    <div className="historico-container-banco">
      {/* Renderização dos 3 modais */}

      {modalDetalheAberto && itemSelecionado && (
        <ModalDetalheGenerico
          isOpen={modalDetalheAberto}
          item={itemSelecionado}
          titulo="Detalhes do Teste"
          camposDetalhes={[]}
          onClose={handleFecharModalDetalhe}
          onEditar={() => handleEditar(itemSelecionado)}
          onExcluir={() => handleExcluirTeste(itemSelecionado)}
          mostrarHistorico={false}
          mostrarExportar={false}
          mostrarAcoes={true}
          mostrarImagem={false}
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
            onVisualizar={handleVisualizar}
            onExcluir={handleExcluirTeste}
            onExportPDF={handleExportPDF}
            onExportCSV={handleExportCSV}
            onOrdenar={handleOrdenar}
            ordemAtual={ordem}
            direcaoAtual={direcao}
          />
        </main>
      </div>
    </div>
  );
};

export default HistoricoTestes;
