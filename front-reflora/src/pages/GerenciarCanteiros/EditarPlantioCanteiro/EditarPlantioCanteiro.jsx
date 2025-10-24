import React, { useState } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
// 1. Importar o Input
import Input from '../../../components/Input/Input'; 
import './EditarPlantioCanteiro.css';

const EditarPlantioCanteiro = () => {
  const [formData, setFormData] = useState({
    lote: '',
    nomePopular: '',
    quantidadeGerminada: 0, // <-- 2. Melhor usar 'number' no estado inicial
    dataEnvio: '',
    localPlantio: '',
  });

  const handleCancel = (confirmar = true) => {
    const resetForm = () => {
      setFormData({
        lote: '',
        nomePopular: '',
        quantidadeGerminada: 0,
        dataEnvio: '',
        localPlantio: '',
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

  // 3. Handler 'onChange' que entende 'number'
  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    // e.preventDefault() já é tratado no FormGeral
    console.log('Dados do Plantio no Canteiro:', formData);
    alert('Cadastro salvo com sucesso!');
    handleCancel(false);
  };

  // 4. Handlers do Stepper (simplificados, pois o estado já é 'number')
  const handleIncrement = (field) => () => {
    setFormData((prev) => ({ ...prev, [field]: prev[field] + 1 }));
  };

  const handleDecrement = (field) => () => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(0, prev[field] - 1), // Garante que não seja negativo
    }));
  };

  // 5. O array 'fields' foi REMOVIDO.

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
    <div className="editar-plantio-canteiro-pagina">
      <FormGeral
        title="Editar Plantio no Canteiro"
        // 6. Prop 'fields' removida
        actions={actions}
        onSubmit={handleSubmit}
        useGrid={true} // <-- 7. ATIVADO para layout lado a lado
      >
        {/* 8. Inputs renderizados como 'children' e organizados em grid */}

        <Input
          label="Lote"
          name="lote"
          type="text"
          value={formData.lote}
          onChange={handleChange('lote')}
          required={true}
          placeholder="Ex: A001"
        />
        
        <Input
          label="Nome Popular"
          name="nomePopular"
          type="text"
          value={formData.nomePopular}
          onChange={handleChange('nomePopular')}
          required={true}
          placeholder="Ex: Ipê"
        />

        <Input
          label="Quantidade germinada (und)"
          name="quantidadeGerminada"
          type="number" 
          value={formData.quantidadeGerminada}
          onChange={handleChange('quantidadeGerminada')}
          required={true}
          onIncrement={handleIncrement('quantidadeGerminada')}
          onDecrement={handleDecrement('quantidadeGerminada')}
        />
        
        <Input
          label="Data de envio p/ canteiro"
          name="dataEnvio"
          type="date"
          value={formData.dataEnvio}
          onChange={handleChange('dataEnvio')}
          required={true}
          placeholder="dd/mm/aaaa"
        />

        {/* 9. Este 'div' usa a classe do CSS do FormGeral
               para fazer este campo ocupar 2 colunas */}
        <div className="form-geral__campo--span-2">
          <Input
            label="Local do plantio"
            name="localPlantio"
            type="select"
            value={formData.localPlantio}
            onChange={handleChange('localPlantio')}
            required={true}
            placeholder="Selecione o local" // Usando placeholder
            options={[
              // Opção 'Selecione' removida, pois o placeholder faz isso
              { value: 'canteiro_1', label: 'Canteiro 1' },
              { value: 'canteiro_2', label: 'Canteiro 2' },
              { value: 'canteiro_3', label: 'Canteiro 3' },
            ]}
          />
        </div>

      </FormGeral>
    </div>
  );
};

export default EditarPlantioCanteiro;