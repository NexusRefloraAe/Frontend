import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import Sidebar from "../sidebar/Sidebar";
import "./MenuLaderal.css";

const MenuLaderal = () => {
  const [sidebar, setSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  // Atualiza o estado ao redimensionar a tela
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebar(!sidebar);

  return (
    <div className="Container">
      {/* Exibe o botão de abrir apenas no mobile */}
      {isMobile && (
        <div className="MenuToggle" onClick={toggleSidebar}>
          <FaBars />
        </div>
      )}

      {/* No desktop, sidebar sempre aberta */}
      {!isMobile && <Sidebar fixed />}

      {/* No mobile, abre/fecha com o botão */}
      {isMobile && sidebar && <Sidebar active={setSidebar} />}
    </div>
  );
};

export default MenuLaderal;
