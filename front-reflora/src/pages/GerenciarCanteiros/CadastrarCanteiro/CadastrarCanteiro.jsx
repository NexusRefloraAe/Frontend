// src/pages/GerenciarCanteiros/CadastrarCanteiro/CadastrarCanteiro.jsx

import React, { useState } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
import './CadastrarCanteiro.css';

// ✅ CORREÇÃO IMPORTANTE: 
// Você PRECISA importar o ícone para usá-lo.
// (Confirme se o caminho para o seu ícone está correto)
const CadastrarCanteiro = () => {
  const [formData, setFormData] = useState({
    nome: '',
    data: '',
    quantidade: '1200',
    especie: '',
  });

  const handleCancel = (confirmar = true) => {
    const resetForm = () => {
      setFormData({
        nome: '',
        data: '',
        quantidade: '1200',
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
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do Canteiro:', formData);
    alert('Cadastro salvo com sucesso!');
    handleCancel(false);
  };

  const fields = [
    // ... (seus fields aqui, não precisam mudar) ...
    {
      label: 'Nome',
      name: 'nome',
      type: 'select',
      value: formData.nome,
      onChange: handleChange('nome'),
      required: true,
      options: [
        { value: '', label: 'Selecione o canteiro' },
        { value: 'canteiro_1', label: 'Canteiro 1' },
        { value: 'canteiro_2', label: 'Canteiro 2' },
        { value: 'canteiro_3', label: 'Canteiro 3' },
      ],
    },
    {
      label: 'Data',
      name: 'data',
      type: 'date',
      value: formData.data,
      onChange: handleChange('data'),
      required: true,
      placeholder: 'xx/xx/xxxx',
    },
    {
      label: 'Quantidade',
      name: 'quantidade',
      type: 'number',
      value: formData.quantidade,
      onChange: handleChange('quantidade'),
      required: true,
    },
    {
      label: 'Espécie',
      name: 'especie',
      type: 'select',
      value: formData.especie,
      onChange: handleChange('especie'),
      required: true,
      options: [
        { value: '', label: 'Selecione a espécie' },
        { value: 'eucalyptus_globulus', label: 'Eucalyptus globulus' },
        { value: 'ipe_amarelo', label: 'Ipê Amarelo' },
        { value: 'pau_brasil', label: 'Pau-Brasil' },
      ],
    },
  ];

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
    <div className="pagina-canteiro">
      <FormGeral
        title="Cadastrar/editar Canteiro"
        fields={fields}
        actions={actions}
        onSubmit={handleSubmit}
        useGrid={false}
      />
    </div>
  );
};

export default CadastrarCanteiro;