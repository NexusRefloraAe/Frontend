import React, { useState, useEffect } from "react";
import { FaSeedling, FaLeaf } from "react-icons/fa";
import TabsLayout from "../../components/TabsLayout/TabsLayout"; // ajuste o caminho se necessário
import ListaSementes from "../../components/ListaSementes/ListaSementes";
import FormularioSemente from "../../components/FormularioSemente/FormularioSemente";
import "./BancoSementes.css";

// 🔹 Dados mockados
const DADOS_SEMENTES_MOCK = [
  { id: "A001", dataCadastro: "10/10/2024", nome: "Ipê-amarelo", qtdAtual: "2000 kg", qtdSaida: 200, finalidade: "germinacao" },
  { id: "A002", dataCadastro: "11/10/2024", nome: "Quaresmeira", qtdAtual: "1500 kg", qtdSaida: 0, finalidade: "plantio" },
  { id: "B001", dataCadastro: "12/10/2024", nome: "Pau-Brasil", qtdAtual: "500 kg", qtdSaida: 0, finalidade: "germinacao" },
  { id: "C003", dataCadastro: "13/10/2024", nome: "Manacá-da-serra", qtdAtual: "800 kg", qtdSaida: 0, finalidade: "plantio" },
];

function Banco() {
  const [sementes, setSementes] = useState([]);

  useEffect(() => {
    setSementes(DADOS_SEMENTES_MOCK);
  }, []);

  // 🔹 Define as abas (Tabs)
  const tabs = [
    {
      id: "cadastrar",
      label: "Cadastrar Semente",
      icon: <FaSeedling />,
      page: FormularioSemente,
    },
    {
      id: "listar",
      label: "Listar Sementes",
      icon: <FaLeaf />,
      page: () => <ListaSementes sementes={sementes} />,
    },
  ];

  return <TabsLayout tabs={tabs} defaultTabId="listar" />;
}

export default Banco;
