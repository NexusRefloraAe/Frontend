import React, { useState, useEffect } from "react";
import TabelaSelecionar from "../../../components/TabelaSelecionar/TabelaSelecionar";
import ModalDetalheGenerico from "../../../components/ModalDetalheGenerico/ModalDetalheGenerico";
// ✅ 1. Importar o componente correto
import EditarPlantioCanteiro from "../EditarPlantioCanteiro/EditarPlantioCanteiro";

const Historico = () => {

    const DADOS_CANTEIROS_MOCK = [

        { id: 1, NomeCanteiro: 'Canteiro 1', NomePopular: 'Ipê-amarelo', Quantidade: 500, Localizacao: 'Setor A', DataPlantio: '2024-01-15', Responsavel: 'João Silva' },

        { id: 2, NomeCanteiro: 'Canteiro 2', NomePopular: 'Ipê-rosa', Quantidade: 2000, Localizacao: 'Setor B', DataPlantio: '2024-02-20', Responsavel: 'Maria Santos' },

        { id: 3, NomeCanteiro: 'Canteiro 3', NomePopular: 'Ipê-branco', Quantidade: 6000, Localizacao: 'Setor C', DataPlantio: '2024-01-30', Responsavel: 'Pedro Oliveira' },

        { id: 4, NomeCanteiro: 'Canteiro 4', NomePopular: 'Ipê-branco', Quantidade: 6000, Localizacao: 'Setor D', DataPlantio: '2024-03-10', Responsavel: 'Ana Costa' },

        { id: 5, NomeCanteiro: 'Canteiro 5', NomePopular: 'Ipê-branco', Quantidade: 6000, Localizacao: 'Setor E', DataPlantio: '2024-02-28', Responsavel: 'Carlos Lima' },

        { id: 6, NomeCanteiro: 'Canteiro 6', NomePopular: 'Ipê-branco', Quantidade: 6000, Localizacao: 'Setor F', DataPlantio: '2024-03-15', Responsavel: 'Fernanda Silva' },

        { id: 7, NomeCanteiro: 'Canteiro 7', NomePopular: 'Ipê-branco', Quantidade: 6000, Localizacao: 'Setor G', DataPlantio: '2024-01-20', Responsavel: 'Roberto Alves' },

        { id: 8, NomeCanteiro: 'Canteiro 8', NomePopular: 'Ipê-roxo', Quantidade: 3000, Localizacao: 'Setor H', DataPlantio: '2024-02-05', Responsavel: 'Juliana Santos' },

        { id: 9, NomeCanteiro: 'Canteiro 9', NomePopular: 'Ipê-verde', Quantidade: 4000, Localizacao: 'Setor I', DataPlantio: '2024-03-01', Responsavel: 'Paulo Mendes' },

        { id: 10, NomeCanteiro: 'Canteiro 10', NomePopular: 'Ipê-amarelo', Quantidade: 2500, Localizacao: 'Setor J', DataPlantio: '2024-02-15', Responsavel: 'Camila Oliveira' },

    ];

    const [canteiros, setCanteiros] = useState([]);
    const [modalDetalheAberto, setModalDetalheAberto] = useState(false);
    const [canteiroSelecionado, setCanteiroSelecionado] = useState(null);
    const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);

    useEffect(() => {
        setCanteiros(DADOS_CANTEIROS_MOCK);
    }, []);

    const colunas = [
        { key: "NomeCanteiro", label: "Nome dos Canteiros" },
        { key: "NomePopular", label: "Nome Popular" },
        { key: "Quantidade", label: "Quantidade" },
    ];

    const handleDetalheCanteiro = (canteiro) => {
        setCanteiroSelecionado(canteiro);
        setModalDetalheAberto(true);
    };

    const handleFecharModalDetalhe = () => {
        setModalDetalheAberto(false);
        setCanteiroSelecionado(null);
    };

    const handleEditarCanteiro = (canteiro) => {
        console.log("Abrir edição para:", canteiro);
        setCanteiroSelecionado(canteiro);
        setModalDetalheAberto(false);
        setModalEdicaoAberto(true);
    };

    const handleExcluirCanteiro = (canteiro) => {
        setCanteiros(canteiros.filter(c => c.id !== canteiro.id));
        handleFecharModalDetalhe();
        alert(`Canteiro ${canteiro.NomeCanteiro} excluído com sucesso!`);
    };

    const handleExportarCanteiro = (canteiro) => {
        alert(`Exportando dados do canteiro: ${canteiro.NomeCanteiro}`);
    };

    const handleSalvarEdicao = (canteiroAtualizado) => {
        setCanteiros(prev =>
            prev.map(c => c.id === canteiroAtualizado.id ? canteiroAtualizado : c)
        );
        setModalEdicaoAberto(false);
        setCanteiroSelecionado(null);
    };

    const handleCancelarEdicao = () => {
        setModalEdicaoAberto(false);
        setCanteiroSelecionado(null);
    };

    const dadosHistoricoEntrada = [
        { data: '20/05/2025', quantidade: 2000, responsavel: '', tipo: '', nomePopular: 'Ipê-amarelo' },
        { data: '20/05/2025', quantidade: 1000, responsavel: '', tipo: '', nomePopular: 'Ipê-branco' },
    ];
    const dadosHistoricoSaida = [
        { data: '30/05/2025', quantidade: 1000, responsavel: '', tipo: '', nomePopular: 'Ipê-amarelo' },
        { data: '30/05/2025', quantidade: 800, responsavel: '', tipo: '', nomePopular: 'Ipê-branco' },
    ];

    const handleSelecionarItens = (itensSelecionados) => {
        if (itensSelecionados.length === 0) {
            alert("Nenhum item selecionado!");
            return;
        }
        const canteirosAtualizados = [...canteiros];
        itensSelecionados.forEach(({ item, quantidade }) => {
            const index = canteirosAtualizados.findIndex(c => c.id === item.id);
            if (index !== -1) {
                canteirosAtualizados[index].Quantidade = Math.max(
                    0,
                    canteirosAtualizados[index].Quantidade - quantidade
                );
            }
        });
        setCanteiros(canteirosAtualizados);
        alert(`Saída confirmada para ${itensSelecionados.length} item(ns)!`);
    };

    const handleQuantidadeChange = (item, quantidade) => {
        console.log(`Quantidade alterada para ${item.NomeCanteiro}: ${quantidade}`);
    };

    return (
        <div className="historico-page-container">
            <div className="historico-content-wrapper">
                <TabelaSelecionar
                    // ... (props da tabela)
                    titulo="Histórico de Canteiro"
                    dados={canteiros}
                    colunas={colunas}
                    chaveBusca="NomePopular"
                    onSelecionar={handleSelecionarItens}
                    onQuantidadeChange={handleQuantidadeChange}
                    onDetalheCanteiro={handleDetalheCanteiro}
                    chaveQuantidade="Quantidade"
                    textoBotaoConfirmar="Confirmar Saída"
                    itensPorPagina={7}
                    habilitarBusca={true}
                    modoBusca="auto"
                />
            </div>

            {/* Modal de Detalhes (sem mudanças) */}
            
                <ModalDetalheGenerico
                    isOpen={modalDetalheAberto} 
                    item={canteiroSelecionado}
                    camposDetalhes={[
                        { label: 'Nome:', chave: 'NomeCanteiro' },
                        { label: 'Data de cadastro:', valorPadrao: 'xx/xx/xxxx' },
                        { label: 'Quantidade atual:', chave: 'Quantidade' },
                        { label: 'Espaço disponível:', valorPadrao: 700 },
                        { label: 'Capacidade de armazenamento:', valorPadrao: 1200 },
                    ]}
                    colunasEntrada={[
                        { titulo: 'Nome Popular', chave: 'nomePopular' },
                        { titulo: 'Data', chave: 'data' },
                        { titulo: 'Quantidade', chave: 'quantidade' },
                    ]}
                    colunasSaida={[
                        { titulo: 'Nome Popular', chave: 'nomePopular' },
                        { titulo: 'Data', chave: 'data' },
                        { titulo: 'Quantidade', chave: 'quantidade' },
                    ]}
                    dadosEntrada={dadosHistoricoEntrada}
                    dadosSaida={dadosHistoricoSaida}
                    onClose={handleFecharModalDetalhe}
                    onEditar={handleEditarCanteiro}
                    onExcluir={handleExcluirCanteiro}
                    onExportar={handleExportarCanteiro}
                    textoExclusao="o canteiro"
                    mostrarAcoes={true}
                    mostrarHistorico={true}
                    mostrarExportar={true}
                />
           

            {/* ✅ 2. MODAL DE EDIÇÃO */}
            {modalEdicaoAberto && canteiroSelecionado && (
                <div className="modal-overlay" onClick={handleCancelarEdicao}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                        style={{ maxWidth: '700px', width: '95%', padding: '0' }}
                    >
                        <button
                            className="modal-close-button"
                            onClick={handleCancelarEdicao}
                            style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', zIndex: 10 }}
                        >
                            ✕
                        </button>

                        {/* ✅ 3. Componente trocado! */}
                        <EditarPlantioCanteiro
                            itemParaEditar={canteiroSelecionado}
                            onSave={handleSalvarEdicao}
                            onCancel={handleCancelarEdicao}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Historico;