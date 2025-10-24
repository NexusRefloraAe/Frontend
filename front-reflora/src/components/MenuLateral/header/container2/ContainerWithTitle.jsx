import Container2 from "./container2";
import { useLocation } from "react-router-dom";

const ContainerWithTitle = () => {
  const location = useLocation();
  const path = location.pathname;

  let title = "";

  if (path === "/home") {
    title = "Menu Inicial";
  } else if (path.startsWith("/banco-sementes")) {
    title = "Banco de Sementes";
  } else if (path.startsWith("/gerenciar-sementes")) {
    title = "Gerenciar Sementes";
  } else if (path.startsWith("/gerenciar-canteiros")) {
    title = "Gerenciar Canteiros";
  } else if (path.startsWith("/distribuicao-mudas")) {
    title = "Distribuir Mudas";
  } else if (path.startsWith("/configuracoes")) {
    title = "Configurações";
  } else {
    title = "";
  }

  return <Container2 Text={title} />;
};

export default ContainerWithTitle;
