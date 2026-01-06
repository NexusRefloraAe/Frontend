import React from "react";
import { FaPlusCircle, FaHistory, FaChartBar, FaThList, FaExchangeAlt } from "react-icons/fa"; // Adicionei FaExchangeAlt para movimentação
import TabsLayout from "../../components/TabsLayout/TabsLayout";

// Imports existentes
import Cadastrar from "./Cadastrar/Cadastrar";
import HistoricoMaterial from "./HistoricoMaterial/HistoricoMaterial";
import HistoricoFerramenta from "./HistoricoFerramenta/HistoricoFerramenta";
import GerarRelatorioInsumo from "./GerarRelatorioInsumo/GerarRelatorioInsumo";
import GerenciarInsumos from "./GerenciarInsumos/GerenciarInsumos";

// --- CORREÇÃO AQUI ---
// Se você renomeou o arquivo, mude o import abaixo. 
// Certifique-se que o arquivo 'RegistrarSaidaEmprestimo.jsx' existe na pasta 'CadastrarEmprestimo'
import RegistrarSaidaEmprestimo from "./CadastrarEmprestimo/RegistrarSaidaEmprestimo"; 

const InsumoLayout = () => {
  const tabs = [
    {
      id: "cadastrar",
      label: "Cadastrar Insumo",
      icon: <FaPlusCircle />,
      page: <Cadastrar />,
    },
    {
      id: "registrar-saida", // Mudei o ID para ficar coerente
      label: "Registrar Empréstimo", // Label atualizado
      icon: <FaExchangeAlt />, // Ícone de troca/movimentação
      page: <RegistrarSaidaEmprestimo />, // Componente novo
    },
    {
      id: "gerenciar-estoque",
      label: "Gerenciar Estoque",
      icon: <FaThList />,
      page: <GerenciarInsumos />,
    },
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