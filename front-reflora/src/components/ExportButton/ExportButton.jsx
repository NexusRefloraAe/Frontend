import React, { useState, useRef, useEffect } from "react";
import { FaShareAlt } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CSVLink } from "react-csv";
import "./ExportButton.css";

const ExportButton = ({ 
  tipo = "exportar", 
  data = [], 
  columns = [], 
  fileName = "relatorio",
  onClick,
  disabled = false,
  selecionadosCount = 0,
  onExportPDF, // <--- NOVA PROP (Função opcional)
  onExportCSV
}) => {
    const [menuAberto, setMenuAberto] = useState(false);
    const menuRef = useRef(null);

    const headers = columns.map((col) => ({
        label: col.label,
        key: col.key,
    }));

    const handleExportarCSV = () => {
        if (onExportCSV) {
            onExportCSV();
            setMenuAberto(false);
        }
    };

    const handleExportarPDF = () => {
        // 1. Se foi passada uma função para baixar do servidor, usa ela
        if (onExportPDF) {
            onExportPDF();
            setMenuAberto(false); // Fecha o menu
            return;
        }

        // 2. Caso contrário, usa a lógica antiga (Client-side jsPDF)
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
        setMenuAberto(false);
    };

    // ... (useEffect e lógica do tipo 'selecionar' mantêm iguais) ...
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
                    {/* Alterado para chamar o handleExportarPDF */}
                    <button onClick={handleExportarPDF}>Exportar PDF</button>

                    {/* LÓGICA CONDICIONAL PARA O CSV */}
                    {onExportCSV ? (
                        // Opção 1: CSV via Backend (Botão comum)
                        <button onClick={handleExportarCSV}>
                            Exportar CSV
                        </button>
                    ) : (
                        // Opção 2: CSV via React (Client-side) - Mantém compatibilidade
                        <CSVLink
                            data={data}
                            headers={headers}
                            filename={`${fileName}.csv`}
                            className="csv-link"
                        >
                            Exportar CSV
                        </CSVLink>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExportButton;