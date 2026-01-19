import React, { useState, useCallback, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import EditarPlantioSementes from "./EditarPlantioSementes/EditarPlantioSementes";
import ModalExcluir from "../../../components/ModalExcluir/ModalExcluir";
import ModalDetalheGenerico from "../../../components/ModalDetalheGenerico/ModalDetalheGenerico";
import DetalhesPlantio from "./DetalhesPlantio/DetalhesPlantio";
import { plantioService } from "../../../services/plantioService";
import { getBackendErrorMessage } from "../../../utils/errorHandler";

const HistoricoPlantio = () => {
  const [sementes, setSementes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de paginação
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [termoBusca, setTermoBusca] = useState("");

  // Estados dos Modais...
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalDetalheAberto, setModalDetalheAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);

  const [ordem, setOrdem] = useState("dataPlantio"); // Campo padrão
  const [direcao, setDirecao] = useState("desc"); // Direção padrão

  const handleOrdenar = (novoCampo) => {
    // Se clicar na mesma coluna, inverte a direção (asc <-> desc)
    let novaDirecao = "asc";
    if (novoCampo === ordem) {
      novaDirecao = direcao === "asc" ? "desc" : "asc";
    }

    // Atualiza os estados
    setOrdem(novoCampo);
    setDirecao(novaDirecao);

    // Reseta para a primeira página e recarrega os dados com a nova ordem
    setPaginaAtual(0);
    carregarDados(0, termoBusca, novoCampo, novaDirecao);
  };

  // 2. FUNÇÃO PARA CARREGAR DADOS DO BACKEND
  const carregarDados = useCallback(
    async (
      pagina = 0,
      busca = termoBusca,
      ordemArg = ordem,
      direcaoArg = direcao,
    ) => {
      try {
        setLoading(true);
        const data = await plantioService.getAll(
          busca,
          pagina,
          5,
          ordemArg,
          direcaoArg,
        );

        // Garante que, se o back-end falhar ou mudar a estrutura, o front não receba 'undefined'
        setSementes(data.content || []);
        setTotalPaginas(data.totalPages || 0); // O '|| 0' evita o NaN
        setPaginaAtual(data.number || 0);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        alert(getBackendErrorMessage(error));
      } finally {
        setLoading(false);
      }
    },
    [ordem, direcao],
  ); // Adicione as dependências corretas aqui

  // Carrega ao montar
  useEffect(() => {
    carregarDados(0, "", "dataPlantio", "desc");
  }, []);

  // Handlers de Modais (Visualizar, Fechar) mantêm-se iguais...
  // 1. CORREÇÃO: Função assíncrona com busca e tradução de dados
  const handleVisualizar = async (item) => {
    try {
      setLoading(true);

      // Busca dados completos no backend
      const dadosApi = await plantioService.getById(item.id);
      // Faz a tradução para o formato plano que o modal espera
      const dadosTraduzidos = {
        ...dadosApi, // Copia tudo (id, datas, quantidades...)

        // Garante que o nome da semente apareça, pegando de dentro do objeto 'sementes'
        nomePopularSemente:
          dadosApi.sementes?.nomePopular ||
          item.nomePopularSemente ||
          "Não informado",

        // Se houver outros campos aninhados ou formatações específicas, faça aqui:
        // Exemplo: formatar tipo de plantio se vier apenas código
        tipoPlantioDescricao:
          dadosApi.tipoPlantioDescricao || dadosApi.tipoPlantio || "-",
      };

      setItemSelecionado(dadosTraduzidos);
      setModalDetalheAberto(true);
    } catch (error) {
      console.error("Erro ao carregar detalhes do plantio:", error);
      alert(getBackendErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleFecharModalDetalhe = () => {
    setModalDetalheAberto(false);
    setItemSelecionado(null);
  };
  const handleEditar = async (item) => {
    try {
      setLoading(true);
      // ✅ BUSCA OS DADOS COMPLETOS (Igual ao visualizar)
      // Isso garante que o objeto tenha o campo 'tipoPlantio' preenchido pelo Jackson/ModelMapper
      const dadosCompletos = await plantioService.getById(item.id);

      setItemSelecionado(dadosCompletos);
      setModalDetalheAberto(false);
      setModalEdicaoAberto(true);
    } catch (error) {
      console.error("Erro ao carregar para edição:", error);
      alert(getBackendErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };
  const handleExcluir = (item) => {
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
      alert(getBackendErrorMessage(error));
    }
  };

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
        alert(getBackendErrorMessage(error));
      }
    }
  };

  // 5. FUNÇÕES DA TABELA (Busca e Paginação)
  const handleBusca = (novoTermo) => {
    setTermoBusca(novoTermo);
    // Passa explicitamente a ordem e direção que estão no estado AGORA
    carregarDados(0, novoTermo, ordem, direcao);
  };

  const handleMudarPagina = (novaPagina) => {
    // O componente de paginação geralmente envia index 1, o back espera 0. Ajuste se necessário.
    carregarDados(novaPagina - 1, termoBusca, ordem, direcao);
  };

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
      // Passa o termoBusca atual para filtrar o relatório igual à tabela
      const response = await plantioService.exportarPdf(termoBusca);
      realizarDownload(response, "relatorio_plantio.pdf");
    } catch (error) {
      console.error("Erro export PDF:", error);
      alert("Erro ao gerar PDF.");
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await plantioService.exportarCsv(termoBusca);
      realizarDownload(response, "relatorio_plantio.csv");
    } catch (error) {
      console.error("Erro export CSV:", error);
      alert("Erro ao gerar CSV.");
    }
  };

  // Colunas mapeadas com os campos que vêm do DTO do Java
  // (Veja no controller: MovimentacaoSementesHistoricoResponseDTO)
  const colunas = [
    { key: "lote", label: "Lote", sortable: true },
    {
      key: "nomePopularSemente",
      label: "Nome popular",
      sortable: true,
      sortKey: "sementes.nomePopular",
    }, // Java: setNomePopularSemente
    { key: "dataPlantio", label: "Data de plantio", sortable: true },
    {
      key: "qtdSemente",
      label: "Qtd. Sementes",
      sortable: true,
    },
    {
      key: "unidadeDeMedida",
      label: "Und. de medida",
      sortable: true,
      sortKey: "sementes.unidadeDeMedida",
    },
    {
      key: "quantidadePlantada",
      label: "Qtd. Plantada (und)",
      sortable: true,
    },
    {
      key: "tipoPlantioDescricao",
      label: "Tipo de Plantio",
      sortable: true,
      sortKey: "tipoPlantio",
    },
  ];

  return (
    <div className="historico-container-banco">
      {/* ... (Modais detalhe/edição/exclusão renderizados aqui) ... */}

      {modalDetalheAberto && itemSelecionado && (
        <ModalDetalheGenerico
          isOpen={modalDetalheAberto}
          item={itemSelecionado}
          onClose={handleFecharModalDetalhe}
          onEditar={() => handleEditar(itemSelecionado)}
          onExcluir={() => handleExcluir(itemSelecionado)}
          titulo="Detalhes do Plantio"
          camposDetalhes={[]}
          mostrarHistorico={false}
          mostrarExportar={false}
          mostrarAcoes={true}
          mostrarImagem={false} // <--- ADICIONE ESTA LINHA AQUI
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
          <TabelaComBuscaPaginacao
            titulo="Histórico de Plantio"
            dados={sementes}
            colunas={colunas}
            chaveBusca="nomePopularSemente" // Campo para o placeholder da busca
            // Passando as funções reais
            onPesquisar={handleBusca}
            // Passe o loading para a tabela gerenciar o visual
            isLoading={loading}
            // Configuração da paginação se o componente suportar props externas
            paginaAtual={paginaAtual + 1} // +1 para visual
            totalPaginas={totalPaginas}
            onPaginaChange={handleMudarPagina}
            modoBusca="auto"
            onEditar={handleEditar}
            onVisualizar={handleVisualizar}
            onExcluir={handleExcluir}
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

export default HistoricoPlantio;
