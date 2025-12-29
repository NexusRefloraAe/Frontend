import React, { useState, useEffect } from "react";
import TabelaResponsiva from "../../../components/TabelaResponsiva/TabelaResponsiva"; // Caminho novo
import EditarInspecao from "../EditarInspecao/EditarInspecao"; 
import ModalExcluir from "../../../components/ModalExcluir/ModalExcluir"; 
import Paginacao from "../../../components/Paginacao/Paginacao"; // Componente de paginação

import { FaEdit, FaTrash } from 'react-icons/fa'; // Ícones

const HistoricoInspecao = () => {
  
  // ... (Seus dados MOCK e estados mantidos) ...
  const DADOS_INSPECAO_MOCK = [
    { id: 1, Lote: 'A001', NomePopular: 'Ipê-amarelo', DataInspecao: '20/05/2025', TratosCulturais: 'Regação', PragasDoencas: 'Nenhuma', EstadoSaude: 'Boa', Qntd: 700, Observacoes: 'Lorem ipsum' },
    // ... outros dados
  ];

  const [dados, setDados] = useState([]);
  const [inspecaoEditando, setInspecaoEditando] = useState(null);
  const [inspecaoExcluindo, setInspecaoExcluindo] = useState(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [termoBusca, setTermoBusca] = useState('');
  const itensPorPagina = 5; 

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
    // Simulação de filtro simples no front-end para o mock
    const dadosFiltrados = DADOS_INSPECAO_MOCK.filter(d => 
        d.NomePopular.toLowerCase().includes(termoBusca.toLowerCase()) || 
        d.Lote.toLowerCase().includes(termoBusca.toLowerCase())
    );
    setDados(dadosFiltrados);
  }, [termoBusca]);

  // Handlers (Mantenha os seus originais)
  const handleEditar = (inspecao) => { setInspecaoEditando(inspecao); setModalEdicaoAberto(true); };
  const handleExcluir = (inspecao) => { setInspecaoExcluindo(inspecao); setModalExclusaoAberto(true); };
  const handleSalvarEdicao = (d) => { /* ... */ setModalEdicaoAberto(false); };
  const handleConfirmarExclusao = () => { /* ... */ setModalExclusaoAberto(false); };
  const handleCancelarEdicao = () => { setModalEdicaoAberto(false); };
  const handleCancelarExclusao = () => { setModalExclusaoAberto(false); };

  // Colunas Adaptadas para TabelaResponsiva
  const colunas = [
    { key: "Lote", label: "Lote" },
    { key: "NomePopular", label: "Nome Popular" },
    { key: "DataInspecao", label: "Data" },
    { key: "TratosCulturais", label: "Tratos" },
    { key: "PragasDoencas", label: "Pragas" },
    { key: "EstadoSaude", label: "Saúde" },
    { key: "Qntd", label: "Qtd" },
    { 
        key: "acoes", 
        label: "Ações", 
        align: "right",
        render: (item) => (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button onClick={() => handleEditar(item)} title="Editar" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                    <FaEdit color="#fbc02d" size={16} />
                </button>
                <button onClick={() => handleExcluir(item)} title="Excluir" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                    <FaTrash color="#d32f2f" size={16} />
                </button>
            </div>
        )
    },
  ];

  // Paginação Frontend para o Mock
  const totalPaginas = Math.ceil(dados.length / itensPorPagina);
  const dadosPaginados = dados.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina);

  return (
    <div className="historico-container-banco"> 

      {modalEdicaoAberto && ( <EditarInspecao isOpen={modalEdicaoAberto} onClose={handleCancelarEdicao} inspecao={inspecaoEditando} onSalvar={handleSalvarEdicao} /> )}
      
      <ModalExcluir
        isOpen={modalExclusaoAberto}
        onClose={handleCancelarExclusao}
        onConfirm={handleConfirmarExclusao}
        nomeItem={inspecaoExcluindo?.nomePopular}
        titulo="Excluir Inspeção"
        mensagem="Tem certeza?"
      />

      <div className="">
        <main>
          <TabelaResponsiva
            titulo="Histórico de Inspeção"
            dados={dadosPaginados}
            colunas={colunas}
            termoBusca={termoBusca}
            onPesquisar={setTermoBusca}
            placeholderBusca="Buscar por nome ou lote..."
            footerContent={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                     <Paginacao 
                        paginaAtual={paginaAtual} 
                        totalPaginas={totalPaginas} 
                        onPaginaChange={setPaginaAtual} 
                     />
                     <button 
                        className="btn-exportar" 
                        onClick={() => alert('Exportar')}
                        style={{ background: '#2e7d32', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
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