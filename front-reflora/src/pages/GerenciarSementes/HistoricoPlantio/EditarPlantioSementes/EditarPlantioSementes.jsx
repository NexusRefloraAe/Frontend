import { useEffect, useState } from "react";
import FormGeral from "../../../../components/FormGeral/FormGeral";
import Input from "../../../../components/Input/Input";

const EditarPlantioSementes = ({ isOpen, onSalvar, onCancelar, plantio }) => {
  // 1. Estado alinhado com o DTO do Java (nomes exatos)
  const [formData, setFormData] = useState({
    lote: "",
    nomePopular: "", // Apenas para exibição (não é salvo no update)
    qtdSemente: 0, // ✅ Corrigido (era qntdSementes)
    dataPlantio: "",
    tipoPlantio: "",
    quantidadePlantada: 0, // ✅ Corrigido (era qntdPlantada)
  });

  const [unidadeMedida, setUnidadeMedida] = useState("");

  // const mapearParaBackend = (valor) => {
  //   const dePara = {
  //     'CHAO': 'Chão',
  //     'CHÃO': 'Chão',
  //     'Chão': 'Chão',
  //     'SEMENTEIRA': 'Sementeira',
  //     'Sementeira': 'Sementeira',
  //     'SAQUINHO': 'Saquinho',
  //     'Saquinho': 'Saquinho'
  //   };
  //   return dePara[valor] || valor;
  // };

  useEffect(() => {
    if (plantio) {
      const formatarDataInput = (dataStr) => {
        if (!dataStr) return "";
        if (dataStr.includes("/")) {
          const parts = dataStr.split("/");
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return dataStr;
      };

      let unidadeEncontrada = "";

      const stringFormatada =
        plantio.quantidadeSaidaFormatada || plantio.quantidadeAtualFormatada;
      if (stringFormatada) {
        // Remove números, pontos e espaços, sobrando só as letras
        unidadeEncontrada = stringFormatada.replace(/[0-9.,\s]/g, "");
      }
      
      else if (plantio.unidadeDeMedida) {
         unidadeEncontrada = plantio.unidadeDeMedida;
      }

      setUnidadeMedida(unidadeEncontrada);

      setFormData({
        lote: plantio.lote || plantio.loteSemente || "",
        nomePopular:
          plantio.sementes?.nomePopular || // Estrutura do getById
          plantio.nomePopularSemente || // Estrutura da lista da tabela
          plantio.nomePopular || // Fallback
          "",
        qtdSemente: plantio.qtdSemente || 0,
        dataPlantio: formatarDataInput(plantio.dataPlantio),

        // ✅ TRATAMENTO ROBUSTO:
        // Tenta pegar 'tipoPlantio' (do getById) ou 'tipoPlantioDescricao' (da tabela)
        tipoPlantio: plantio.tipoPlantio || plantio.tipoPlantioDescricao || "",

        quantidadePlantada: plantio.quantidadePlantada || 0,
      });
    }
  }, [plantio]);

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

  const handleSubmit = () => {
    // ✅ NOVA VALIDAÇÃO: Impede decimais em quantidadePlantada (unidades de mudas)
    if (formData.quantidadePlantada % 1 !== 0) {
      return alert(
        "A quantidade de Mudas/Buracos deve ser um número inteiro (sem casa decimal)."
      );
    }

    // --- 3. TRATAMENTO NO ENVIO ---
    // Garante que enviamos "CHAO" sem acento para o Java não dar erro 500
    const dadosSalvos = {
      id: plantio.id,
      ...formData,
      tipoPlantio: formData.tipoPlantio,
    };

    onSalvar(dadosSalvos);
  };

  const handleChange = (field) => (e) => {
    // Para Selects, as vezes o valor vem direto, as vezes via target
    const value = e.target
      ? e.target.type === "number"
        ? Number(e.target.value)
        : e.target.value
      : e;
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
          title="Editar Plantio"
          actions={actions}
          onSubmit={handleSubmit}
          useGrid={true}
        >
          <Input
            label="Lote"
            name="lote"
            type="text"
            value={formData.lote}
            disabled={true}
          />

          <Input
            label="Nome Popular"
            name="nomePopular"
            type="text"
            value={formData.nomePopular}
            disabled={true}
          />

          <Input
            label="Data"
            name="dataPlantio"
            type="date"
            value={formData.dataPlantio}
            onChange={handleChange("dataPlantio")}
            required={true}
          />

          {/* --- 3. Layout Flex para exibir a Unidade ao lado --- */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <Input
                label="Qtd sementes"
                name="qtdSemente"
                type="number"
                value={formData.qtdSemente}
                onChange={handleChange("qtdSemente")}
                onIncrement={handleIncrement("qtdSemente")}
                onDecrement={handleDecrement("qtdSemente")}
                required={true}
              />
            </div>
            {unidadeMedida && (
              <span
                style={{
                  marginTop: "15px", // Ajuste para alinhar com o input (que tem label acima)
                  fontWeight: "bold",
                  color: "#555",
                  fontSize: "13px",
                  whiteSpace: "nowrap",
                }}
              >
                Unid: {unidadeMedida}
              </span>
            )}
          </div>

          <Input
            label="Qtd plantada (und)"
            name="quantidadePlantada"
            type="number"
            value={formData.quantidadePlantada} // Nome corrigido
            onChange={handleChange("quantidadePlantada")}
            onIncrement={handleIncrement("quantidadePlantada")}
            onDecrement={handleDecrement("quantidadePlantada")}
            onKeyDown={(e) => {
              if (["e", "E", ",", "."].includes(e.key)) {
                e.preventDefault();
              }
            }}
            required={true}
          />

          {/* 4. OPÇÕES DO SELECT
             Os 'values' devem ser IDÊNTICOS às constantes do Enum Java (sem acento, Uppercase).
             Os 'labels' são o que o usuário vê.
          */}
          <Input
            label="Tipo de plantio"
            name="tipoPlantio"
            type="select"
            value={formData.tipoPlantio}
            onChange={handleChange("tipoPlantio")}
            required={true}
            placeholder="Selecione"
            options={[
              { value: "Sementeira", label: "Sementeira" },
              { value: "Saquinho", label: "Saquinho" },
              { value: "Chão", label: "Chão" }, // O VALUE DEVE SER "Chão" para bater com o @JsonValue do Java
            ]}
          />
        </FormGeral>
      </div>
    </div>
  );
};

export default EditarPlantioSementes;
