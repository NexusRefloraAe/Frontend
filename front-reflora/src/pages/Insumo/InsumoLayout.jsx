import React from "react";
// Adicionei FaThList para representar a lista de estoque
import { FaPlusCircle, FaHistory, FaChartBar, FaThList } from "react-icons/fa"; 
import TabsLayout from "../../components/TabsLayout/TabsLayout";

// Imports das telas existentes
import Cadastrar from "./Cadastrar/Cadastrar";
import CadastrarEmprestimo from "./CadastrarEmprestimo/CadastrarEmprestimo";
import HistoricoMaterial from "./HistoricoMaterial/HistoricoMaterial";
import HistoricoFerramenta from "./HistoricoFerramenta/HistoricoFerramenta";
import GerarRelatorioInsumo from "./GerarRelatorioInsumo/GerarRelatorioInsumo";

// ✅ IMPORTAR A NOVA TELA (Ajuste o caminho se necessário)
import GerenciarInsumos from "./GerenciarInsumos/GerenciarInsumos"; 

const InsumoLayout = () => {
  const tabs = [
    {
      id: "cadastrar",
      label: "Cadastrar Insumo",
      icon: <FaPlusCircle />,
      page: <Cadastrar />,
    },
    {
      id: "cadastrar-emprestimo",
      label: "Cadastrar Empréstimo",
      icon: <FaPlusCircle />,
      page: <CadastrarEmprestimo />,
    },
    // --- NOVA ABA ADICIONADA AQUI ---
    {
      id: "gerenciar-estoque",
      label: "Gerenciar Estoque", // Ou "Lista de Insumos"
      icon: <FaThList />,
      page: <GerenciarInsumos />, // Essa tela terá a lista com Qtd Atual e botão Excluir Definitivo
    },
    // --------------------------------
    {
      id: "historico-material", 
      label: "Histórico Material",
      icon: <FaHistory />,
      page: <HistoricoMaterial />,
    },
    {
      id: "historico-ferramenta", 
      label: "Histórico Ferramenta",
      icon: <FaHistory />,
      page: <HistoricoFerramenta />,
    },
    {
      id: "gerar-relatorio-insumo",
      label: "Relatório",
      icon: <FaChartBar />,
      page: <GerarRelatorioInsumo />,
    },
  ];

  return <TabsLayout tabs={tabs} defaultTabId="cadastrar" />;
};

export default InsumoLayout;