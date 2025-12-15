import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import FiltrosRelatorio from "../../../components/FiltrosRelatorio/FiltrosRelatorio"; // 👈 Importado
import './HistoricoFerramenta.css';

import ModalDetalheGenerico from "../../../components/ModalDetalheGenerico/ModalDetalheGenerico"; // 👈 Importado
import EditarFerramenta from "../EditarFerramenta/EditarFerramenta";
import ModalExcluir from "../../../components/ModalExcluir/ModalExcluir";
import DetalhesFerramenta from "./DetalhesFerramenta/DetalhesFerramenta";
const HistoricoFerramenta = () => {
    const DADOS_HISTORICO_FERRAMENTA_MOCK = [
        // 👇 IDs adicionados
        { id: 1, NomeInsumo: 'Ancinho', Data: '11/09/2025', Status: 'Entrada', Quantidade: 50, UnidadeMedida: 'Unidade', ResponsavelEntrega: 'Arthur', ResponsavelRecebe: 'Ramil' },
        { id: 2, NomeInsumo: 'Pá Grande', Data: '11/09/2025', Status: 'Emprestada', Quantidade: 10, UnidadeMedida: 'Unidade', ResponsavelEntrega: 'Ramil', ResponsavelRecebe: 'Arthur' },
        { id: 3, NomeInsumo: 'Enxada', Data: '11/09/2025', Status: 'Devolvida', Quantidade: 10, UnidadeMedida: 'Unidade', ResponsavelEntrega: 'Arthur', ResponsavelRecebe: 'Ramil' },
        { id: 4, NomeInsumo: 'Cavadeira', Data: '11/09/2025', Status: 'Emprestada', Quantidade: 75, UnidadeMedida: 'Unidade', ResponsavelEntrega: 'Ramil', ResponsavelRecebe: 'Arthur' },
        { id: 5, NomeInsumo: 'Regador', Data: '11/09/2025', Status: 'Entrada', Quantidade: 50, UnidadeMedida: 'Unidade', ResponsavelEntrega: 'Arthur', ResponsavelRecebe: 'Ramil' },
        { id: 6, NomeInsumo: 'Podão', Data: '12/09/2025', Status: 'Emprestada', Quantidade: 20, UnidadeMedida: 'Unidade', ResponsavelEntrega: 'Maria', ResponsavelRecebe: 'João' },
        { id: 7, NomeInsumo: 'Tesoura de Podar', Data: '13/09/2025', Status: 'Devolvida', Quantidade: 15, UnidadeMedida: 'Unidade', ResponsavelEntrega: 'João', ResponsavelRecebe: 'Maria' },
        { id: 8, NomeInsumo: 'Rastelo', Data: '14/09/2025', Status: 'Entrada', Quantidade: 30, UnidadeMedida: 'Unidade', ResponsavelEntrega: 'Carlos', ResponsavelRecebe: 'Ana' },
        { id: 9, NomeInsumo: 'Martelo', Data: '15/09/2025', Status: 'Emprestada', Quantidade: 8, UnidadeMedida: 'Unidade', ResponsavelEntrega: 'Ana', ResponsavelRecebe: 'Carlos' },
        { id: 10, NomeInsumo: 'Serrote', Data: '16/09/2025', Status: 'Entrada', Quantidade: 12, UnidadeMedida: 'Unidade', ResponsavelEntrega: 'Pedro', ResponsavelRecebe: 'Lucas' },
    ];

    const [ferramentas, setFerramentas] = useState([]);
    const [filtros, setFiltros] = useState({
        nomeInsumo: '',
        dataInicio: '',
        dataFim: ''
    });

    // Estados unificados para controlar os modais
    const [itemSelecionado, setItemSelecionado] = useState(null);
    const [modalDetalheAberto, setModalDetalheAberto] = useState(false);
    const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
    const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);

    useEffect(() => {
        setFerramentas(DADOS_HISTORICO_FERRAMENTA_MOCK);
    }, []);

    // Lógica de Filtro
    const handleFiltroChange = (name, value) => {
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const handlePesquisar = () => {
        const { nomeInsumo, dataInicio, dataFim } = filtros;
        const dadosFiltrados = DADOS_HISTORICO_FERRAMENTA_MOCK.filter(item => {
            const matchesNome = !nomeInsumo ||
                item.NomeInsumo.toLowerCase().includes(nomeInsumo.toLowerCase());

            let matchesData = true;
            if (dataInicio || dataFim) {
                const [day, month, year] = item.Data.split('/');
                const itemDate = new Date(`${year}-${month}-${day}`);
                const startDate = dataInicio ? new Date(dataInicio) : null;
                const endDate = dataFim ? new Date(dataFim) : null;

                if (endDate) endDate.setDate(endDate.getDate() + 1); // Inclui o dia final

                if (startDate && (isNaN(itemDate) || itemDate < startDate)) matchesData = false;
                if (endDate && (isNaN(itemDate) || itemDate >= endDate)) matchesData = false;
            }
            return matchesNome && matchesData;
        });
        setFerramentas(dadosFiltrados);
    };

    // Handlers unificados para abrir os modais
    const handleVisualizar = (item) => {
        setItemSelecionado(item);
        setModalDetalheAberto(true);
    };

    const handleEditar = (item) => {
        setItemSelecionado(item);
        setModalDetalheAberto(false);
        setModalEdicaoAberto(true);
    };

    const handleExcluir = (item) => {
        setItemSelecionado(item);
        setModalDetalheAberto(false);
        setModalExclusaoAberto(true);
    };

    // Handlers para fechar/salvar
    const handleFecharModalDetalhe = () => {
        setModalDetalheAberto(false);
        setItemSelecionado(null);
    };

    const handleSalvarEdicao = (dadosAtualizados) => {
        setFerramentas(prev =>
            prev.map(item =>
                item.id === dadosAtualizados.id ? dadosAtualizados : item
            )
        );
        console.log("Ferramenta atualizada:", dadosAtualizados);
        setModalEdicaoAberto(false);
        setItemSelecionado(null);
    };

    const handleConfirmarExclusao = () => {
        if (itemSelecionado) {
            setFerramentas(prev =>
                prev.filter(item => item.id !== itemSelecionado.id)
            );
            console.log("Ferramenta excluída:", itemSelecionado);
        }
        setModalExclusaoAberto(false);
        setItemSelecionado(null);
    };

    const handleCancelarEdicao = () => {
        setModalEdicaoAberto(false);
        setItemSelecionado(null);
    };

    const handleCancelarExclusao = () => {
        setModalExclusaoAberto(false);
        setItemSelecionado(null);
    };

    const colunas = [
        { key: "NomeInsumo", label: "Nome do Insumo" },
        { key: "Data", label: "Data" },
        { key: "Status", label: "Status" },
        { key: "Quantidade", label: "Quantidade" },
        { key: "UnidadeMedida", label: "Unidade de Medida" },
        { key: "ResponsavelEntrega", label: "Responsável pela Entrega" },
        { key: "ResponsavelRecebe", label: "Responsável por Receber" },
    ];

    

    return (
        <div className="historico-ferramenta-container">
            {/* Layout de Filtros (ADICIONADO) */}
            <div className="header-filtros">
                <h1>Histórico de Movimentação</h1>
                <FiltrosRelatorio
                    filtros={filtros}
                    onFiltroChange={handleFiltroChange}
                    onPesquisar={handlePesquisar}
                    buttonText="Pesquisar"
                    buttonVariant="success"
                    // Passa os campos de filtro específicos
                    camposFiltro={[
                        { name: 'nomeInsumo', label: 'Nome da Ferramenta', type: 'text' },
                        { name: 'dataInicio', label: 'Data Início', type: 'date' },
                        { name: 'dataFim', label: 'Data Fim', type: 'date' },
                    ]}
                />
            </div>

            <div className="tabela-wrapper">
                <TabelaComBuscaPaginacao
                    titulo="Histórico de Movimentação de Ferramentas"
                    dados={ferramentas}
                    colunas={colunas}
                    chaveBusca="NomeInsumo"
                    mostrarBusca={true}
                    mostrarAcoes={true}
                    // Handlers atualizados
                    onEditar={handleEditar}
                    onConfirmar={handleVisualizar} // 👈 'onConfirmar' chama 'handleVisualizar'
                    onExcluir={handleExcluir}
                />
            </div>

            {/* Renderização dos 3 modais */}

            {/* MODAL DE DETALHES (Visualizar) - (ADICIONADO) */}

            <ModalDetalheGenerico
                isOpen={modalDetalheAberto}
                item={itemSelecionado}
                titulo="Detalhes da Movimentação"
                camposDetalhes={[]}
                onClose={handleFecharModalDetalhe}
                onEditar={() => handleEditar(itemSelecionado)}
                onExcluir={() => handleExcluir(itemSelecionado)}
                mostrarHistorico={false}
                mostrarExportar={false}
                mostrarAcoes={true}
            >
                < DetalhesFerramenta item={itemSelecionado} />
            </ModalDetalheGenerico>


            {/* MODAL DE EDIÇÃO DE FERRAMENTA */}
            <EditarFerramenta
                isOpen={modalEdicaoAberto}
                onClose={handleCancelarEdicao}
                onSalvar={handleSalvarEdicao}
                // Prop padronizada para 'itemParaEditar'
                itemParaEditar={itemSelecionado}
            />

            {/* MODAL DE EXCLUSÃO */}
            <ModalExcluir
                isOpen={modalExclusaoAberto}
                onClose={handleCancelarExclusao}
                onConfirm={handleConfirmarExclusao}
                nomeItem={itemSelecionado?.NomeInsumo} // Usa 'itemSelecionado'
                titulo="Excluir Ferramenta"
                mensagem={`Tem certeza que deseja excluir "${itemSelecionado?.NomeInsumo}" do histórico? Esta ação não pode ser desfeita.`}
                textoConfirmar="Excluir"
                textoCancelar="Cancelar"
            />
        </div>
    );
};

export default HistoricoFerramenta;