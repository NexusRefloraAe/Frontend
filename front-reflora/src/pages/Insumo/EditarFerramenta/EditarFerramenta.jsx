// components/EditarFerramenta/EditarFerramenta.jsx
import React, { useState, useEffect } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input';
import './EditarFerramenta.css';

const EditarFerramenta = ({ 
  isOpen, 
  onClose, 
  ferramenta, 
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
    status: ''
  });

  useEffect(() => {
    if (ferramenta) {
      setFormData({
        tipoInsumo: ferramenta.tipoInsumo || 'Ferramenta',
        nomeInsumo: ferramenta.NomeInsumo || '',
        quantidade: ferramenta.Quantidade || '',
        unidadeMedida: ferramenta.UnidadeMedida || '',
        dataRegistro: ferramenta.Data || '',
        responsavelEntrega: ferramenta.ResponsavelEntrega || '',
        responsavelReceber: ferramenta.ResponsavelRecebe || '',
        status: ferramenta.Status || ''
      });
    }
  }, [ferramenta]);

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
        status: ''
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

  const getUnidadesMedida = () => {
    return [
      { value: 'Unidade', label: 'Unidade' },
      { value: 'Peça', label: 'Peça' },
      { value: 'Jogo', label: 'Jogo' },
      { value: 'Conjunto', label: 'Conjunto' }
    ];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!ferramenta) {
      alert('Erro: Ferramenta não encontrada.');
      return;
    }

    console.log('Ferramenta atualizada:', formData);
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
          title={`Editar Ferramenta - ${ferramenta?.NomeInsumo || ''}`}
          actions={actions}
          onSubmit={handleSubmit}
          useGrid={false}
        >
          <div className="input-row">
            <Input
              label="Nome da ferramenta"
              name="nomeInsumo"
              type="text"
              value={formData.nomeInsumo}
              onChange={handleChange('nomeInsumo')}
              placeholder="Ex: Pá Grande"
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
              placeholder="Ex: 10"
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
              label="Status"
              name="status"
              type="select"
              value={formData.status}
              onChange={handleChange('status')}
              required={true}
              options={[
                { value: 'Entrada', label: 'Entrada' },
                { value: 'Emprestada', label: 'Emprestada' },
                { value: 'Devolvida', label: 'Devolvida' }
              ]}
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
              label="Responsável pela Entrega"
              name="responsavelEntrega"
              type="text"
              value={formData.responsavelEntrega}
              onChange={handleChange('responsavelEntrega')}
              placeholder="Ex: Arthur dos Santos Pereira"
              required={true}
            />
          </div>

          <div className="input-row input-row-single">
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

export default EditarFerramenta;