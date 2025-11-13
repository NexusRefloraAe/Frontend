import { useEffect, useState } from "react";
import FormGeral from "../../../components/FormGeral/FormGeral";
import Input from "../../../components/Input/Input";

const EditarPlantioSementes = ({ isOpen, onSalvar, onCancelar, plantio }) => {
  const [formData, setFormData] = useState({
    Lote: '',
    NomePopular: '',
    QtndSementes: 0,
    DataPlantio: '',
    TipoPlantio: '',
    Qntdplantada: 0,
    CamaraFria: '',
  });
  useEffect(() => {
    if (plantio) {
      setFormData({
        Lote: plantio.Lote || '',
        NomePopular: plantio.Nomepopular || '',
        QntdSementes: plantio.QntdSementes || 0,
        DataPlantio: plantio.DataPlantio || '',
        TipoPlantio: plantio.TipoPlantio || '',
        Qntdplantada: plantio.Qntdplantada || 0,
        CamaraFria: plantio.CamaraFria || '',
      });
    }
  }, [plantio]);
  if (!isOpen) {
    return null;
  }

  const handleSubmit = () => {
        // 3. Formata os dados de volta e chama onSalvar
        const dadosSalvos = {
            ...plantio, // Mantém dados originais (como 'id')
            ...formData, // Sobrescreve com dados do form
            // Mapeia de volta para os nomes de chave originais (com letra maiúscula)
            Lote: formData.Lote,
            NomePopular: formData.NomePopular,
            DataPlantio: formData.DataPlantio, 
            QtdSementes: formData.QtdSementes,
            TipoPlantio: formData.TipoPlantio,
            QtdPlantada: formData.QtdPlantada,
            CamaraFria: formData.CamaraFria,
        };
        
        onSalvar(dadosSalvos);
        onCancelar(); // Fecha o modal após salvar
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
      onClick: onCancelar, // Apenas fecha o modal
    },
    {
      type: 'submit',
      variant: 'primary',
      children: 'Salvar Edições', // Novo texto
    },
  ];
  return (
    // 5. Estrutura do Modal
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        {/* Botão de fechar (opcional, mas bom para modais) */}
        <button type="button" className="modal-close-button" onClick={onCancelar}>
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
            type="select"
            value={formData.Lote}
            onChange={handleChange('Lote')}
            required={true}
            placeholder="A001" // Placeholder é usado pelo Input
            disabled={true} // Opcional: desabilitar edição do Lote
          />

          <Input
            label="Nome Popular"
            name="Nomepopular"
            type="select"
            value={formData.NomePopular}
            onChange={handleChange('Nomeopular')}
            required={true}
            placeholder="Ipê"
            disabled={true} // Opcional: desabilitar edição do Lote
          />
          
          <Input
            label="Data"
            name="DataPlantio"
            type="date"
            value={formData.DataPlantio}
            onChange={handleChange('DataPlantio')}
            required={true}
            placeholder="xx/xx/xxxx"
          />
          <Input
            label="Qtd sementes (kg/g/und)"
            name="QtdSementes"
            type="number"
            value={formData.QtdSementes}
            onChange={handleChange('QtdSementes')} // Para digitação manual
            onIncrement={handleIncrement("QtdSementes")}   // Para o botão '+'
            onDecrement={handleDecrement("QtdSementes")}   // Para o botão '-'
            required={true}


          />


          <Input
            label="Qtd plantada (und)"
            name="QtdPlantada"
            type="number"
            value={formData.QtdPlantada}
            onChange={handleChange('QtdPlantada')} // Para digitação manual
            onIncrement={() => handleIncrement("QtdPlantada")}   // Para o botão '+'
            onDecrement={() => handleDecrement("QtdPlantada")}   // Para o botão '-'
            required={true}


          />

          <Input
            label="Tipo de plantio"
            name="TipoPlantio"
            type="select"
            value={formData.TipoPlantio}
            onChange={handleChange('TipoPlantio')}
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
