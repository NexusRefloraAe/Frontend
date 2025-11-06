// components/EditarMaterial/EditarMaterial.jsx
import React, { useState, useEffect } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input';
import './EditarMaterial.css';

const EditarMaterial = ({ 
  isOpen, 
  onClose, 
  material, 
  onSalvar 
}) => {
  const [formData, setFormData] = useState({
    tipoInsumo: '',
    nomeInsumo: '',
    quantidade: '',
    unidadeMedida: '',
    dataRegistro: '',
    responsavelEntrega: '',
    responsavelReceber: '',
    estoqueMinimo: ''
  });

  useEffect(() => {
    if (material) {
      setFormData({
        tipoInsumo: material.tipoInsumo || 'Material',
        nomeInsumo: material.NomeInsumo || '',
        quantidade: material.Quantidade || '',
        unidadeMedida: material.UnidadeMedida || '',
        dataRegistro: material.Data || '',
        responsavelEntrega: material.ResponsavelEntrega || '',
        responsavelReceber: material.ResponsavelRecebe || '',
        estoqueMinimo: material.EstoqueMinimo || ''
      });
    }
  }, [material]);

  const handleCancel = (confirmar = true) => {
    const resetForm = () => {
      setFormData({
        tipoInsumo: '',
        nomeInsumo: '',
        quantidade: '',
        unidadeMedida: '',
        dataRegistro: '',
        responsavelEntrega: '',
        responsavelReceber: '',
        estoqueMinimo: ''
      });
      onClose();
    };

    if (confirmar && window.confirm('Deseja cancelar? As alterações não salvas serão perdidas.')) {
      resetForm();
    } else if (!confirmar) {
      resetForm();
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuantidadeInc = () => {
    setFormData(prev => ({ 
      ...prev, 
      quantidade: Math.max(0, (prev.quantidade || 0) + 1) 
    }));
  };

  const handleQuantidadeDec = () => {
    setFormData(prev => ({ 
      ...prev, 
      quantidade: Math.max(0, (prev.quantidade || 0) - 1) 
    }));
  };

  const handleEstoqueMinimoInc = () => {
    setFormData(prev => ({ 
      ...prev, 
      estoqueMinimo: Math.max(0, (prev.estoqueMinimo || 0) + 1) 
    }));
  };

  const handleEstoqueMinimoDec = () => {
    setFormData(prev => ({ 
      ...prev, 
      estoqueMinimo: Math.max(0, (prev.estoqueMinimo || 0) - 1) 
    }));
  };

  const getUnidadesMedida = () => {
    return [
      { value: 'Quilograma', label: 'Kg' },
      { value: 'Litro', label: 'Litro' },
      { value: 'Metro', label: 'Metro' },
      { value: 'Unidade', label: 'Unidade' },
      { value: 'Saco', label: 'Saco' },
      { value: 'Caixa', label: 'Caixa' }
    ];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!material) {
      alert('Erro: Material não encontrado.');
      return;
    }

    console.log('Material atualizado:', formData);
    onSalvar(formData);
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
      children: 'Salvar Edições',
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button 
          className="btn-fechar-modal"
          onClick={() => handleCancel(true)}
          title="Fechar"
        >
          ×
        </button>
        
        <FormGeral
          title={`Editar Material - ${material?.NomeInsumo || ''}`}
          actions={actions}
          onSubmit={handleSubmit}
          useGrid={false}
        >
          <div className="input-row">
            <Input
              label="Nome do material"
              name="nomeInsumo"
              type="text"
              value={formData.nomeInsumo}
              onChange={handleChange('nomeInsumo')}
              placeholder="Ex: Adubo"
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
              placeholder="Ex: 300"
              required={true}
              min="0"
            />
          </div>

          <div className="input-row">
            <Input
              label="Unidade de medida"
              name="unidadeMedida"
              type="select"
              value={formData.unidadeMedida}
              onChange={handleChange('unidadeMedida')}
              required={true}
              options={getUnidadesMedida()}
            />
            <Input
              label="Estoque Mínimo"
              name="estoqueMinimo"
              type="number"
              value={formData.estoqueMinimo}
              onChange={handleChange('estoqueMinimo')}
              onIncrement={handleEstoqueMinimoInc}
              onDecrement={handleEstoqueMinimoDec}
              placeholder="Ex: 100"
              required={true}
              min="0"
            />
          </div>

          <div className="input-row">
            <Input
              label="Data de Registro"
              name="dataRegistro"
              type="date"
              value={formData.dataRegistro}
              onChange={handleChange('dataRegistro')}
              required={true}
            />
            <Input
              label="Status"
              name="status"
              type="select"
              value={formData.status}
              onChange={handleChange('status')}
              required={true}
              options={[
                { value: 'Entrada', label: 'Entrada' },
                { value: 'Saída', label: 'Saída' }
              ]}
            />
          </div>

          <div className="input-row">
            <Input
              label="Responsável pela Entrega"
              name="responsavelEntrega"
              type="text"
              value={formData.responsavelEntrega}
              onChange={handleChange('responsavelEntrega')}
              placeholder="Ex: Arthur dos Santos Pereira"
              required={true}
            />
            <Input
              label="Responsável por Receber"
              name="responsavelReceber"
              type="text"
              value={formData.responsavelReceber}
              onChange={handleChange('responsavelReceber')}
              placeholder="Ex: Ramil dos Santos Pereira"
              required={true}
            />
          </div>
        </FormGeral>
      </div>
    </div>
  );
};

export default EditarMaterial;