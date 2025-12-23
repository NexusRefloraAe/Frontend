import React, { useState, useEffect, useCallback } from 'react';
import ListaSementes from '../../components/ListaSementes/ListaSementes';
import FormularioSemente from '../../components/FormularioSemente/FormularioSemente';
import BotaoSubmenus from '../../components/BotaoSubmenus/BotaoSubmenus';
import ModalExcluir from '../../components/ModalExcluir/ModalExcluir';
import { sementesService } from '../../services/sementesService';
import { getBackendErrorMessage } from '../../utils/errorHandler';
import { FaSeedling, FaList } from 'react-icons/fa';
import './BancoSementes.css';

const menusNavegacao = [
    { id: 'cadastrar', label: 'Cadastrar Semente', icon: <FaSeedling />},
    { id: 'listar', label: 'Listar Sementes', icon: <FaList /> },
];

function BancoSementes() {

    const [abaAtiva, setAbaAtiva] = useState('listar');
    
    // Estados de Dados
    const [sementes, setSementes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');
    const [sementeEditando, setSementeEditando] = useState(null);

    // Estados de Paginação e Busca
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [termoBusca, setTermoBusca] = useState('');

    // Estados de Ordenação
    const [ordem, setOrdem] = useState('dataDeCadastro'); 
    const [direcao, setDirecao] = useState('desc');      

    // Estados Auxiliares (IBGE) - Centralizados aqui para não duplicar requisições
    const [estados, setEstados] = useState([]);
    const [cidades, setCidades] = useState([]);
    // const [ufSelecionada, setUfSelecionada] = useState(''); // Não é estritamente necessário no pai se o filho gerencia o select, mas mantemos para carregar cidades

    // Estados do Modal de Exclusão
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
    const [sementeParaExcluir, setSementeParaExcluir] = useState(null);

    const ITENS_POR_PAGINA = 5;

    // --- 1. BUSCAR ESTADOS (Carrega apenas uma vez) ---
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

    // --- 2. BUSCAR CIDADES (Chamado quando o formulário solicita) ---
    const handleEstadoChange = async (uf) => {
        // setUfSelecionada(uf);
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

    // --- 3. FETCH SEMENTES (Lista Principal) ---
    const fetchSementes = useCallback(async () => {
        setLoading(true);
        try {
            const data = await sementesService.getAll(termoBusca, paginaAtual - 1, ITENS_POR_PAGINA, ordem, direcao);
            setSementes(data.content);
            const total = data.totalPages || data.page?.totalPages || 1;
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

    useEffect(() => {
        if (abaAtiva === 'listar') {
            fetchSementes();
        }
    }, [abaAtiva, fetchSementes]);

    // --- HANDLERS DE EXCLUSÃO ---
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

            // Lógica inteligente de recarregamento
            if (sementes.length === 1 && paginaAtual > 1) {
                setPaginaAtual(paginaAtual - 1); // Volta uma página se apagou o último item
            } else {
                fetchSementes(); 
            }
        } catch (error) {
            const msg = getBackendErrorMessage(error);
            setModalExcluirAberto(false); 
            alert(msg);
        }
    };

    // --- HANDLERS GERAIS ---
    const handleBusca = (novoTermo) => {
        setTermoBusca(novoTermo);
        setPaginaAtual(1);
    };

    const handleTrocaPagina = (novaPagina) => {
        setPaginaAtual(novaPagina);
    };

    const handleOrdenar = (novoCampo) => {
        if (novoCampo === ordem) {
            setDirecao(direcao === 'asc' ? 'desc' : 'asc');
        } else {
            setOrdem(novoCampo);
            setDirecao('asc');
        }
        setPaginaAtual(1);
    };

    const handleEditar = async (sementeResumida) => {
        setLoading(true); 
        try {
            // 1. Busca dados completos
            const sementeCompleta = await sementesService.getById(sementeResumida.id);
            setSementeEditando(sementeCompleta); 
            
            // 2. Pré-carrega as cidades do estado dessa semente para o select funcionar
            if (sementeCompleta.estado) { 
                await handleEstadoChange(sementeCompleta.estado);
            }
            
            // 3. Troca a aba
            setAbaAtiva('cadastrar');
            setErro('');
        } catch (error) {
            console.error("Erro edição:", error);
            setErro("Erro ao carregar semente para edição.");
        } finally {
            setLoading(false);
        }
    };

    const handleSucessoCadastro = () => {
        setSementeEditando(null); 
        setAbaAtiva('listar');
        setPaginaAtual(1);
        fetchSementes();
    };

    const handleCancelarCadastro = () => {
        setSementeEditando(null);
        setAbaAtiva('listar');
    };

    const handleMenuClick = (menuId) => {
        if (menuId === 'cadastrar') {
            setSementeEditando(null);
            setCidades([]); // Limpa cidades ao iniciar novo cadastro
        }
        setAbaAtiva(menuId);
        setErro('');
    }

    return (
        <div className="container-banco">

            {/* Modal Global de Exclusão */}
            <ModalExcluir 
                isOpen={modalExcluirAberto}
                onClose={() => setModalExcluirAberto(false)}
                onConfirm={handleConfirmarExclusao}
                titulo="Excluir Semente"
                mensagem={`Tem certeza que deseja excluir a semente "${sementeParaExcluir?.nomePopular}"?`}
                nomeItem={sementeParaExcluir?.lote}
            />

            <div className="content-banco">
                <div className="banco-navegacao"> 
                    <BotaoSubmenus
                        menus={menusNavegacao}
                        activeMenuId={abaAtiva}
                        onMenuClick={handleMenuClick} />
                </div>
                
                <main>
                    {erro && <div className="alert-error" style={{color: 'red', margin: '10px'}}>{erro}</div>}
                    
                    {abaAtiva === 'listar' ? (
                        // WRAPPER LISTA (100% largura)
                        <div className="content-lista-full">
                            <ListaSementes 
                                sementes={sementes} 
                                loading={loading}
                                paginaAtual={paginaAtual}
                                totalPaginas={totalPaginas}
                                onPageChange={handleTrocaPagina}
                                termoBusca={termoBusca}
                                onSearchChange={handleBusca}
                                onRecarregar={fetchSementes}
                                onEditar={handleEditar}   
                                onSolicitarExclusao={handleSolicitarExclusao}
                                ordemAtual={ordem}
                                direcaoAtual={direcao}
                                onOrdenar={handleOrdenar}
                            />
                        </div>
                    ) : (
                        // WRAPPER FORMULÁRIO (Largura controlada)
                        <div className="content-semente-form">
                            <FormularioSemente 
                                onSuccess={handleSucessoCadastro}
                                onCancel={handleCancelarCadastro} 
                                sementeParaEditar={sementeEditando}
                                
                                // Passando dados do IBGE para o filho não precisar buscar de novo
                                listaEstados={estados}
                                listaCidades={cidades}
                                onEstadoChange={handleEstadoChange}
                            />
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default BancoSementes;