import React, { useState, useRef, useEffect } from "react";
import { FaShareAlt } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CSVLink } from "react-csv";
import "./ExportButton.css";

const ExportButton = ({ 
  tipo = "exportar", // "exportar" ou "selecionar"
  data = [], 
  columns = [], 
  fileName = "relatorio",
  onClick,
  disabled = false,
  selecionadosCount = 0
}) => {
    const [menuAberto, setMenuAberto] = useState(false);
    const menuRef = useRef(null);

    const headers = columns.map((col) => ({
        label: col.label,
        key: col.key,
    }));

    const exportarPDF = () => {
        if (!data.length) {
            alert("Não há dados para exportar!");
            return;
        }

        const doc = new jsPDF();
        doc.text(fileName, 14, 15);

        autoTable(doc, {
            head: [columns.map((col) => col.label)],
            body: data.map((item) => columns.map((col) => item[col.key])),
            startY: 25,
        });

        doc.save(`${fileName}.pdf`);
    };

    // Fecha o menu se clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuAberto(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (tipo === "selecionar") {
        return (
            <button 
                className={`btn-selecionar ${disabled ? 'disabled' : ''}`}
                onClick={onClick}
                disabled={disabled}
            >
                Selecionar ({selecionadosCount})
            </button>
        );
    }

    // Tipo exportar (padrão)
    return (
        <div className="export-dropdown" ref={menuRef}>
            <button
                className="btn-exportar"
                onClick={() => setMenuAberto(!menuAberto)}
            >
                Exportar <FaShareAlt />
            </button>

            {menuAberto && (
                <div className="export-menu">
                    <button onClick={exportarPDF}>Exportar PDF</button>

                    <CSVLink
                        data={data}
                        headers={headers}
                        filename={`${fileName}.csv`}
                        className="csv-link"
                    >
                        Exportar CSV
                    </CSVLink>
                </div>
            )}
        </div>
    );
};

export default ExportButton;