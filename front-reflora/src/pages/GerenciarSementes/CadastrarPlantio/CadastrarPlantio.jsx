import React from "react";
import "./CadastrarPlantioStyler.css";
import FormGeral from "../../../components/FormGeral/FormGeral";
import { useState } from "react";
import Input from "../../../components/Input/Input";
const CadastrarPlantio = () => {

  const [formData, setFormData] = useState({
    Lote: '',
    NomePopular: '',
    QtdSementes: 0, // <-- Mudei para number para o stepper funcionar
    DataPlantio: '',
    TipoPlantio: '',
    QtdPlantada: 0,
    CamaraFria: '',
  });

  const handleCancel = (confirmar = true) => {
    const resetForm = () => {
      setFormData({
        Lote: '',
        NomePopular: '',
        QtdSementes: 0, // <-- Também mudei aqui para number
        DataPlantio: '',
        TipoPlantio: '',
        QtdPlantada: 0,
        CamaraFria: '',
      });
    };

    if (confirmar) {
      if (window.confirm('Deseja cancelar? As alterações não salvas serão perdidas.')) {
        resetForm();
      }
    } else {
      resetForm();
    }
  };

  // 2. Ajustamos o handleChange para converter 'number' corretamente
  const handleChange = (field) => (e) => {
    // Se o tipo for 'number', garante que o valor seja salvo como número
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 3. Criamos handlers específicos para o stepper de Quantidade
  const handleIncrement = (field) => {
    setFormData(prev => ({ ...prev, [field]: prev[field] + 1 }));
  };

  const handleDecrement = (field) => {
    // Evita números negativos
    setFormData(prev => ({ ...prev, [field]: prev[field] > 0 ? prev[field] - 1 : 0 }));
  };

  const handleSubmit = (e) => {
    // e.preventDefault() já é chamado dentro do FormGeral
    console.log('Dados do Canteiro:', formData);
    alert('Cadastro salvo com sucesso!');
    handleCancel(false); // Reseta o form sem perguntar
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
      children: 'Salvar Cadastro',
    },
  ];
  return (
    <div className="">
      <FormGeral
        title="Cadastro/Editar Plantio"
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
          value={formData.Lote}
          onChange={handleChange('Lote')}
          required={true}
          placeholder="A001" // Placeholder é usado pelo Input
        />

        <Input
          label="Nome Popular"
          name="NomePopular"
          type="text"
          value={formData.NomePopular}
          onChange={handleChange('NomePopular')}
          required={true}
          placeholder="Ipê"
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
          onIncrement={()=> handleIncrement("QtdSementes")}   // Para o botão '+'
          onDecrement={()=> handleDecrement("QtdSementes")}   // Para o botão '-'
          required={true}


        />
  

        <Input
          label="Qtd plantada (und)"
          name="QtdPlantada"
          type="number"
          value={formData.QtdPlantada}
          onChange={handleChange('QtdPlantada')} // Para digitação manual
          onIncrement={()=> handleIncrement("QtdPlantada")}   // Para o botão '+'
          onDecrement={()=> handleDecrement("QtdPlantada")}   // Para o botão '-'
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
  );
};

export default CadastrarPlantio;
