import Container2 from "./container2";
import { useLocation } from "react-router-dom";

const ContainerWithTitle = () => {
  const location = useLocation();
  const path = location.pathname;

  let title = "";

  if (path === "/") {
    title = "Home";
  } else if (path.startsWith("/banco-sementes")) {
    title = "Banco de Sementes";
  } else if (path.startsWith("/gerenciar-sementes")) {
    title = "Gerenciar Sementes";
  } else {
    title = "";
  }

  return <Container2 Text={title} />;
};

export default ContainerWithTitle;
