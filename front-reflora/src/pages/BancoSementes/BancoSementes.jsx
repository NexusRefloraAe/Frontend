import React, { useState, useEffect, useCallback } from 'react'
import ListaSementes from '../../components/ListaSementes/ListaSementes'
import FormularioSemente from '../../components/FormularioSemente/FormularioSemente'
import BotaoSubmenus from '../../components/BotaoSubmenus/BotaoSubmenus'
import { sementesService } from '../../services/sementesService'
import { getBackendErrorMessage } from '../../utils/errorHandler'
import { FaSeedling, FaList } from 'react-icons/fa'
import './BancoSementes.css'
import BotaoSubmenus from '../../components/BotaoSubmenus/BotaoSubmenus'
import FormularioSemente from '../../components/FormularioSemente/FormularioSemente'

const menusNavegacao = [
    { id: 'cadastrar', label: 'Cadastrar Semente', icon: <FaSeedling />},
    { id: 'listar', label: 'Listar Sementes', icon: <FaList /> },
];

function Banco() {

    const [abaAtiva, setAbaAtiva] = useState('listar');
    
    // Estados para dados
    const [sementes, setSementes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');
    
    // Estado para edição (semente sendo editada no momento)
    const [sementeEditando, setSementeEditando] = useState(null);

    // Estados de Paginação e Busca
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [termoBusca, setTermoBusca] = useState('');

        // --- NOVOS ESTADOS PARA ORDENAÇÃO ---
    const [ordem, setOrdem] = useState('dataDeCadastro'); // Campo padrão inicial
    const [direcao, setDirecao] = useState('desc');       // Direção padrão inicial

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

    const handleBusca = (novoTermo) => {
        setTermoBusca(novoTermo);
        setPaginaAtual(1);
    };

    const handleTrocaPagina = (novaPagina) => {
        setPaginaAtual(novaPagina);
    };

    // --- NOVA FUNÇÃO DE ORDENAÇÃO ---
    const handleOrdenar = (novoCampo) => {
        if (novoCampo === ordem) {
            // Se clicou no mesmo campo, inverte a direção (asc <-> desc)
            setDirecao(direcao === 'asc' ? 'desc' : 'asc');
        } else {
            // Se clicou em um campo novo, define ele como atual e reseta para ascendente
            setOrdem(novoCampo);
            setDirecao('asc');
        }
        // Reseta para a primeira página ao reordenar para evitar confusão visual
        setPaginaAtual(1);
    };

    // --- FUNÇÕES QUE FALTAVAM ---

    // 1. Função para preparar a edição
    const handleEditar = (semente) => {
        setSementeEditando(semente); // Salva a semente no estado
        setAbaAtiva('cadastrar');    // Troca para a aba do formulário
        setErro('');
    };

    // 2. Função para deletar
    const handleDeletar = async (id) => {
        try {
            await sementesService.delete(id);
            alert("Semente excluída com sucesso!");
            if (sementes.length === 1 && paginaAtual > 1) {
                // Se for o último item e não estivermos na pág 1, voltamos uma página.
                // Ao mudar o estado 'paginaAtual', o useEffect disparará o fetchSementes automaticamente.
                setPaginaAtual(paginaAtual - 1);
            } else {
                // Caso contrário, apenas recarrega a lista na página atual
                fetchSementes(); 
            }
        } catch (error) {
            const msg = getBackendErrorMessage(error);
            alert(msg);
        }
    };

    const handleSucessoCadastro = () => {
        setSementeEditando(null); // Limpa a edição
        setAbaAtiva('listar');
        setPaginaAtual(1);
        fetchSementes();
    };

    const handleCancelarCadastro = () => {
        setSementeEditando(null); // Limpa a edição se cancelar
        setAbaAtiva('listar');
    };

    const handleMenuClick = (menuId) => {
        if (menuId === 'cadastrar') setSementeEditando(null); // Se clicar na aba, limpa edição
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
                    
                    {abaAtiva === 'listar' ? (
                        <ListaSementes 
                            sementes={sementes} 
                            loading={loading}
                            paginaAtual={paginaAtual}
                            totalPaginas={totalPaginas}
                            onPageChange={handleTrocaPagina}
                            termoBusca={termoBusca}
                            onSearchChange={handleBusca}
                            
                            // PASSANDO AS FUNÇÕES PARA O FILHO
                            onRecarregar={fetchSementes}
                            onEditar={handleEditar}   // <--- Aqui
                            onDeletar={handleDeletar} // <--- Aqui

                            ordemAtual={ordem}
                            direcaoAtual={direcao}
                            onOrdenar={handleOrdenar}
                        />
                    ) : (
                        <FormularioSemente 
                            onSuccess={handleSucessoCadastro}
                            onCancel={handleCancelarCadastro} // <--- Passando o cancelar
                            sementeParaEditar={sementeEditando} // <--- Passando o dado para editar
                        />
                    )}
                </main>
            </div>
        </div>
    )
}

export default Banco;