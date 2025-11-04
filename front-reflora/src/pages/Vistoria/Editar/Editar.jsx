// src/pages/Vistorias/Editar/Editar.jsx
import React, { useState } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input';
import './Editar.css';

const Editar = () => {
  const [formData, setFormData] = useState({
    lote: 'A001',
    estadoSaude: 'Boa',
    pragasDoencas: true,
    adubacao: false,
    regacao: false,
    estimativaMudas: 700,
    dataInspecao: '2025-05-20',
    nomeResponsavel: 'Antônio Bezerra Santos',
    observacoes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
  });

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.checked }));
  };

  const handleSubmit = (e) => {
    console.log('Vistoria editada:', formData);
    alert('Vistoria atualizada com sucesso!');
  };

  const actions = [
    {
      type: 'button',
      variant: 'action-secondary',
      children: 'Cancelar',
      onClick: () => window.history.back(),
    },
    {
      type: 'submit',
      variant: 'primary',
      children: 'Atualizar Vistoria',
    },
  ];

  return (
    <div className="editar-vistoria">
      <FormGeral
        title="Editar Vistoria"
        actions={actions}
        onSubmit={handleSubmit}
        useGrid={false}
      >
        {/* Mesma estrutura do CadastrarVistoria, mas com título diferente */}
        <div className="secao-vistoria">
          <h3 className="titulo-secao">Lote</h3>
          <Input
            label=""
            name="lote"
            type="text"
            value={formData.lote}
            onChange={handleChange('lote')}
            required={true}
          />
        </div>

        {/* ... resto dos campos igual ao CadastrarVistoria ... */}
      </FormGeral>
    </div>
  );
};

export default Editar;