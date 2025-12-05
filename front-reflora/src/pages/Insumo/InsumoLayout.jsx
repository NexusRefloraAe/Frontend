import React from "react";
import { FaPlusCircle, FaHistory, FaChartBar } from "react-icons/fa"; 
import TabsLayout from "../../components/TabsLayout/TabsLayout";
import Cadastrar from "./Cadastrar/Cadastrar";
import CadastrarEmprestimo from "./CadastrarEmprestimo/CadastrarEmprestimo";
import HistoricoMaterial from "./HistoricoMaterial/HistoricoMaterial";
import HistoricoFerramenta from "./HistoricoFerramenta/HistoricoFerramenta";
import GerarRelatorioInsumo from "./GerarRelatorioInsumo/GerarRelatorioInsumo";

const InsumoLayout = () => {
  const tabs = [
    {
      id: "cadastrar",
      label: "Cadastrar Insumo",
      icon: <FaPlusCircle />,
      page: <Cadastrar />, // ✅ CORRIGIDO: elemento JSX
    },
    {
      id: "cadastrar-emprestimo",
      label: "Cadastrar Emprestimo",
      icon: <FaPlusCircle />,
      page: <CadastrarEmprestimo />, // ✅ CORRIGIDO: elemento JSX
    },
    {
      id: "historico-material", 
      label: "Histórico Material",
      icon: <FaHistory />,
      page: <HistoricoMaterial />, // ✅ CORRIGIDO: elemento JSX
    },
    {
      id: "historico-ferramenta", 
      label: "Histórico Ferramenta",
      icon: <FaHistory />,
      page: <HistoricoFerramenta />, // ✅ CORRIGIDO: elemento JSX
    },
    {
      id: "gerar-relatorio-insumo",
      label: "Relatório",
      icon: <FaChartBar />,
      page: <GerarRelatorioInsumo />, // ✅ CORRIGIDO: elemento JSX
    },
  ];

  return <TabsLayout tabs={tabs} defaultTabId="cadastrar" />;
};

export default InsumoLayout;