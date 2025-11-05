import React, { useState } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input'; 

const EditarCanteiro = () => {
  const [formData, setFormData] = useState({
    nome: '',
    data: '',
    quantidade: 1200, // <-- 2. Mudei para 'number'
    especie: '',
  });

  const handleCancel = (confirmar = true) => {
    const resetForm = () => {
      setFormData({
        nome: '',
        data: '',
        quantidade: 1200, // <-- 2. Mudei para 'number'
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

  // 3. Ajuste no handleChange para tratar números
  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 4. Handlers para o stepper de Quantidade
  const handleQuantidadeInc = () => {
    setFormData(prev => ({ ...prev, quantidade: prev.quantidade + 1 }));
  };

  const handleQuantidadeDec = () => {
    setFormData(prev => ({ ...prev, quantidade: prev.quantidade > 0 ? prev.quantidade - 1 : 0 }));
  };

  const handleSubmit = (e) => {
    // e.preventDefault() já é tratado pelo FormGeral
    console.log('Dados do Canteiro:', formData);
    alert('Edição salva com sucesso!');
    handleCancel(false);
  };

  // 5. O array 'fields' foi REMOVIDO.

  // O array 'actions' está correto.
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
        // 6. A prop 'fields' foi removida
        actions={actions}
        onSubmit={handleSubmit}
        useGrid={false}
      >
        {/* 7. Inputs renderizados como 'children' */}

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
          ]}
        />
        
        <Input
          label="Data"
          name="data"
          type="date"
          value={formData.data}
          onChange={handleChange('data')}
          required={true}
          placeholder="xx/xx/xxxx"
        />
        
        <Input
          label="Quantidade"
          name="quantidade"
          type="number"
          value={formData.quantidade}
          onChange={handleChange('quantidade')} // Para digitação
          onIncrement={handleQuantidadeInc}   // Para botão +
          onDecrement={handleQuantidadeDec}   // Para botão -
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
          ]}
        />

      </FormGeral>
    </div>
  );
};

export default EditarCanteiro;