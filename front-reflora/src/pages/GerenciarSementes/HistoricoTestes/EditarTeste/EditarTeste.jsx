import { useEffect, useState } from "react";
import FormGeral from "../../../../components/FormGeral/FormGeral";
import Input from "../../../../components/Input/Input";

const EditarTeste = ({ isOpen, onSalvar, onCancelar, teste }) => {
  const [formData, setFormData] = useState({
    lote: "",
    nomePopular: "",
    dataTeste: "",
    quantidade: 0, // Qtd amostra
    camaraFria: "",
    dataGerminacao: "",
    numSementesPlantadas: 0, // NOVO: Amostra técnica
    numSementesGerminaram: 0, // NOVO: Antigo qntdGerminou
    taxaGerminou: "",
  });

  // 1. CÁLCULO AUTOMÁTICO DA TAXA
  // Observa mudanças na quantidade ou no que germinou
  useEffect(() => {
    const totalAmostra = Number(formData.numSementesPlantadas);
    const germinou = Number(formData.numSementesGerminaram);

    if (totalAmostra > 0 && germinou >= 0) {
      const taxa = ((germinou / totalAmostra) * 100).toFixed(2);
      setFormData((prev) => ({ ...prev, taxaGerminou: taxa }));
    } else {
      setFormData((prev) => ({ ...prev, taxaGerminou: "" }));
    }
  }, [formData.numSementesPlantadas, formData.numSementesGerminaram]);

  // 2. CARREGAR DADOS DO BACKEND
  useEffect(() => {
    if (teste) {
      // Helper para garantir que a data vá para o input (yyyy-MM-dd)
      const converterDataInput = (dataStr) => {
        if (!dataStr || dataStr === "-" || !dataStr.includes("/")) return "";
        const [dia, mes, ano] = dataStr.split("/");
        return `${ano}-${mes}-${dia}`;
      };

      setFormData({
        lote: teste.lote || "",
        nomePopular: teste.nomePopularSemente || "", // Chave do Backend
        dataTeste: converterDataInput(teste.dataPlantio), // Chave do Backend
        quantidade: teste.qtdSemente || 0,
        camaraFria: teste.estahNaCamaraFria || "Não",
        dataGerminacao: converterDataInput(teste.dataGerminacao),
        numSementesPlantadas: teste.numSementesPlantadas || 0, // Chave do Backend
        numSementesGerminaram: teste.numSementesGerminaram || 0,
        // Remove o % se vier do backend para não quebrar o cálculo
        taxaGerminou: teste.taxaGerminacao
          ? String(teste.taxaGerminacao).replace("%", "")
          : "",
      });
    }
  }, [teste]);

  const handleCancel = (confirmar = true) => {
    if (confirmar) {
      if (
        window.confirm(
          "Deseja cancelar? As alterações não salvas serão perdidas."
        )
      ) {
        onCancelar();
      }
    } else {
      onCancelar();
    }
  };

  // 3. SUBMIT LIMPO (O Segredo do PUT)
  const handleSubmit = () => {
    // Enviamos o ID e os dados do Form sem formatar.
    // O Service fará a conversão para o DTO do Java.
    const dadosParaSalvar = {
      id: teste.id,
      ...formData,
    };
    onSalvar(dadosParaSalvar);
  };

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIncrement = (field) => () => {
    setFormData((prev) => ({ ...prev, [field]: prev[field] + 1 }));
  };
  const handleDecrement = (field) => () => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(0, prev[field] - 1),
    }));
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => handleCancel(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-button"
          onClick={() => handleCancel(true)}
        >
          &times;
        </button>
        <FormGeral
          actions={actions}
          useGrid={true}
          onSubmit={handleSubmit}
          title="Editar Teste de Germinação"
        >
          <Input
            label="Lote"
            name="lote"
            type="text"
            value={formData.lote}
            onChange={handleChange("lote")}
            disabled={true}
          />
          <Input
            label="Nome Popular"
            name="nomePopular"
            type="text"
            value={formData.nomePopular}
            onChange={handleChange("nomePopular")}
            disabled={true}
          />
          <Input
            label="Data do Teste"
            type="date"
            value={formData.dataTeste}
            onChange={handleChange("dataTeste")}
            required={true}
          />
          <Input
            label="Quantidade"
            type="number"
            value={formData.quantidade}
            onChange={handleChange("quantidade")}
            onIncrement={handleIncrement("quantidade")}
            onDecrement={handleDecrement("quantidade")}
            required={true}
          />
          <Input
            label="Câmara Fria"
            type="select"
            value={formData.camaraFria}
            onChange={handleChange("camaraFria")}
            required={true}
            options={[
              { value: "Sim", label: "Sim" },
              { value: "Não", label: "Não" },
            ]}
          />
          <Input
            label="Data Germinação"
            type="date"
            value={formData.dataGerminacao}
            onChange={handleChange("dataGerminacao")}
            required={false}
          />
          <Input
            label="Qtd Amostra para o Teste (unidades)"
            type="number"
            value={formData.numSementesPlantadas}
            onChange={handleChange("numSementesPlantadas")}
            onIncrement={() => handleIncrement("numSementesPlantadas")}
            onDecrement={() => handleDecrement("numSementesPlantadas")}
            required={true}
          />

          <Input
            label="Qtd que Germinou (unidades)"
            type="number"
            value={formData.numSementesGerminaram}
            onChange={handleChange("numSementesGerminaram")}
            onIncrement={() => handleIncrement("numSementesGerminaram")}
            onDecrement={() => handleDecrement("numSementesGerminaram")}
          />
          {/* Campo Calculado (Read Only) */}
          <Input
            label="Taxa Germinou %"
            type="text"
            value={formData.taxaGerminou ? `${formData.taxaGerminou}%` : ""}
            onChange={() => {}}
            disabled={true}
            placeholder="Calculado..."
          />
        </FormGeral>
      </div>
    </div>
  );
};

export default EditarTeste;
