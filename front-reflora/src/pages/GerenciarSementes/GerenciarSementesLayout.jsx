import React, { useEffect, useState, useMemo } from "react";
import {
  FaSeedling,
  FaEdit,
  FaLeaf,
  FaClipboardList,
  FaCheckCircle,
} from "react-icons/fa";
import TabsLayout from "../../components/TabsLayout/TabsLayout";
import CadastrarPlantio from "./CadastrarPlantio/CadastrarPlantio";
import HistoricoPlantio from "./HistoricoPlantio/HistoricoPlantio";
import CadastrarTestes from "./CadastrarTestes/CadastrarTestes";
import HistoricoTestes from "./HistoricoTestes/HistoricoTestes";
import GerarRelatorio from "./GerarRelatorio/GerarRelatorio";
import { useLocation } from "react-router-dom";

const GerenciarSementesLayout = () => {
  const location = useLocation();
  // ✅ CORREÇÃO: Inicializa os estados IMEDIATAMENTE com o que vem da navegação
  const [dadosParaCorrecao, setDadosParaCorrecao] = useState(
    location.state?.dadosParaCorrecao || null
  );
  const [abaAtiva, setAbaAtiva] = useState(
    location.state?.abaAlvo || "Cadastrar-Plantio"
  );

  useEffect(() => {
    if (location.state?.dadosParaCorrecao) {
      setDadosParaCorrecao(location.state.dadosParaCorrecao);
      setAbaAtiva(location.state.abaAlvo);

      // Limpa para não dar erro no refresh, mas o estado local 'dadosParaCorrecao' mantém os dados
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // useMemo evita a recriação do array e garante chaves únicas para o React
  const tabs = useMemo(
    () => [
      {
        id: "Cadastrar-Plantio",
        label: "Cadastrar Plantio",
        icon: <FaSeedling />,
        // Passa dados apenas se esta aba for a ativa na correção
        page: (
          <CadastrarPlantio
            dadosParaCorrecao={dadosParaCorrecao}
          />
        ),
      },
      {
        id: "Histórico-Plantio",
        label: "Histórico Plantio",
        icon: <FaLeaf />,
        page: <HistoricoPlantio />,
      },
      {
        id: "Cadastrar-Teste",
        label: "Cadastrar Teste",
        icon: <FaEdit />,
        page: (
          <CadastrarTestes
            dadosParaCorrecao={dadosParaCorrecao}
          />
        ),
      },
      {
        id: "Histórico-Testes",
        label: "Histórico Testes",
        icon: <FaClipboardList />,
        page: <HistoricoTestes />,
      },
      {
        id: "Gerar-Relatório",
        label: "Gerar Relatório",
        icon: <FaCheckCircle />,
        page: <GerarRelatorio />,
      },
    ],
    [dadosParaCorrecao]
  );

  // key={location.key} força o componente a resetar apenas em navegações reais
  return <TabsLayout key={location.key} tabs={tabs} defaultTabId={abaAtiva} />;
};

export default GerenciarSementesLayout;
