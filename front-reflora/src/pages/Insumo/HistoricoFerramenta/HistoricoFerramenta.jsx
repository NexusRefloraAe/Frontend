import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import EditarFerramenta from "../EditarFerramenta/EditarFerramenta";
import ModalExcluir from "../../../components/ModalExcluir/ModalExcluir";
import './HistoricoFerramenta.css';

const HistoricoFerramenta = () => {
    const DADOS_HISTORICO_FERRAMENTA_MOCK = [
        { NomeInsumo: 'Ancinho', Data: '11/09/2025', Status: 'Entrada', Quantidade: 50, UnidadeMedida: 'Unidade', ResponsavelEntrega: 'Arthur', ResponsavelRecebe: 'Ramil' },
        { NomeInsumo: 'Pá Grande', Data: '11/09/2025', Status: 'Emprestada', Quantidade: 10, UnidadeMedida: 'Unidade', ResponsavelEntrega: 'Ramil', ResponsavelRecebe: 'Arthur' },
        { NomeInsumo: 'Enxada', Data: '11/09/2025', Status: 'Devolvida', Quantidade: 10, UnidadeMedida: 'Unidade', ResponsavelEntrega: 'Arthur', ResponsavelRecebe: 'Ramil' },
        { NomeInsumo: 'Cavadeira', Data: '11/09/2025', Status: 'Emprestada', Quantidade: 75, UnidadeMedida: 'Unidade', ResponsavelEntrega: 'Ramil', ResponsavelRecebe: 'Arthur' },
        { NomeInsumo: 'Regador', Data: '11/09/2025', Status: 'Entrada', Quantidade: 50, UnidadeMedida: 'Unidade', ResponsavelEntrega: 'Arthur', ResponsavelRecebe: 'Ramil' },
        { NomeInsumo: 'Podão', Data: '12/09/2025', Status: 'Emprestada', Quantidade: 20, UnidadeMedida: 'Unidade', ResponsavelEntrega: 'Maria', ResponsavelRecebe: 'João' },
        { NomeInsumo: 'Tesoura de Podar', Data: '13/09/2025', Status: 'Devolvida', Quantidade: 15, UnidadeMedida: 'Unidade', ResponsavelEntrega: 'João', ResponsavelRecebe: 'Maria' },
        { NomeInsumo: 'Rastelo', Data: '14/09/2025', Status: 'Entrada', Quantidade: 30, UnidadeMedida: 'Unidade', ResponsavelEntrega: 'Carlos', ResponsavelRecebe: 'Ana' },
        { NomeInsumo: 'Martelo', Data: '15/09/2025', Status: 'Emprestada', Quantidade: 8, UnidadeMedida: 'Unidade', ResponsavelEntrega: 'Ana', ResponsavelRecebe: 'Carlos' },
        { NomeInsumo: 'Serrote', Data: '16/09/2025', Status: 'Entrada', Quantidade: 12, UnidadeMedida: 'Unidade', ResponsavelEntrega: 'Pedro', ResponsavelRecebe: 'Lucas' },
    ];

    const [dados, setDados] = useState([]);
    const [ferramentaEditando, setFerramentaEditando] = useState(null);
    const [ferramentaExcluindo, setFerramentaExcluindo] = useState(null);
    const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
    const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);

    useEffect(() => {
        setDados(DADOS_HISTORICO_FERRAMENTA_MOCK);
    }, []);

    const handleEditar = (ferramenta) => {
        setFerramentaEditando(ferramenta);
        setModalEdicaoAberto(true);
    };

    const handleExcluir = (ferramenta) => {
        setFerramentaExcluindo(ferramenta);
        setModalExclusaoAberto(true);
    };

    const handleSalvarEdicao = (dadosEditados) => {
        setDados(prev => prev.map(item => 
            item.NomeInsumo === ferramentaEditando.NomeInsumo && 
            item.Data === ferramentaEditando.Data ? 
            { 
                ...item, 
                NomeInsumo: dadosEditados.nomeInsumo,
                Status: dadosEditados.status,
                Quantidade: dadosEditados.quantidade,
                UnidadeMedida: dadosEditados.unidadeMedida,
                Data: dadosEditados.dataRegistro,
                ResponsavelEntrega: dadosEditados.responsavelEntrega,
                ResponsavelRecebe: dadosEditados.responsavelReceber
            } : item
        ));
        
        console.log("Ferramenta atualizada:", dadosEditados);
        setModalEdicaoAberto(false);
        setFerramentaEditando(null);
    };

    const handleConfirmarExclusao = () => {
        if (ferramentaExcluindo) {
            setDados(prev => prev.filter(item => 
                !(item.NomeInsumo === ferramentaExcluindo.NomeInsumo && 
                  item.Data === ferramentaExcluindo.Data)
            ));
            console.log("Ferramenta excluída:", ferramentaExcluindo);
        }
        setModalExclusaoAberto(false);
        setFerramentaExcluindo(null);
    };

    const handleCancelarEdicao = () => {
        setModalEdicaoAberto(false);
        setFerramentaEditando(null);
    };

    const handleCancelarExclusao = () => {
        setModalExclusaoAberto(false);
        setFerramentaExcluindo(null);
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
            {/* MODAL DE EDIÇÃO DE FERRAMENTA */}
            <EditarFerramenta
                isOpen={modalEdicaoAberto}
                onClose={handleCancelarEdicao}
                ferramenta={ferramentaEditando}
                onSalvar={handleSalvarEdicao}
            />

            {/* MODAL DE EXCLUSÃO */}
            <ModalExcluir
                isOpen={modalExclusaoAberto}
                onClose={handleCancelarExclusao}
                onConfirm={handleConfirmarExclusao}
                nomeItem={ferramentaExcluindo?.NomeInsumo}
                titulo="Excluir Ferramenta"
                mensagem={`Tem certeza que deseja excluir "${ferramentaExcluindo?.NomeInsumo}" do histórico? Esta ação não pode ser desfeita.`}
                textoConfirmar="Excluir"
                textoCancelar="Cancelar"
            />

            <div className="tabela-wrapper">
                <TabelaComBuscaPaginacao
                    titulo="Histórico de Movimentação de Ferramentas"
                    dados={dados}
                    colunas={colunas}
                    chaveBusca="NomeInsumo"
                    mostrarBusca={true}
                    mostrarAcoes={true}
                    onEditar={handleEditar}
                    onConfirmar={(item) => console.log("Visualizar:", item)}
                    onExcluir={handleExcluir}
                />
            </div>
        </div>
    );
};

export default HistoricoFerramenta;