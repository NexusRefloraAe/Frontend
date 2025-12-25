import React, { useState, useEffect, useCallback } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import EditarInspecao from "../EditarInspecao/EditarInspecao"; 
import ModalExcluir from "../../../components/ModalExcluir/ModalExcluir"; 
import { inspecaoService } from "../../../services/inspecaoMudaService";

const HistoricoInspecao = () => {

  // 2. Estados para modais e dados
  const [dados, setDados] = useState([]);
  const [inspecaoEditando, setInspecaoEditando] = useState(null);
  const [inspecaoExcluindo, setInspecaoExcluindo] = useState(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estados para paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [itensPorPagina, setItensPorPagina] = useState(5); 
  const [termoBusca, setTermoBusca] = useState('');

  // 2. Função para carregar dados reais da API
  const carregarDados = useCallback(async (paginaDestino) => {
    setLoading(true);
    try {
        // Envia para o back (ex: página 1 vira 0)
        const response = await inspecaoService.getAll(paginaDestino - 1, itensPorPagina);
        
        console.log("Resposta completa da API:", response); // Debug para conferir no console

        // ATENÇÃO AQUI: A estrutura correta baseada no seu Postman
        setDados(response.content || []); 
        
        // Caminho correto: response.page.totalPages
        if (response.page) {
            setTotalPaginas(response.page.totalPages);
            // Sincroniza o estado local com o número real vindo do banco
            setPaginaAtual(response.page.number + 1); 
        }

      } catch (error) {
          console.error("Erro ao carregar inspeções:", error);
      } finally {
          setLoading(false);
      }
  }, [itensPorPagina]);

  // Carrega os dados ao montar o componente ou mudar de página
  useEffect(() => {
    carregarDados(paginaAtual);
  }, [paginaAtual, carregarDados]);

  // 3. Handlers para abrir/fechar modais
  
  const handleEditar = (inspecao) => {
    setInspecaoEditando(inspecao);
    setModalEdicaoAberto(true);
  };

  const handleExcluir = (inspecao) => {
    setInspecaoExcluindo(inspecao);
    setModalExclusaoAberto(true);
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
    setPaginaAtual(1);
  };

  const handlePesquisar = (termo) => {
    setTermoBusca(termo);
    setPaginaAtual(1);
    // Aqui você poderia chamar carregarDados(1, termo) se o back aceitasse busca
  };

  const handleMudarPagina = (novaPagina) => {
    setPaginaAtual(novaPagina);
  };

  // Colunas da tabela
  const colunas = [
    { key: "loteMuda", label: "Lote" },
    { key: "nomePopular", label: "Nome Popular" },
    { key: "nomeCanteiro", label: "Nome do local" },
    { key: "dataInspecao", label: "Data da Inspeção" },
    { key: "tratosCulturais", label: "Tratos Culturais" },
    { key: "doencasPragas", label: "Pragas/Doenças" },
    { key: "estadoSaude", label: "Estado de Saúde" },
    { key: "estimativaMudasProntas", label: "Qntd" },
    { key: "nomeResponsavel", label: "Nome do Responsável" },
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

            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
            itensPorPagina={itensPorPagina}
            onPaginaChange={handleMudarPagina}
            onItensPorPaginaChange={setItensPorPagina}
            onBuscaChange={handleBuscaChange}
            termoBusca={termoBusca}

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