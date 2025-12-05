import React from "react";
import FormGeral from "../../../components/FormGeral/FormGeral";
import { useState } from "react";
import Input from "../../../components/Input/Input";

const CadastrarTestes = () => {
  const [formData, setFormData] = useState({
    Lote: '',
    NomePopular: '',
    DataPlantio: '',
    TipoPlantio: '',
    CamaraFria: '',
    OmdSementes: 0,
    OmdPlantada: 0,
  });

  const handleCancel = (confirmar = true) => {
    const resetForm = () => {
      setFormData({
        Lote: '',
        NomePopular: '',
        DataPlantio: '',
        TipoPlantio: '',
        CamaraFria: '',
        OmdSementes: 0,
        OmdPlantada: 0,
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

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIncrement = (field) => {
    setFormData(prev => ({ ...prev, [field]: prev[field] + 1 }));
  };

  const handleDecrement = (field) => {
    setFormData(prev => ({ ...prev, [field]: prev[field] > 0 ? prev[field] - 1 : 0 }));
  };

  const handleSubmit = (e) => {
    console.log('Dados do Teste de Germinação:', formData);
    alert('Cadastro salvo com sucesso!');
    handleCancel(false);
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
        title="Cadastro Teste de Germinação"
        actions={actions}
        onSubmit={handleSubmit}
        useGrid={true}
      >
        <Input
          label="Lote"
          name="Lote"
          type="text"
          value={formData.Lote}
          onChange={handleChange('Lote')}
          required={true}
          placeholder="A001"
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
          label="Data do plantio"
          name="DataPlantio"
          type="date"
          value={formData.DataPlantio}
          onChange={handleChange('DataPlantio')}
          required={true}
          placeholder="dd/mm/aaaa"
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

        <Input
          label="Câmara fria"
          name="CamaraFria"
          type="select"
          value={formData.CamaraFria}
          onChange={handleChange('CamaraFria')}
          required={true}
          placeholder="Sim/não"
          options={[
            { value: 'Sim', label: 'Sim' },
            { value: 'Não', label: 'Não' },
          ]}
        />

        <Input
          label="Qtd de sementes (kg/g/und)"
          name="QtdSementes"
          type="number"
          value={formData.OmdSementes}
          onChange={handleChange('QntdSementes')}
          onIncrement={() => handleIncrement("QtdSementes")}
          onDecrement={() => handleDecrement("QtdSementes")}
          required={true}
        />

        <Input
          label="Qtd plantada (und)"
          name="QtdPlantada"
          type="number"
          value={formData.OmdPlantada}
          onChange={handleChange('QtdPlantada')}
          onIncrement={() => handleIncrement("QtdPlantada")}
          onDecrement={() => handleDecrement("QtdPlantada")}
          required={true}
        />
      </FormGeral>
    </div>
  );
};

export default CadastrarTestes;