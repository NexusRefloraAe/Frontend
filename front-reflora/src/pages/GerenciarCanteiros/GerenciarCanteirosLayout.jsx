import React from "react";
import { FaSeedling, FaEdit, FaLeaf, FaClipboardList, FaCheckCircle } from "react-icons/fa";
import TabsLayout from "../../components/TabsLayout/TabsLayout";

import CadastrarCanteiro from "./CadastrarCanteiro/CadastrarCanteiro";
import EditarCanteiro from "./EditarCanteiro/EditarCanteiro";
import CadastrarPlantioCanteiro from "./CadastrarPlantioCanteiro/CadastrarPlantioCanteiro";
import EditarPlantioCanteiro from "./EditarPlantioCanteiro/EditarPlantioCanteiro";
import CadastrarInspecaoMudas from "./InspecaoMudas/CadastrarInspecaoMudas";

const GerenciarCanteirosLayout = () => {
  const tabs = [
    {
      id: "cadastrar-canteiro",
      label: "Cadastrar Canteiro",
      icon: <FaSeedling />,
      page: CadastrarCanteiro,
    },
    {
      id: "cadastrar-plantio-canteiro",
      label: "Cadastrar Plantio",
      icon: <FaLeaf />,
      page: CadastrarPlantioCanteiro,
    },
    {
      id: "editar-canteiro",
      label: "Editar Canteiro",
      icon: <FaEdit />,
      page: EditarCanteiro,
    },
    {
      id: "editar-plantio-canteiro",
      label: "Editar Plantio",
      icon: <FaClipboardList />,
      page: EditarPlantioCanteiro,
    },
    {
      id: "cadastrar-inspecao-mudas",
      label: "Inspeção de Mudas",
      icon: <FaCheckCircle />,
      page: CadastrarInspecaoMudas,
    },
  ];

  return <TabsLayout tabs={tabs} defaultTabId="cadastrar-canteiro" />;
};

export default GerenciarCanteirosLayout;
