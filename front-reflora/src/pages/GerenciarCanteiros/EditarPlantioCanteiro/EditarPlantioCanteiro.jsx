import React, { useState, useEffect } from "react";
import FormGeral from "../../../components/FormGeral/FormGeral";
import Input from "../../../components/Input/Input";
import { plantioCanteiroService } from "../../../services/plantioCanteiroService";
import { FaEdit } from "react-icons/fa";

const EditarPlantioCanteiro = ({ itemParaEditar, onSave, onCancel }) => {
  const [lotes, setLotes] = useState([]);
  const [loteSelecionado, setLoteSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    quantidade: 0,
    dataPlantio: "",
  });

  const paraInputDate = (dataBR) => {
    if (!dataBR) return "";
    const [dia, mes, ano] = dataBR.split("/");
    return `${ano}-${mes}-${dia}`;
  };

  useEffect(() => {
    const carregarLotes = async () => {
      setLoading(true);
      try {
        const nome = itemParaEditar.NomeCanteiro || itemParaEditar.nome;
        const data = await plantioCanteiroService.getByCanteiro(nome); //
        setLotes(data);

        if (itemParaEditar?.lote) {
          const loteEncontrado = data.find((l) => l.id === itemParaEditar.id);
          if (loteEncontrado) selecionarLote(loteEncontrado);
        }
      } catch (error) {
        console.error("Erro ao carregar lotes", error);
      } finally {
        setLoading(false);
      }
    };
    if (itemParaEditar) carregarLotes();
  }, [itemParaEditar]);

  const selecionarLote = (lote) => {
    setLoteSelecionado(lote);
    setFormData({
      quantidade: lote.quantidade || 0,
      dataPlantio: paraInputDate(lote.dataPlantio),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loteSelecionado) return alert("Selecione um lote na lista.");
    onSave({
      //
      id: loteSelecionado.id,
      quantidade: formData.quantidade,
      dataPlantio: formData.dataPlantio,
    });
  };

  // ESTILOS AJUSTADOS
  const tableHeaderStyle = {
    backgroundColor: "#4CAF50", // Verde conforme solicitado
    color: "white", // Texto branco conforme solicitado
    position: "sticky",
    top: 0,
    zIndex: 1,
  };

  const tableCellStyle = {
    padding: "12px 8px",
    borderBottom: "1px solid #eee",
    verticalAlign: "middle", // Garante alinhamento vertical
  };

  const editButtonStyle = {
    cursor: "pointer",
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    // IMPORTANTE: inline-flex permite centralização via textAlign no pai (td)
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "13px",
    transition: "all 0.2s",
  };

  return (
    <FormGeral
      title={`Editar Plantio no ${itemParaEditar?.nome || ""}`}
      actions={[
        {
          type: "button",
          variant: "action-secondary",
          children: "Cancelar",
          onClick: onCancel,
        },
        {
          type: "submit",
          variant: "primary",
          children: "Salvar Alterações",
          disabled: !loteSelecionado,
        },
      ]}
      onSubmit={handleSubmit}
      useGrid={true}
    >
      <div className="form-geral__campo--span-2">
        <label
          style={{ fontWeight: "bold", marginBottom: "10px", display: "block" }}
        >
          Selecione o lote para editar:
        </label>
        <div
          style={{
            maxHeight: "220px",
            overflowY: "auto",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={tableHeaderStyle}>
              <tr>
                <th style={{ ...tableCellStyle, textAlign: "left" }}>Lote</th>
                <th style={{ ...tableCellStyle, textAlign: "left" }}>
                  Espécie
                </th>
                <th style={{ ...tableCellStyle, textAlign: "center" }}>Qtd</th>
                <th style={{ ...tableCellStyle, textAlign: "center" }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {lotes.map((l) => (
                <tr
                  key={l.id}
                  style={{
                    backgroundColor:
                      loteSelecionado?.id === l.id ? "#e8f5e9" : "transparent",
                  }}
                >
                  <td style={tableCellStyle}>{l.lote}</td>
                  <td style={tableCellStyle}>{l.nomeEspecie}</td>
                  <td style={{ ...tableCellStyle, textAlign: "center" }}>
                    {l.quantidade}
                  </td>
                  {/* Célula centralizada para o botão */}
                  <td style={{ ...tableCellStyle, textAlign: "center" }}>
                    <button
                      type="button"
                      onClick={() => selecionarLote(l)}
                      style={{
                        ...editButtonStyle,
                        backgroundColor:
                          loteSelecionado?.id === l.id ? "#4CAF50" : "#e0e0e0",
                        color: loteSelecionado?.id === l.id ? "white" : "#333",
                      }}
                    >
                      <FaEdit /> Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {loteSelecionado && (
        <>
          <div
            className="form-geral__campo--span-2"
            style={{
              backgroundColor: "#e8f5e9",
              padding: "15px",
              borderRadius: "8px",
              borderLeft: "5px solid #4CAF50",
              marginTop: "10px",
            }}
          >
            <p style={{ margin: 0, color: "#2e7d32" }}>
              Editando Lote: <strong>{loteSelecionado.lote}</strong>
            </p>
          </div>

          <div className="form-geral__campo--span-2">
            <Input
              label="Nova Quantidade"
              type="number"
              value={formData.quantidade}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  quantidade: Number(e.target.value),
                }))
              }
              onIncrement={() =>
                setFormData((p) => ({ ...p, quantidade: p.quantidade + 1 }))
              }
              onDecrement={() =>
                setFormData((p) => ({
                  ...p,
                  quantidade: p.quantidade > 0 ? p.quantidade - 1 : 0,
                }))
              }
              onKeyDown={(e) => {
                if (["e", "E", ",", "."].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              required
            />
          </div>

          <div className="form-geral__campo--span-2">
            <Input
              label="Nova Data de Plantio"
              type="date"
              value={formData.dataPlantio}
              onChange={(e) =>
                setFormData((p) => ({ ...p, dataPlantio: e.target.value }))
              }
              required
            />
          </div>
        </>
      )}
    </FormGeral>
  );
};

export default EditarPlantioCanteiro;
