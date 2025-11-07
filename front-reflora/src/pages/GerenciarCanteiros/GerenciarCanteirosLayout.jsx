import React from "react";
import { FaSeedling, FaLeaf, FaClipboardList, FaCheckCircle, FaFileAlt } from "react-icons/fa";
import TabsLayout from "../../components/TabsLayout/TabsLayout";
import CadastrarCanteiro from "./CadastrarCanteiro/CadastrarCanteiro";
import CadastrarPlantioCanteiro from "./CadastrarPlantioCanteiro/CadastrarPlantioCanteiro";
import EditarPlantioCanteiro from "./EditarPlantioCanteiro/EditarPlantioCanteiro";
import CadastrarInspecaoMudas from "./InspecaoMudas/CadastrarInspecaoMudas";
import Historico from "./Historico/Historico";
import RelatorioCanteiro from "./RelatorioCanteiro/RelatorioCanteiro";

const GerenciarCanteirosLayout = () => {

  const tabs = [
    {
      id: "cadastrar-canteiro",
      label: "Cadastrar Canteiro",
      icon: <FaSeedling />,
      page: <CadastrarCanteiro />,
    },
    {
      id: "cadastrar-plantio-canteiro",
      label: "Cadastrar Plantio",
      icon: <FaLeaf />,
      page: <CadastrarPlantioCanteiro />,
    },
    
    {
      id: "editar-plantio-canteiro",
      label: "Editar Plantio",
      icon: <FaClipboardList />,
      page: <EditarPlantioCanteiro />,
    },
    {
      id: "cadastrar-inspecao-mudas",
      label: "Vistoria de Mudas",
      icon: <FaCheckCircle />,
      page: <CadastrarInspecaoMudas />,
    },
    {
      id: "historico",
      label: "Histórico Canteiro",
      icon: <FaCheckCircle />,
      page: <Historico />,
    },
    {
      id: "relatorio-canteiro",
      label: "Relatório Canteiro",
      icon: <FaFileAlt />,
      page: <RelatorioCanteiro />,
    },
  ];

  return <TabsLayout tabs={tabs} defaultTabId="cadastrar-canteiro" />;
};

export default GerenciarCanteirosLayout;