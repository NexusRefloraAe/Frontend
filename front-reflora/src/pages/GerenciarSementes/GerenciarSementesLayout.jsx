import React from "react";
import { FaSeedling, FaEdit, FaLeaf, FaClipboardList, FaCheckCircle } from "react-icons/fa";
import TabsLayout from "../../components/TabsLayout/TabsLayout";
import CadastrarPlantio from "./CadastrarPlantio/CadastrarPlantio";
import HistoricoPlantio from "./HistoricoPlantio/HistoricoPlantio";
import CadastrarTestes from "./CadastrarTestes/CadastrarTestes";
import HistoricoTestes from "./HistoricoTestes/HistoricoTestes";
import GerarRelatorio from "./GerarRelatorio/GerarRelatorio";

const GerenciarSementesLayout = () => {
   const tabs = [
    {
      id: "Cadastrar-Plantio",
      label: "Cadastrar Plantio",
      icon: <FaSeedling />,
      page: <CadastrarPlantio />, // ✅ CORRIGIDO: elemento JSX
    },
    {
      id: "Histórico-Plantio",
      label: "Histórico Plantio",
      icon: <FaLeaf />,
      page: <HistoricoPlantio />, // ✅ CORRIGIDO: elemento JSX
    },
    {
      id: "Cadastrar-Teste",
      label: "Cadastrar Teste",
      icon: <FaEdit />,
      page: <CadastrarTestes />, // ✅ CORRIGIDO: elemento JSX
    },
    {
      id: "Histórico-Testes",
      label: "Histórico Testes",
      icon: <FaClipboardList />,
      page: <HistoricoTestes />, // ✅ CORRIGIDO: elemento JSX
    },
    {
      id: "Gerar-Relatório",
      label: "Gerar Relatório",
      icon: <FaCheckCircle />,
      page: <GerarRelatorio />, // ✅ CORRIGIDO: elemento JSX
    },
  ];

  return <TabsLayout tabs={tabs} defaultTabId="Cadastrar-Plantio" />;
};
  
export default GerenciarSementesLayout;