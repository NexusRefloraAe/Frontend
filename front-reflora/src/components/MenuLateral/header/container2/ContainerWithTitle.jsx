import Container2 from "./container2";
import { useLocation } from "react-router-dom";

const ContainerWithTitle = ({ onMenuClick, isMobile }) => {
  const location = useLocation();
  const path = location.pathname;

  // Mapa de rotas para títulos
  const titleMap = {
    "/home": "Menu Inicial",
    "/banco-sementes": "Banco de Sementes",
    "/gerenciar-sementes": "Gerenciar Sementes",
    "/gerenciar-canteiros": "Gerenciar Canteiros",
    "/distribuicao-mudas": "Distribuir Mudas",
    "/termo-compromisso": "Distribuir Mudas",
    "/vistoria": "Vistoria das mudas",
    "/insumo": "Gestão de Insumo",
    "/relatorios": "Relatórios",
    "/gerenciar-canteiros/relatorio": "Relatório de Canteiros",
    "/vistoria/relatorio-vistoria": "Relatório de Vistorias",
    "/gerenciamento-sementes/relatorio": "Relatório de Sementes",
    "/insumo/relatorio-materiais": "Relatório de Materiais",
    "/configuracoes": "Configurações",
    "/notificacoes": "Notificações",
  };

  // Encontra o título correspondente
  let title = "";
  for (const [route, routeTitle] of Object.entries(titleMap)) {
    if (path === route || path.startsWith(route)) {
      title = routeTitle;
      break;
    }
  }

  return <Container2 Text={title} onMenuClick={onMenuClick} isMobile={isMobile} />;
};

export default ContainerWithTitle;