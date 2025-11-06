import React from "react";
import { FaPlusCircle, FaHistory, FaChartBar } from "react-icons/fa"; 
import TabsLayout from "../../components/TabsLayout/TabsLayout";
import Cadastrar from "./Cadastrar/Cadastrar";
import HistoricoMaterial from "./HistoricoMaterial/HistoricoMaterial";
import HistoricoFerramenta from "./HistoricoFerramenta/HistoricoFerramenta";
import GerarRelatorioInsumo from "./GerarRelatorioInsumo/GerarRelatorioInsumo";

const InsumoLayout = () => {
  const tabs = [
    {
      id: "cadastrar",
      label: "Cadastrar",
      icon: <FaPlusCircle />,
      page: Cadastrar,
    },
    {
      id: "historico-material", 
      label: "Histórico Material",
      icon: <FaHistory />,
      page: HistoricoMaterial,
    },
    {
      id: "historico-ferramenta", 
      label: "Histórico Ferramenta",
      icon: <FaHistory />,
      page: HistoricoFerramenta,
    },
    {
      id: "gerar-relatorio-insumo",
      label: "Relatório",
      icon: <FaChartBar />,
      page: GerarRelatorioInsumo,
    },
  ];

  return <TabsLayout tabs={tabs} defaultTabId="cadastrar" />;
};

export default InsumoLayout;