import React from "react";
import { FaSeedling, FaLeaf, FaClipboardList, FaCheckCircle, FaFileAlt } from "react-icons/fa";
import TabsLayout from "../../components/TabsLayout/TabsLayout";
import CadastrarCanteiro from "./CadastrarCanteiro/CadastrarCanteiro";
import CadastrarPlantioCanteiro from "./CadastrarPlantioCanteiro/CadastrarPlantioCanteiro";
import CadastrarInspecaoMudas from "./CadastrarInspecao/CadastrarInspecaoMudas";
import Historico from "./Historico/Historico";
import HistoricoInspecao from "./HistoricoInspecao/HistoricoInspecao";
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
      id: "cadastrar-inspecao-mudas",
      label: "Cadastrar Inspeção",
      icon: <FaCheckCircle />,
      page: <CadastrarInspecaoMudas />,
    },
    {
      id: "historico-inspecao",
      label: "Histórico de Inspeção",
      icon: <FaCheckCircle />,
      page: <HistoricoInspecao />,
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