import React, { useState, useEffect } from "react";
import FormGeral from "../../../components/FormGeral/FormGeral";
import Input from "../../../components/Input/Input";

const formatarDataParaInput = (dataDDMMYYYY) => {
  if (!dataDDMMYYYY) return "";
  const parts = dataDDMMYYYY.split("/");
  if (parts.length === 3) {
    // [DD, MM, YYYY] -> YYYY-MM-DD
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return "";
};

const EditarVistoria = ({ isOpen, onClose, onSave, itemParaEditar }) => {
  const [formData, setFormData] = useState({
    id: "",
    loteMuda: "",
    // nomePopular: '',
    nomeCanteiro: "",
    nomePopular: "",
    dataVistoria: "",
    tratosCulturais: "",
    estadoSaude: "",
    doencasPragas: "",
    estimativaMudasProntas: 0,
    nomeResponsavel: "",
    observacao: "",
  });

  useEffect(() => {
    if (itemParaEditar) {
      setFormData({
        id: itemParaEditar.id,
        loteMuda: itemParaEditar.loteMuda || "",
        nomePopular: itemParaEditar.nomePopular || "",
        nomeCanteiro: itemParaEditar.nomeCanteiro || "",
        dataVistoria: formatarDataParaInput(itemParaEditar.dataVistoria),
        tratosCulturais: itemParaEditar.tratosCulturais || "",
        estadoSaude: itemParaEditar.estadoSaude || "",
        doencasPragas: itemParaEditar.doencasPragas || "",
        estimativaMudasProntas: itemParaEditar.estimativaMudasProntas || 0,
        nomeResponsavel: itemParaEditar.nomeResponsavel || "",
        observacao: itemParaEditar.observacao || "",
      });
    }
  }, [itemParaEditar]);

  if (!isOpen) {
    return null;
  }

  const handleCancel = (confirmar = true) => {
    if (confirmar) {
      if (
        window.confirm(
          "Deseja cancelar? As alterações não salvas serão perdidas."
        )
      ) {
        onClose(); // Chama a função do 'Historico.jsx'
      }
    } else {
      onClose();
    }
  };

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEstimativaInc = () => {
    setFormData((prev) => ({
      ...prev,
      estimativaMudas: prev.estimativaMudas + 1,
    }));
  };

  const handleEstimativaDec = () => {
    setFormData((prev) => ({
      ...prev,
      estimativaMudas: Math.max(0, prev.estimativaMudas - 1),
    }));
  };

  // Handler 'onSave' (chama a prop com os dados)
  const handleSubmit = () => {
    onSave(formData);
  };

  const actions = [
    {
      type: "button",
      variant: "action-secondary",
      children: "Cancelar",
      onClick: () => handleCancel(true),
    },
    {
      type: "submit",
      variant: "primary",
      children: "Salvar Edições",
    },
  ];

  // JSX envolvido em um overlay de modal
  return (
    <div className="modal-overlay" onClick={() => handleCancel(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "700px" }}
      >
        {/* Botão de fechar (opcional mas recomendado) */}
        <button
          className="modal-close-button"
          onClick={() => handleCancel(false)}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          &times;
        </button>

        {/* O seu formulário 'Editar' original está aqui dentro */}
        <div className="editar-vistoria">
          <FormGeral
            title="Editar Vistoria"
            actions={actions}
            onSubmit={handleSubmit}
            useGrid={false}
          >
            {/* Todos os seus 'input-row' e 'Input'
                    permanecem exatamente como estavam.
                    */}
            <div className="input-row">
              <Input label="Lote" value={formData.loteMuda} disabled={true} />
              <Input
                label="Canteiro"
                value={formData.nomeCanteiro}
                disabled={true}
              />
            </div>

            <div className="input-row">
              <Input
                label="Nome Popular"
                value={formData.nomePopular}
                disabled={true}
              />
              <Input
                label="Data da Vistoria"
                name="dataVistoria"
                type="date"
                value={formData.dataVistoria}
                onChange={handleChange("dataVistoria")}
                required={true}
              />
            </div>

            <div className="input-row">
              <Input
                label="Estado de Saúde"
                name="estadoSaude"
                type="select"
                value={formData.estadoSaude}
                onChange={handleChange("estadoSaude")}
                required={true}
                options={[
                  { value: "Excelente", label: "Excelente" },
                  { value: "Boa", label: "Boa" },
                  { value: "Regular", label: "Regular" },
                  { value: "Ruim", label: "Ruim" },
                  { value: "Péssima", label: "Péssima" },
                ]}
              />
              <Input
                label="Tratos Culturais"
                name="tratosCulturais"
                type="select"
                value={formData.tratosCulturais}
                onChange={handleChange("tratosCulturais")}
                required={true}
                options={[
                  { value: "Nenhum", label: "Nenhum" },
                  { value: "Adubação", label: "Adubação" },
                  { value: "Rega", label: "Rega" },
                  { value: "Adubação e Rega", label: "Adubação e Rega" },
                ]}
              />
            </div>
            <div className="input-row">
              <Input
                label="Estimativa de Mudas"
                name="estimativaMudasProntas"
                type="number"
                value={formData.estimativaMudasProntas}
                onChange={handleChange("estimativaMudasProntas")}
                onIncrement={handleEstimativaInc}
                onDecrement={handleEstimativaDec}
                onKeyDown={(e) => {
                  if (["e", "E", ",", "."].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                required={true}
              />
              <Input
                label="Nome do Responsável"
                name="nomeResponsavel"
                type="text"
                value={formData.nomeResponsavel}
                onChange={handleChange("nomeResponsavel")}
                required={true}
              />
            </div>
            <Input
              label="Observações"
              name="observacao"
              type="textarea"
              value={formData.observacao}
              onChange={handleChange("observacao")}
              required={false}
              rows={4}
            />
          </FormGeral>
        </div>
      </div>
    </div>
  );
};

export default EditarVistoria;
