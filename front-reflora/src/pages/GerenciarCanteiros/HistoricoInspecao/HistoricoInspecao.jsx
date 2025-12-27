import React, { useState, useEffect, useCallback } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import EditarInspecao from "../EditarInspecao/EditarInspecao"; 
import ModalExcluir from "../../../components/ModalExcluir/ModalExcluir"; 
import { inspecaoService } from "../../../services/inspecaoMudaService";
import ModalDetalheGenerico from "../../../components/ModalDetalheGenerico/ModalDetalheGenerico";
import DetalheInspecao from "./DetalheInspecao/DetalheInspecao";

const HistoricoInspecao = () => {

  // 2. Estados para modais e dados
  const [dados, setDados] = useState([]);
  const [inspecaoEditando, setInspecaoEditando] = useState(null);
  const [inspecaoExcluindo, setInspecaoExcluindo] = useState(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [modalDetalheAberto, setModalDetalheAberto] = useState(false);  
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ordem, setOrdem] = useState('dataInspecao'); // Campo inicial de ordenação
  const [direcao, setDirecao] = useState('desc');
  
  // Estados para paginação
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [itensPorPagina, setItensPorPagina] = useState(5); 
  const [termoBusca, setTermoBusca] = useState('');

  // 2. Função para carregar dados reais da API
  // 1. FUNÇÃO PARA CARREGAR DADOS (Sincronizada com busca e ordenação)
  const carregarDados = useCallback(async (pagina = 0, ordemArg = ordem, direcaoArg = direcao, buscaArg = termoBusca) => {
    setLoading(true);
    try {
        // CORREÇÃO: Passar todos os argumentos que o Service espera
        const response = await inspecaoService.getAll(
            pagina, 
            itensPorPagina, 
            buscaArg, // nomePopular
            ordemArg, // campo de ordenação
            direcaoArg // direção (asc/desc)
        );
        
        console.log("Resposta API:", response);

        // Ajuste de mapeamento baseado no retorno padrão do Spring Page
        setDados(response.content || []); 
        
        if (response.page) {
            setTotalPaginas(response.page.totalPages);
            setPaginaAtual(response.page.number); 
        }
      } catch (error) {
          console.error("Erro ao carregar inspeções:", error);
      } finally {
          setLoading(false);
      }
  }, [itensPorPagina, ordem, direcao, termoBusca]);

  useEffect(() => {
    carregarDados(paginaAtual);
  }, [paginaAtual, carregarDados]);

  // 2. FUNÇÃO UTILITÁRIA PARA DOWNLOAD DE ARQUIVOS
  const realizarDownload = (response, defaultName) => {
    const disposition = response.headers['content-disposition'];
    let fileName = defaultName;

    if (disposition) {
        const filenameRegex = /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/i;
        const matches = filenameRegex.exec(disposition);
        if (matches && matches[1]) {
            fileName = decodeURIComponent(matches[1].replace(/['"]/g, ''));
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

  // 3. HANDLERS DE EXPORTAÇÃO
  const handleExportarPDF = async () => {
    try {
        setLoading(true);
        const response = await inspecaoService.exportarHistoricoPdf(termoBusca);
        realizarDownload(response, 'historico_inspecoes.pdf');
    } catch (error) {
        alert("Erro ao exportar PDF.");
    } finally {
        setLoading(false);
    }
  };

  const handleExportarCSV = async () => {
    try {
        setLoading(true);
        const response = await inspecaoService.exportarHistoricoCsv(termoBusca);
        realizarDownload(response, 'historico_inspecoes.csv');
    } catch (error) {
        alert("Erro ao exportar CSV.");
    } finally {
        setLoading(false);
    }
  };
  
  const handleEditar = (inspecao) => {
    setInspecaoEditando(inspecao);
    setModalEdicaoAberto(true);

    setModalDetalheAberto(false);
  };

  const handleExcluir = (inspecao) => {
    setInspecaoExcluindo(inspecao);
    setModalExclusaoAberto(true);

    setModalDetalheAberto(false);
  };

  const handleSalvarEdicao = async (dadosDoForm) => {
    try {
        setLoading(true);
        // Chama a API enviando o ID original e os novos dados
        await inspecaoService.update(inspecaoEditando.id, dadosDoForm);
        
        // Sucesso: fecha modal e atualiza a lista
        setModalEdicaoAberto(false);
        carregarDados(paginaAtual); 
        alert("Inspeção atualizada com sucesso!");
    } catch (error) {
        console.error("Erro ao atualizar:", error);
        alert("Não foi possível salvar as alterações.");
    } finally {
        setLoading(false);
    }
  }

  const handleConfirmarExclusao = async () => {
    if (!inspecaoExcluindo) return;

    try {
        setLoading(true);
        await inspecaoService.delete(inspecaoExcluindo.id);

        alert("Inspeção removida com sucesso!");

        // Lógica para retroceder página se deletar o último item
        if (dados.length === 1 && paginaAtual > 1) {
            setPaginaAtual(prev => prev - 1); // O useEffect chamará carregarDados
        } else {
            await carregarDados(paginaAtual); // Recarrega a mesma página
        }

        setModalExclusaoAberto(false);
        setInspecaoExcluindo(null);

    } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir.");
    } finally {
        setLoading(false);
    }
  };

  const handleCancelarEdicao = () => {
    setModalEdicaoAberto(false);
    setInspecaoEditando(null);
  };

  const handleCancelarExclusao = () => {
    setModalExclusaoAberto(false);
    setInspecaoExcluindo(null);
  };

  const handleBuscaChange = (termo) => {
    setTermoBusca(termo);
    setPaginaAtual(0);
  };

  const handlePesquisar = (termo) => {
    setTermoBusca(termo);
    setPaginaAtual(0); // Reseta para primeira página na busca
  };

  const handleOrdenar = (novoCampo) => {
    const novaDirecao = (novoCampo === ordem && direcao === 'asc') ? 'desc' : 'asc';
    setOrdem(novoCampo);
    setDirecao(novaDirecao);
    setPaginaAtual(0);
    carregarDados(0, novoCampo, novaDirecao);
  };

  const handleMudarPagina = (novaPagina) => {
    setPaginaAtual(novaPagina - 1);
  };

  const handleVisualizar = async (item) => {
      try {
          setLoading(true);
          // Busca os dados detalhados no Back-end pelo ID
          const dadosCompletos = await inspecaoService.getById(item.id);
          setItemSelecionado(dadosCompletos);
          setModalDetalheAberto(true);
      } catch (error) {
          console.error("Erro ao carregar detalhes:", error);
          alert("Não foi possível carregar os detalhes da inspeção.");
      } finally {
          setLoading(false);
      }
  };

  const handleFecharModalDetalhe = () => {
    setModalDetalheAberto(false);
    setItemSelecionado(null);
  };

  // Colunas da tabela
  const colunas = [
    { key: "loteMuda", label: "Lote", sortable: true, sortKey: 'plantioCanteiro.plantioOrigem.lote' },
    { key: "nomePopular", label: "Nome Popular", sortable: true, sortKey: 'plantioCanteiro.plantioOrigem.sementes.nomePopular' },
    { key: "nomeCanteiro", label: "Nome do Local", sortable: true, sortKey: 'plantioCanteiro.canteiro.nome' },
    { key: "dataInspecao", label: "Data da Inspeção", sortable: true },
    { key: "tratosCulturais", label: "Tratos Culturais", sortable: true },
    { key: "doencasPragas", label: "Pragas/Doenças", sortable: true },
    { key: "estadoSaude", label: "Estado de Saúde", sortable: true },
    { key: "estimativaMudasProntas", label: "Qntd", sortable: true },
    { key: "nomeResponsavel", label: "Nome do Responsável", sortable: true },
  ];

  return (
    <div className="historico-container-banco"> 

      {/* 4. MODAL DE EDIÇÃO */}
      {/* (Renderização condicional curta evita carregar o form desnecessariamente) */}
      {modalEdicaoAberto && (
          <EditarInspecao
            isOpen={modalEdicaoAberto}
            onClose={handleCancelarEdicao}
            inspecao={inspecaoEditando}
            onSalvar={handleSalvarEdicao}
          />
      )}

      {modalDetalheAberto && itemSelecionado && (
          <ModalDetalheGenerico
              isOpen={modalDetalheAberto}
              item={itemSelecionado}
              titulo="Detalhes da Inspeção"
              camposDetalhes={[]} 
              onClose={handleFecharModalDetalhe}
              onEditar={() => handleEditar(itemSelecionado)}
              onExcluir={() => handleExcluir(itemSelecionado)}
              mostrarHistorico={false}
              mostrarExportar={false}
              mostrarAcoes={true}
          >
              <DetalheInspecao item={itemSelecionado} />
          </ModalDetalheGenerico>
      )}

      {/* 5. MODAL DE EXCLUSÃO */}
      <ModalExcluir
        isOpen={modalExclusaoAberto}
        onClose={handleCancelarExclusao}
        onConfirm={handleConfirmarExclusao}
        nomeItem={inspecaoExcluindo?.nomePopular}
        titulo="Excluir Inspeção"
        mensagem={`Tem certeza que deseja excluir a inspeção do lote "${inspecaoExcluindo?.loteMuda} - ${inspecaoExcluindo?.nomePopular}"? Esta ação não pode ser desfeita.`}
        textoConfirmar="Excluir"
        textoCancelar="Cancelar"
      />

      <div className="">
        <main>
          {/* 6. TABELA COM PROPS DE AÇÃO E PAGINAÇÃO */}
          <TabelaComBuscaPaginacao
            titulo="Histórico de Inspeção"
            dados={dados}
            colunas={colunas}
            chaveBusca="nomePopular"
            
            isLoading={loading}
            mostrarBusca={true}
            mostrarAcoes={true}

            onPesquisar={handlePesquisar}
            onEditar={handleEditar} // Passa a função
            onExcluir={handleExcluir} // Passa a função
            onVisualizar={handleVisualizar}

            paginaAtual={paginaAtual + 1}
            totalPaginas={totalPaginas}
            itensPorPagina={itensPorPagina}
            onPaginaChange={handleMudarPagina}
            onItensPorPaginaChange={setItensPorPagina}
            onBuscaChange={handleBuscaChange}
            termoBusca={termoBusca}

            onOrdenar={handleOrdenar}
            ordemAtual={ordem}
            direcaoAtual={direcao}
            onExportPDF={handleExportarPDF}
            onExportCSV={handleExportarCSV}

            // footerContent={
            //   <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            //     <button 
            //       className="btn-exportar"
            //       onClick={() => alert('Relatório exportado com sucesso!')}
            //     >
            //       Exportar ↑
            //     </button>
            //   </div>
            // }
          />
        </main>
      </div>
    </div>
  );
};

export default HistoricoInspecao;