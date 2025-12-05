// src/pages/GerenciarCanteiros/EditarPlantioCanteiro/EditarPlantioCanteiro.jsx

import React, { useState, useEffect } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input'; 

const EditarPlantioCanteiro = ({ itemParaEditar, onSave, onCancel }) => {
  
  const [formData, setFormData] = useState({
    lote: '',
    nomePopular: '',
    quantidadeGerminada: 0,
    dataEnvio: '',
    localPlantio: '',
  });

  // Efeito para preencher o formulário
  useEffect(() => {
    if (itemParaEditar) {
      setFormData({
        lote: itemParaEditar.NomeCanteiro || '',
        nomePopular: itemParaEditar.NomePopular || '',
        quantidadeGerminada: itemParaEditar.Quantidade || 0,
        dataEnvio: itemParaEditar.DataPlantio || '', 
        localPlantio: itemParaEditar.Localizacao || '',
      });
    }
  }, [itemParaEditar]);

  const handleCancelClick = () => {
    if (window.confirm('Deseja cancelar? As alterações não salvas serão perdidas.')) {
      onCancel(); 
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    const dadosAtualizados = {
      ...itemParaEditar, 
      NomeCanteiro: formData.lote,
      NomePopular: formData.nomePopular,
      Quantidade: formData.quantidadeGerminada,
      DataPlantio: formData.dataEnvio,
      Localizacao: formData.localPlantio,
    };
    onSave(dadosAtualizados);
  };

  const actions = [
    {
      type: 'button',
      variant: 'action-secondary',
      children: 'Cancelar',
      onClick: handleCancelClick,
    },
    {
      type: 'submit',
      variant: 'primary',
      children: 'Salvar Cadastro', 
    },
  ];

  return (
    <div className="editar-plantio-canteiro-pagina">
      <FormGeral
        title="Editar Plantio no Canteiro"
        actions={actions}
        onSubmit={handleSubmit}
        useGrid={true}
      >
        
        {/* ✅ ALTERAÇÃO FEITA AQUI 👇 */}
        <div className="form-geral__campo--span-2">
          <Input
            label="Nome do canteiro" 
            name="canteiro"
            type="text"
            value={formData.lote}
            onChange={handleChange('lote')}
            required={true}
            placeholder="Canteiro 1"
          />
        </div>
        
        <div className="form-geral__campo--span-2">
          <Input
            label="Nome Popular"
            name="nomePopular"
            type="text"
            value={formData.nomePopular}
            onChange={handleChange('nomePopular')}
            required={true}
            placeholder="Ipê"
          />
        </div>

        <Input
          label="Quantidade germinada (und)"
          name="quantidadeGerminada"
          type="number" 
          value={formData.quantidadeGerminada}
          onChange={handleChange('quantidadeGerminada')}
          required={true}
          placeholder="20"
        />
        
        <Input
          label="Data de envio p/ canteiro"
          name="dataEnvio"
          type="date"
          value={formData.dataEnvio}
          onChange={handleChange('dataEnvio')}
          required={true}
        />

        <div className="form-geral__campo--span-2">
          <Input
            label="Local do plantio"
            name="localPlantio"
            type="select"
            value={formData.localPlantio}
            onChange={handleChange('localPlantio')}
            required={true}
            placeholder="Selecione o local"
            options={[
              { value: 'Setor A', label: 'Canteiro 1 (Setor A)' },
              { value: 'Setor B', label: 'Canteiro 2 (Setor B)' },
              { value: 'Setor C', label: 'Canteiro 3 (Setor C)' },
              { value: 'Setor D', label: 'Canteiro 4 (Setor D)' },
            ]}
          />
        </div>

      </FormGeral>
    </div>
  );
};

export default EditarPlantioCanteiro;