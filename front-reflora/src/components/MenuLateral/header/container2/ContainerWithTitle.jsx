import Container2 from "./container2";
import { useLocation } from "react-router-dom";

const ContainerWithTitle = () => {
  const location = useLocation();

  // Define o título baseado na rota atual
  let title = "";
  switch (location.pathname) {
    case "/":
      title = "Home";
      break;
    case "/banco-sementes":
      title = "Banco de Sementes";
      break;
    default:
      title = "";
  }

  // Aqui é onde usamos o Container2 de verdade
  return <Container2 Text={title} />;
};

export default ContainerWithTitle