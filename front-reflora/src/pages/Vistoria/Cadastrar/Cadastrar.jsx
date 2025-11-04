// src/pages/Vistorias/Cadastrar/Cadastrar.jsx
import React, { useState } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input';
import './Cadastrar.css';

const Cadastrar = () => {
  const [formData, setFormData] = useState({
    lote: 'A001',
    estadoSaude: 'Boa',
    adubacao: false,
    regacao: false,
    estimativaMudas: 700,
    nomeResponsavel: 'Antônio Bezerra Santos',
    observacoes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  });

  const handleCancel = (confirmar = true) => {
    const resetForm = () => {
      setFormData({
        lote: 'A001',
        estadoSaude: 'Boa',
        adubacao: false,
        regacao: false,
        estimativaMudas: 700,
        nomeResponsavel: 'Antônio Bezerra Santos',
        observacoes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
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

  const handleCheckboxChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.checked }));
  };

  const handleEstimativaInc = () => {
    setFormData(prev => ({ ...prev, estimativaMudas: prev.estimativaMudas + 1 }));
  };

  const handleEstimativaDec = () => {
    setFormData(prev => ({ ...prev, estimativaMudas: prev.estimativaMudas > 0 ? prev.estimativaMudas - 1 : 0 }));
  };

  const handleSubmit = (e) => {
    console.log('Dados da Vistoria:', formData);
    alert('Vistoria cadastrada com sucesso!');
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
    <div className="cadastrar-vistoria">
      <FormGeral
        title="Cadastrar Vistoria"
        actions={actions}
        onSubmit={handleSubmit}
        useGrid={false}
      >
        {/* Seção Lote */}
        <div className="form-section">
          <h3 className="section-title">Lote</h3>
          <Input
            label=""
            name="lote"
            type="text"
            value={formData.lote}
            onChange={handleChange('lote')}
            required={true}
          />
        </div>

        {/* Seção Estado de Saúde */}
        <div className="form-section">
          <h3 className="section-title">Estado de Saúde</h3>
          <Input
            label=""
            name="estadoSaude"
            type="select"
            value={formData.estadoSaude}
            onChange={handleChange('estadoSaude')}
            required={true}
            options={[
              { value: 'Excelente', label: 'Excelente' },
              { value: 'Boa', label: 'Boa' },
              { value: 'Regular', label: 'Regular' },
              { value: 'Ruim', label: 'Ruim' },
              { value: 'Péssima', label: 'Péssima' }
            ]}
          />
        </div>

        {/* Seção Tratos Culturais */}
        <div className="form-section">
          <h3 className="section-title">Tratos Culturais</h3>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="adubacao"
                checked={formData.adubacao}
                onChange={handleCheckboxChange('adubacao')}
              />
              Adubação
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="regacao"
                checked={formData.regacao}
                onChange={handleCheckboxChange('regacao')}
              />
              Regação
            </label>
          </div>
        </div>

        {/* Seção Estimativa de Mudas Prontas */}
        <div className="form-section">
          <h3 className="section-title">Estimativa de Mudas Prontas</h3>
          <Input
            label=""
            name="estimativaMudas"
            type="number"
            value={formData.estimativaMudas}
            onChange={handleChange('estimativaMudas')}
            onIncrement={handleEstimativaInc}
            onDecrement={handleEstimativaDec}
            required={true}
          />
        </div>

        {/* Seção Nome do Responsável */}
        <div className="form-section">
          <h3 className="section-title">Nome do Responsável</h3>
          <Input
            label=""
            name="nomeResponsavel"
            type="text"
            value={formData.nomeResponsavel}
            onChange={handleChange('nomeResponsavel')}
            required={true}
          />
        </div>

        {/* Seção Observações */}
        <div className="form-section">
          <h3 className="section-title">Observações</h3>
          <Input
            label=""
            name="observacoes"
            type="textarea"
            value={formData.observacoes}
            onChange={handleChange('observacoes')}
            required={false}
            rows={4}
          />
        </div>

      </FormGeral>
    </div>
  );
};

export default Cadastrar;