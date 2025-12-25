import { useEffect, useState } from "react";
import FormGeral from "../../../../components/FormGeral/FormGeral";
import Input from "../../../../components/Input/Input";

const EditarPlantioSementes = ({ isOpen, onSalvar, onCancelar, plantio }) => {
  // 1. Estado alinhado com o DTO do Java (nomes exatos)
  const [formData, setFormData] = useState({
    lote: '',
    nomePopular: '', // Apenas para exibição (não é salvo no update)
    qtdSemente: 0,   // ✅ Corrigido (era qntdSementes)
    dataPlantio: '',
    tipoPlantio: '',
    quantidadePlantada: 0, // ✅ Corrigido (era qntdPlantada)
  });

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
          if(!dataStr) return '';
          if(dataStr.includes('/')) {
             const parts = dataStr.split('/');
             return `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
          return dataStr;
      };

      // --- 2. TRATAMENTO NO CARREGAMENTO ---
      // Se o back mandar "Chão" (descrição), convertemos para "CHAO" (value do select)
      // para que o campo já venha selecionado corretamente.

      setFormData({
        lote: plantio.lote || '',
        nomePopular: plantio.nomePopularSemente || plantio.nomePopular || '', 
        qtdSemente: plantio.qtdSemente || 0,
        dataPlantio: formatarDataInput(plantio.dataPlantio),
        
        // Aqui usamos o valor tratado
        tipoPlantio: plantio.tipoPlantio, 
        
        // Backend envia 'quantidadePlantada'
        quantidadePlantada: plantio.quantidadePlantada || plantio.qntdPlantada || 0,
      });
    }
  }, [plantio]);

  const handleCancel = (confirmar = true) => {
    if (confirmar) {
      if (window.confirm('Deseja cancelar? As alterações não salvas serão perdidas.')) {
        onCancelar();
      }
    } else {
      onCancelar();
    }
  };

  const handleSubmit = () => {
    // --- 3. TRATAMENTO NO ENVIO ---
    // Garante que enviamos "CHAO" sem acento para o Java não dar erro 500
    const dadosSalvos = {
      id: plantio.id, 
      ...formData,
      tipoPlantio: formData.tipoPlantio
    };

    onSalvar(dadosSalvos);
  };

  const handleChange = (field) => (e) => {
    // Para Selects, as vezes o valor vem direto, as vezes via target
    const value = e.target ? (e.target.type === 'number' ? Number(e.target.value) : e.target.value) : e;
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
      type: 'button',
      variant: 'action-secondary',
      children: 'Cancelar',
      onClick: () => handleCancel(true),
    },
    {
      type: 'submit',
      variant: 'primary',
      children: 'Salvar Edições',
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => handleCancel(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-button" onClick={() => handleCancel(true)}>
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
            onChange={handleChange('dataPlantio')}
            required={true}
          />

          <Input
            label="Qtd sementes (kg/g/und)"
            name="qtdSemente"
            type="number"
            value={formData.qtdSemente} // Nome corrigido
            onChange={handleChange('qtdSemente')}
            onIncrement={handleIncrement('qtdSemente')}
            onDecrement={handleDecrement('qtdSemente')}
            required={true}
          />

          <Input
            label="Qtd plantada (und)"
            name="quantidadePlantada"
            type="number"
            value={formData.quantidadePlantada} // Nome corrigido
            onChange={handleChange('quantidadePlantada')}
            onIncrement={handleIncrement("quantidadePlantada")}
            onDecrement={handleDecrement("quantidadePlantada")}
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
            onChange={handleChange('tipoPlantio')}
            required={true}
            placeholder="Selecione"
            options={[
              { value: 'Sementeira', label: 'Sementeira' },
              { value: 'Saquinho', label: 'Saquinho' },
              { value: 'Chão', label: 'Chão' }, // O VALUE DEVE SER "Chão" para bater com o @JsonValue do Java
            ]}
          />
        </FormGeral>
      </div>
    </div>
  );
};

export default EditarPlantioSementes;