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
  const carregarDados = useCallback(async (pagina) => {
    setLoading(true);
    try {
      // Spring usa página 0 para o início, React usa 1
      const response = await inspecaoService.getAll(pagina - 1, itensPorPagina);
      
      // O Spring retorna um objeto Page com o atributo 'content'
      setDados(response.content); 
      setTotalPaginas(response.totalPages);
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
    if (inspecaoExcluindo) {
        try {
            setLoading(true); // Inicia o loading visual
            
            // 1. Chama o serviço para deletar no Banco de Dados
            await inspecaoService.delete(inspecaoExcluindo.id);

            const isUltimoItemDaPagina = dados.length === 1;
            const naoEhPrimeiraPagina = paginaAtual > 1;

            if (isUltimoItemDaPagina && naoEhPrimeiraPagina) {
              // Ao mudar o estado da página, o useEffect será disparado automaticamente
              setPaginaAtual(prev => prev - 1);
            } else {
              // Se ainda houver outros itens na página ou for a página 1, apenas recarregamos
              await carregarDados(paginaAtual);
            }
            
            // 2. Feedback de sucesso
            console.log("Inspeção excluída com sucesso:", inspecaoExcluindo.id);
            alert("Inspeção removida com sucesso!");

            // 3. Fecha o modal e limpa o estado do item que estava sendo excluído
            setModalExclusaoAberto(false);
            setInspecaoExcluindo(null);

            // 4. Recarrega os dados da API para atualizar a tabela
            // Se a página ficar vazia (ex: deletou o único item da pág 2), 
            // você pode implementar uma lógica para voltar uma página, mas carregarDados resolve.
            carregarDados(paginaAtual); 

        } catch (error) {
            console.error("Erro ao excluir inspeção:", error);
            alert("Erro ao tentar excluir a inspeção. Tente novamente.");
        } finally {
            setLoading(false); // Para o loading
        }
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
            onPaginaChange={setPaginaAtual}
            onItensPorPaginaChange={setItensPorPagina}
            onBuscaChange={handleBuscaChange}
            termoBusca={termoBusca}

            footerContent={
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button 
                  className="btn-exportar"
                  onClick={() => alert('Relatório exportado com sucesso!')}
                >
                  Exportar ↑
                </button>
              </div>
            }
          />
        </main>
      </div>
    </div>
  );
};

export default HistoricoInspecao;