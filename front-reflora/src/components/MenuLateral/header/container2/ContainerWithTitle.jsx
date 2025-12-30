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
    
    // Rotas de Distribuição
    "/distribuicao-mudas": "Distribuir Mudas",  
    "/termo-compromisso": "Distribuir Mudas", 
    "/distribuicao-mudas/relatorio": "Relatório de Distribuição", // Rota específica
    
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

  // LÓGICA DE CORREÇÃO:
  // Ordena as chaves pelo tamanho (da maior para a menor string)
  // Isso garante que "/distribuicao-mudas/relatorio" seja verificado ANTES de "/distribuicao-mudas"
  const sortedRoutes = Object.keys(titleMap).sort((a, b) => b.length - a.length);

  let title = ""; // Título padrão

  for (const route of sortedRoutes) {
    if (path === route || path.startsWith(route)) {
      title = titleMap[route];
      break; // Para no primeiro match (o mais específico/longo)
    }
  }

  return <Container2 Text={title} onMenuClick={onMenuClick} isMobile={isMobile} />;
};

export default ContainerWithTitle;