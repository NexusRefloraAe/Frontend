import { useEffect, useState } from "react";
import FormGeral from "../../../../components/FormGeral/FormGeral";
import Input from "../../../../components/Input/Input";

const EditarPlantioSementes = ({ isOpen, onSalvar, onCancelar, plantio }) => {
  const [formData, setFormData] = useState({
    lote: '',
    nomePopular: '',
    qntdSementes: 0,
    dataPlantio: '',
    tipoPlantio: '',
    qntdPlantada: 0,
  });

  useEffect(() => {
    if (plantio) {
      // 1. Função auxiliar para garantir que a data vá para o input (yyyy-MM-dd)
      const formatarDataInput = (dataStr) => {
          if(!dataStr) return '';
          // Se vier dd/MM/yyyy do front antigo, converte. Se vier yyyy-MM-dd do back, mantém.
          if(dataStr.includes('/')) {
             const parts = dataStr.split('/');
             return `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
          return dataStr;
      };

      // 2. Mapeamento correto: Backend DTO -> Form State
      setFormData({
        lote: plantio.lote || '',
        
        // Backend envia 'nomePopularSemente' na listagem
        nomePopular: plantio.nomePopularSemente || plantio.nomePopular || '', 
        
        // Backend envia 'qtdSemente' na listagem
        qntdSementes: plantio.qtdSemente || plantio.qntdSementes || 0,
        
        dataPlantio: formatarDataInput(plantio.dataPlantio),
        
        // Backend envia 'tipoPlantioDescricao' ou 'tipoPlantio'
        tipoPlantio: plantio.tipoPlantioDescricao || plantio.tipoPlantio || '', 
        
        qntdPlantada: plantio.quantidadePlantada || plantio.qntdPlantada || 0,
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
    // 3. Simplificação: Apenas envia o objeto. 
    // O plantioService.update vai cuidar de formatar a data e renomear os campos para o Java.
    const dadosSalvos = {
      id: plantio.id, // Mantém o ID original
      ...formData,    // Envia os dados editados
    };

    onSalvar(dadosSalvos);
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handlers do Stepper
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

  if (!isOpen) {
    return null;
  }

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
            onChange={handleChange('lote')}
            required={true}
            placeholder="A001"
          />

          <Input
            label="Nome Popular"
            name="nomePopular"
            type="text"
            value={formData.nomePopular}
            onChange={handleChange('nomePopular')}
            required={true}
            placeholder="Ipê"
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
            name="qntdSementes"
            type="number"
            value={formData.qntdSementes}
            onChange={handleChange('qntdSementes')}
            onIncrement={handleIncrement('qntdSementes')}
            onDecrement={handleDecrement('qntdSementes')}
            required={true}
          />

          <Input
            label="Qtd plantada (und)"
            name="qntdPlantada"
            type="number"
            value={formData.qntdPlantada}
            onChange={handleChange('qntdPlantada')}
            onIncrement={handleIncrement("qntdPlantada")}
            onDecrement={handleDecrement("qntdPlantada")}
            required={true}
          />

          <Input
            label="Tipo de plantio"
            name="tipoPlantio"
            type="select"
            value={formData.tipoPlantio}
            onChange={handleChange('tipoPlantio')}
            required={true}
            placeholder="Selecione"
            options={[
              { value: 'SEMENTEIRA', label: 'Sementeira' },
              { value: 'SAQUINHO', label: 'Saquinho' },
              { value: 'CHAO', label: 'Chão' },
            ]}
          />
        </FormGeral>
      </div>
    </div>
  );
};

export default EditarPlantioSementes;