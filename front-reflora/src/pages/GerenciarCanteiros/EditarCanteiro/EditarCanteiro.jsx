import React, { useState, useEffect } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input'; 

const EditarCanteiro = ({ itemParaEditar = null }) => {
  const [formData, setFormData] = useState({
    nome: '',
    data: '',
    quantidade: 0,
    especie: '',
  });

  useEffect(() => {
    if (itemParaEditar) {
      setFormData({
        nome: itemParaEditar.id || '', 
        data: itemParaEditar.DataPlantio || '',
        quantidade: itemParaEditar.Quantidade || 0,
        especie: itemParaEditar.NomePopular || '',
      });
    } else {
      // Reseta se não houver item
      setFormData({
        nome: '',
        data: '',
        quantidade: 0,
        especie: '',
      });
    }
  }, [itemParaEditar]); // Executa quando itemParaEditar mudar

  const handleCancel = (confirmar = true) => {
    const resetForm = () => {
      setFormData({
        nome: '',
        data: '',
        quantidade: 0,
        especie: '',
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

  const handleQuantidadeInc = () => {
    setFormData(prev => ({ ...prev, quantidade: prev.quantidade + 1 }));
  };

  const handleQuantidadeDec = () => {
    setFormData(prev => ({ ...prev, quantidade: prev.quantidade > 0 ? prev.quantidade - 1 : 0 }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados editados:', formData);
    alert('Edição salva com sucesso!');
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
      children: 'Salvar Edição',
    },
  ];

  return (
    <div className="pagina-canteiro">
      <FormGeral
        title="Editar Canteiro"
        actions={actions}
        onSubmit={handleSubmit}
        useGrid={false}
      >
        <Input
          label="Nome"
          name="nome"
          type="select"
          value={formData.nome}
          onChange={handleChange('nome')}
          required={true}
          placeholder="Selecione o canteiro"
          options={[
            { value: 'canteiro_1', label: 'Canteiro 1' },
            { value: 'canteiro_2', label: 'Canteiro 2' },
            { value: 'canteiro_3', label: 'Canteiro 3' },
            ...(itemParaEditar ? [{ 
              value: itemParaEditar.id, 
              label: itemParaEditar.NomeCanteiro || `Canteiro ${itemParaEditar.id}` 
            }] : [])
          ]}
        />
        
        <Input
          label="Data"
          name="data"
          type="date"
          value={formData.data}
          onChange={handleChange('data')}
          required={true}
        />
        
        <Input
          label="Quantidade"
          name="quantidade"
          type="number"
          value={formData.quantidade}
          onChange={handleChange('quantidade')}
          onIncrement={handleQuantidadeInc}
          onDecrement={handleQuantidadeDec}
          required={true}
        />
        
        <Input
          label="Espécie"
          name="especie"
          type="select"
          value={formData.especie}
          onChange={handleChange('especie')}
          required={true}
          placeholder="Selecione a espécie"
          options={[
            { value: 'eucalyptus_globulus', label: 'Eucalyptus globulus' },
            { value: 'ipe_amarelo', label: 'Ipê Amarelo' },
            { value: 'pau_brasil', label: 'Pau-Brasil' },
            ...(itemParaEditar?.NomePopular ? [{
              value: itemParaEditar.NomePopular,
              label: itemParaEditar.NomePopular
            }] : [])
          ]}
        />
      </FormGeral>
    </div>
  );
};

export default EditarCanteiro;