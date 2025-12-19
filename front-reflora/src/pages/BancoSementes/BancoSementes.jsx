import React, { useState, useEffect, useCallback } from 'react'
import ListaSementes from '../../components/ListaSementes/ListaSementes'
import FormularioSemente from '../../components/FormularioSemente/FormularioSemente'
import BotaoSubmenus from '../../components/BotaoSubmenus/BotaoSubmenus'
import { sementesService } from '../../services/sementesService'
import { getBackendErrorMessage } from '../../utils/errorHandler'
import { FaSeedling, FaList } from 'react-icons/fa'
import './BancoSementes.css'

const menusNavegacao = [
    { id: 'cadastrar', label: 'Cadastrar Semente', icon: <FaSeedling />},
    { id: 'listar', label: 'Listar Sementes', icon: <FaList /> },
];

function BancoSementes() {

    const [abaAtiva, setAbaAtiva] = useState('listar');
    
    // Estados para dados principais
    const [sementes, setSementes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');
    
    // Estado para edição (semente sendo editada no momento)
    const [sementeEditando, setSementeEditando] = useState(null);

    // Estados de Paginação e Busca
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [termoBusca, setTermoBusca] = useState('');

    // Estados para Ordenação
    const [ordem, setOrdem] = useState('dataDeCadastro'); 
    const [direcao, setDirecao] = useState('desc');      

    // Estados IBGE
    const [estados, setEstados] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [ufSelecionada, setUfSelecionada] = useState(''); 

    // --- 1. BUSCAR ESTADOS DO IBGE ---
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

    // --- 2. BUSCAR CIDADES ---
    const handleEstadoChange = async (uf) => {
        setUfSelecionada(uf);
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

    // --- FETCH SEMENTES ---
    const fetchSementes = useCallback(async () => {
        setLoading(true);
        try {
            const data = await sementesService.getAll(termoBusca, paginaAtual - 1, 5, ordem, direcao);
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

    // Handlers
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

    const handleEditar = (semente) => {
        setSementeEditando(semente); 
        if (semente.uf) handleEstadoChange(semente.uf);
        setAbaAtiva('cadastrar');    
        setErro('');
    };

    const handleDeletar = async (id) => {
        try {
            await sementesService.delete(id);
            alert("Semente excluída com sucesso!");
            if (sementes.length === 1 && paginaAtual > 1) {
                setPaginaAtual(paginaAtual - 1);
            } else {
                fetchSementes(); 
            }
        } catch (error) {
            const msg = getBackendErrorMessage(error);
            alert(msg);
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
            setUfSelecionada('');
            setCidades([]);
        }
        setAbaAtiva(menuId);
        setErro('');
    }

    return (
        <div className="container-banco">
            <div className="content-banco">
                <div className="banco-navegacao"> 
                    <BotaoSubmenus
                        menus={menusNavegacao}
                        activeMenuId={abaAtiva}
                        onMenuClick={handleMenuClick} />
                </div>
                <main>
                    {erro && <div className="alert-error" style={{color: 'red', margin: '10px'}}>{erro}</div>}
                    
                    {/* AQUI ESTÁ A CORREÇÃO: Usamos classes diferentes para cada aba */}
                    {abaAtiva === 'listar' ? (
                        // Container para a LISTA (Largura Total)
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
                                onDeletar={handleDeletar} 
                                ordemAtual={ordem}
                                direcaoAtual={direcao}
                                onOrdenar={handleOrdenar}
                            />
                        </div>
                    ) : (
                        // Container para o FORMULÁRIO (Largura Controlada e Bonita)
                        <div className="content-semente-form">
                            <FormularioSemente 
                                onSuccess={handleSucessoCadastro}
                                onCancel={handleCancelarCadastro} 
                                sementeParaEditar={sementeEditando}
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