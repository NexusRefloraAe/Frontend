import React, { useState } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input';
import './Editar.css';

const Editar = () => {
  const hoje = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    lote: 'A001',
    dataVistoria: hoje,
    estadoSaude: 'Boa',
    tratosCulturais: 'Adubação e Rega',
    estimativaMudas: 720,
    nomeResponsavel: 'Antônio Bezerra Santos',
    observacoes: 'Vistoria atualizada em campo. Mudas apresentando bom desenvolvimento após adubação semanal.'
  });

  const handleCancel = (confirmar = true) => {
    const resetForm = () => {
      setFormData({
        lote: 'A001',
        dataVistoria: hoje,
        estadoSaude: 'Boa',
        tratosCulturais: 'Adubação e Rega',
        estimativaMudas: 720,
        nomeResponsavel: 'Antônio Bezerra Santos',
        observacoes: 'Vistoria atualizada em campo. Mudas apresentando bom desenvolvimento após adubação semanal.'
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

  const handleEstimativaInc = () => {
    setFormData((prev) => ({ ...prev, estimativaMudas: prev.estimativaMudas + 1 }));
  };

  const handleEstimativaDec = () => {
    setFormData((prev) => ({ ...prev, estimativaMudas: Math.max(0, prev.estimativaMudas - 1) }));
  };

  const handleSubmit = (e) => {
    console.log('Dados atualizados da Vistoria:', formData);
    alert('Vistoria atualizada com sucesso!');
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

  return (
    <div className="editar-vistoria">
      <FormGeral
        title="Editar Vistoria"
        actions={actions}
        onSubmit={handleSubmit}
        useGrid={false}
      >
        <div className="input-row">
          <Input
            label="Lote"
            name="lote"
            type="text"
            value={formData.lote}
            readOnly={true}
            className="input-readonly"
          />
          <Input
            label="Data da Vistoria"
            name="dataVistoria"
            type="date"
            value={formData.dataVistoria}
            onChange={handleChange('dataVistoria')}
            required={true}
          />
        </div>

        <div className="input-row">
          <Input
            label="Estado de Saúde"
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
          <Input
            label="Tratos Culturais"
            name="tratosCulturais"
            type="select"
            value={formData.tratosCulturais}
            onChange={handleChange('tratosCulturais')}
            required={true}
            options={[
              { value: 'Nenhum', label: 'Nenhum' },
              { value: 'Adubação', label: 'Adubação' },
              { value: 'Rega', label: 'Rega' },
              { value: 'Adubação e Rega', label: 'Adubação e Rega' }
            ]}
          />
        </div>

        <div className="input-row">
          <Input
            label="Estimativa de Mudas"
            name="estimativaMudas"
            type="number"
            value={formData.estimativaMudas}
            onChange={handleChange('estimativaMudas')}
            onIncrement={handleEstimativaInc}
            onDecrement={handleEstimativaDec}
            required={true}
          />
          <Input
            label="Nome do Responsável"
            name="nomeResponsavel"
            type="text"
            value={formData.nomeResponsavel}
            onChange={handleChange('nomeResponsavel')}
            required={true}
          />
        </div>

        <Input
          label="Observações"
          name="observacoes"
          type="textarea"
          value={formData.observacoes}
          onChange={handleChange('observacoes')}
          required={false}
          rows={4}
        />
      </FormGeral>
    </div>
  );
};

export default Editar;