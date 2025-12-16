import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import Sidebar from "../sidebar/Sidebar";
import "./MenuLaderal.css";

const MenuLaderal = ({ isSidebarOpen, onToggleSidebar, onCloseSidebar, isMobile }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* No desktop: sidebar sempre visível e fixa */}
      {!isMobile && <Sidebar fixed />}

      {/* No mobile: sidebar toggle */}
      {isMobile && (
        <>
          {/* Botão para abrir sidebar no mobile */}
          <div className="Container">
            <div className="MenuToggle" onClick={onToggleSidebar}>
              <FaBars />
            </div>
          </div>

          {/* Sidebar overlay no mobile */}
          {isSidebarOpen && <Sidebar active={onCloseSidebar} />}
        </>
      )}
    </>
  );
};

export default MenuLaderal;