import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Importação que faltava
import ListaSementes from '../../components/ListaSementes/ListaSementes';
import FormularioSemente from '../../components/FormularioSemente/FormularioSemente';
import BotaoSubmenus from '../../components/BotaoSubmenus/BotaoSubmenus';
import ModalExcluir from '../../components/ModalExcluir/ModalExcluir';
import { sementesService } from '../../services/sementesService';
import { getBackendErrorMessage } from '../../utils/errorHandler';
import { FaSeedling, FaList } from 'react-icons/fa';
import './BancoSementes.css';

const menusNavegacao = [
  { id: "cadastrar", label: "Cadastrar Semente", icon: <FaSeedling /> },
  { id: "listar", label: "Listar Sementes", icon: <FaList /> },
];

function BancoSementes() {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [abaAtiva, setAbaAtiva] = useState('listar');
  
  // Dados
  const [sementes, setSementes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sementeEditando, setSementeEditando] = useState(null);

  // Paginação e Busca
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [termoBusca, setTermoBusca] = useState('');
  const ITENS_POR_PAGINA = 5;

  // Ordenação
  const [ordem, setOrdem] = useState('dataDeCadastro'); 
  const [direcao, setDirecao] = useState('desc');       

  // IBGE (Estados e Cidades)
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);

  // Modal de Exclusão
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [sementeParaExcluir, setSementeParaExcluir] = useState(null);

  // --- 1. CARREGAR ESTADOS DO IBGE (Apenas na montagem) ---
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
        const data = await response.json();
        setEstados(data);
      } catch (error) {
        console.error("Erro ao buscar estados do IBGE:", error);
      }
    };
    fetchEstados();
  }, []);

  // --- 2. CARREGAR CIDADES DO IBGE ---
  const handleEstadoChange = async (uf) => {
    setCidades([]); 
    if (uf) {
      try {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
        const data = await response.json();
        setCidades(data);
      } catch (error) {
        console.error("Erro ao buscar cidades do IBGE:", error);
      }
    }
  };

  // --- 3. BUSCAR SEMENTES (Backend) ---
  const fetchSementes = useCallback(async () => {
    setLoading(true);
    try {
      // Ajuste os parâmetros conforme o seu sementesService espera
      const data = await sementesService.getAll(
          termoBusca, 
          paginaAtual - 1, 
          ITENS_POR_PAGINA, 
          ordem, 
          direcao
      );
      
      setSementes(data.content);
      const total = data.totalPages || (data.page && data.page.totalPages) || 1;
      setTotalPaginas(total);
      setErro('');
    } catch (error) {
      console.error("Erro ao buscar sementes:", error);
      const message = getBackendErrorMessage(error);
      setErro(message);
    } finally {
      setLoading(false);
    }
  }, [termoBusca, paginaAtual, ordem, direcao]);

  // Recarrega sempre que mudar aba (se for listar) ou filtros
  useEffect(() => {
    if (abaAtiva === 'listar') {
      fetchSementes();
    }
  }, [abaAtiva, fetchSementes]);

  // --- HANDLERS DE AÇÃO ---

  const handleMenuClick = (menuId) => {
    if (menuId === 'cadastrar') {
      setSementeEditando(null); // Limpa edição ao clicar em cadastrar
      setCidades([]); 
    }
    setAbaAtiva(menuId);
    setErro('');
  };

  const handleEditar = async (sementeResumida) => {
    setLoading(true);
    try {
      // 1. Busca dados completos pelo ID
      const sementeCompleta = await sementesService.getById(sementeResumida.id);
      setSementeEditando(sementeCompleta);
      
      // 2. Pré-carrega as cidades se houver estado salvo
      if (sementeCompleta.estado) {
         await handleEstadoChange(sementeCompleta.estado);
      }
      
      // 3. Muda para a aba de cadastro/edição
      setAbaAtiva('cadastrar');
      setErro('');
    } catch (error) {
      console.error("Erro ao carregar edição:", error);
      setErro("Não foi possível carregar os dados para edição.");
    } finally {
      setLoading(false);
    }
  };

  // Exclusão
  const handleSolicitarExclusao = (semente) => {
    setSementeParaExcluir(semente);
    setModalExcluirAberto(true);
  };

  const handleConfirmarExclusao = async () => {
    if (!sementeParaExcluir) return;

    try {
      await sementesService.delete(sementeParaExcluir.id);
      alert("Semente excluída com sucesso!");
      
      setModalExcluirAberto(false);
      setSementeParaExcluir(null);

      // Volta uma página se apagou o último item da página atual
      if (sementes.length === 1 && paginaAtual > 1) {
        setPaginaAtual(paginaAtual - 1);
      } else {
        fetchSementes(); 
      }
    } catch (error) {
      const msg = getBackendErrorMessage(error);
      setModalExcluirAberto(false);
      alert(msg);
    }
  };

  // Busca e Paginação
  const handleBusca = (novoTermo) => {
    setTermoBusca(novoTermo);
    setPaginaAtual(1);
  };

  const handleTrocaPagina = (novaPagina) => {
    setPaginaAtual(novaPagina);
  };

  const handleOrdenar = (novoCampo) => {
    // Se clicar no mesmo campo, inverte a direção. Se for outro, reseta para asc ou desc.
    if (novoCampo === ordem) {
        setDirecao(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
        setOrdem(novoCampo);
        setDirecao('asc');
    }
  };

  // Sucesso e Cancelamento do Formulário
  const handleSucessoCadastro = () => {
    setAbaAtiva('listar');
    setSementeEditando(null);
    fetchSementes(); // Recarrega a lista
  };

  const handleCancelarCadastro = () => {
    setAbaAtiva('listar');
    setSementeEditando(null);
  };

  // --- RENDERIZAÇÃO ---
  return (
    <div className="container-banco">
      
      {/* Modal de Exclusão Global */}
      <ModalExcluir 
        isOpen={modalExcluirAberto}
        onClose={() => setModalExcluirAberto(false)}
        onConfirm={handleConfirmarExclusao}
        titulo="Excluir Semente"
        mensagem={`Tem certeza que deseja excluir a semente "${sementeParaExcluir?.nomePopular}"?`}
        nomeItem={sementeParaExcluir?.lote}
      />

      <div className="content-banco">
        {/* Menu de Abas */}
        <div className="banco-navegacao"> 
          <BotaoSubmenus
            menus={menusNavegacao}
            activeMenuId={abaAtiva}
            onMenuClick={handleMenuClick} 
          />
        </div>
        
        <main>
          {erro && (
            <div className="alert-error" style={{ color: 'red', margin: '10px' }}>
              {erro}
            </div>
          )}
          
          {abaAtiva === 'listar' ? (
            <div className="content-lista-full">
              <ListaSementes 
                sementes={sementes} 
                loading={loading}
                
                // Props de Paginação e Busca
                paginaAtual={paginaAtual}
                totalPaginas={totalPaginas}
                onPageChange={handleTrocaPagina}
                termoBusca={termoBusca}
                onSearchChange={handleBusca}
                onRecarregar={fetchSementes}
                
                // Props de Ação
                onEditar={handleEditar}   
                onSolicitarExclusao={handleSolicitarExclusao}
                
                // Props de Ordenação
                ordemAtual={ordem}
                direcaoAtual={direcao}
                onOrdenar={handleOrdenar}
              />
            </div>
          ) : (
            <div className="content-semente-form">
              <FormularioSemente 
                onSuccess={handleSucessoCadastro}
                onCancel={handleCancelarCadastro} 
                sementeParaEditar={sementeEditando}
                
                // Props do IBGE
                listaEstados={estados}
                listaCidades={cidades}
                onEstadoChange={handleEstadoChange}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default BancoSementes;