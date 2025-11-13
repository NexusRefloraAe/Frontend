import { useEffect, useState } from "react";
import FormGeral from "../../../components/FormGeral/FormGeral";
import Input from "../../../components/Input/Input";

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
      setFormData({
        lote: plantio.lote || '',
        nomePopular: plantio.nomePopular || '',
        qntdSementes: plantio.qntdSementes || 0,
        dataPlantio: plantio.dataPlantio ? plantio.dataPlantio.split('/').reverse().join('-'): '',
        tipoPlantio: plantio.tipoPlantio || '',
        qntdPlantada: plantio.qntdPlantada || 0,
      });
    }
  }, [plantio]);

  const handleCancel = (confirmar = true) => {
    if (confirmar) {
      if (window.confirm('Deseja cancelar? As alterações não salvas serão perdidas.')) {
        onCancelar(); // Chama a função do 'Historico.jsx'
      }
    } else {
      onCancelar();
    }
  };

  
  const handleSubmit = () => {
    // 3. Formata os dados de volta e chama onSalvar
    const dadosSalvos = {
      ...plantio, // Mantém dados originais (como 'id')
      ...formData, // Sobrescreve com dados do form
      // Mapeia de volta para os nomes de chave originais (com letra maiúscula)
      lote: formData.lote,
      nomePopular: formData.nomePopular,
      dataPlantio: formData.dataPlantio.split('-').reverse().join('/'),
      qntdSementes: formData.qntdSementes,
      tipoPlantio: formData.tipoPlantio,
      qntdPlantada: formData.qntdPlantada,

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

  // 4. Ações do formulário ajustadas para o modal
  const actions = [
    {
      type: 'button',
      variant: 'action-secondary',
      children: 'Cancelar',
      onClick: () => handleCancel(true), // Apenas fecha o modal
    },
    {
      type: 'submit',
      variant: 'primary',
      children: 'Salvar Edições', // Novo texto
    },
    
  ];

  if (!isOpen) {
    return null;
  }
  return (
    // 5. Estrutura do Modal
    <div className="modal-overlay" onClick={() => handleCancel(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        {/* Botão de fechar (opcional, mas bom para modais) */}
        <button type="button" className="modal-close-button" onClick={() => handleCancel(false)}>
          &times;
        </button>

        <FormGeral
          title="Editar Plantio"
          // 5. A prop 'fields' foi removida
          actions={actions}
          onSubmit={handleSubmit}
          useGrid={true}
        >
          {/* 6. Os Inputs agora são passados como 'children' */}
          <Input
            label="Lote"
            name="Lote"
            type="text"
            value={formData.lote}
            onChange={handleChange('lote')}
            required={true}
            placeholder="A001" // Placeholder é usado pelo Input
            
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
            name="DataPlantio"
            type="date"
            value={formData.dataPlantio}
            onChange={handleChange('dataPlantio')}
            required={true}
            placeholder="xx/xx/xxxx"
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
            name="QtdPlantada"
            type="number"
            value={formData.qntdPlantada}
            onChange={handleChange('qntdPlantada')} // Para digitação manual
            onIncrement={handleIncrement("qntdPlantada")}   // Para o botão '+'
            onDecrement={handleDecrement("qntdPlantada")}   // Para o botão '-'
            required={true}


          />

          <Input
            label="Tipo de plantio"
            name="TipoPlantio"
            type="select"
            value={formData.tipoPlantio}
            onChange={handleChange('tipoPlantio')}
            required={true}
            placeholder="Sementeira/saquinho/chão"
            options={[
              { value: 'Sementeira', label: 'Sementeira' },
              { value: 'Saquinho', label: 'Saquinho' },
              { value: 'Chão', label: 'Chão' },
            ]}
          />
        </FormGeral>
      </div>
    </div>
  );
};
export default EditarPlantioSementes;
