import React, { useState, useEffect } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input';

const EditarVistoria = ({ isOpen, onClose, onSave, itemParaEditar }) => {

  const [formData, setFormData] = useState({
    lote: '',
    dataVistoria: '',
    estadoSaude: 'Boa',
    tratosCulturais: 'Adubação e Rega',
    estimativaMudas: 0,
    nomeResponsavel: '',
    observacoes: ''
  });

  useEffect(() => {
    if (itemParaEditar) {
      setFormData({
        lote: itemParaEditar.Lote || '',
        dataVistoria: itemParaEditar.DataVistoria ? itemParaEditar.DataVistoria.split('/').reverse().join('-') : '', // Converte DD/MM/YYYY para YYYY-MM-DD
        nomeResponsavel: itemParaEditar.Responsavel || '',
        
        // Campos que não estão na tabela, mas podem estar no objeto (ou usamos padrão)
        estadoSaude: itemParaEditar.EstadoSaude || 'Boa',
        tratosCulturais: itemParaEditar.TratosCulturais || 'Adubação e Rega',
        estimativaMudas: itemParaEditar.EstimativaMudas || 0,
        observacoes: itemParaEditar.Observacoes || ''
      });
    }
  }, [itemParaEditar]);

  const handleCancel = (confirmar = true) => {
    if (confirmar) {
      if (window.confirm('Deseja cancelar? As alterações não salvas serão perdidas.')) {
        onClose(); // Chama a função do 'Historico.jsx'
      }
    } else {
      onClose();
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

  // Handler 'onSave' (chama a prop com os dados)
  const handleSubmit = (e) => {
    // Mapeia os dados do formulário de volta para o formato do objeto original
    const dadosAtualizados = {
        ...itemParaEditar, // Mantém dados que não estão no form (como ID, NomePopular, etc)
        Lote: formData.lote,
        DataVistoria: formData.dataVistoria.split('-').reverse().join('/'), // Converte YYYY-MM-DD para DD/MM/YYYY
        Responsavel: formData.nomeResponsavel,
        EstadoSaude: formData.estadoSaude,
        TratosCulturais: formData.tratosCulturais,
        EstimativaMudas: formData.estimativaMudas,
        Observacoes: formData.observacoes,
        // Atualiza o Status para refletir a edição
        Status: 'Vistoria Atualizada' 
    };
    onSave(dadosAtualizados);
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

  // Verificação 'isOpen'
  if (!isOpen) {
    return null;
  }

  // JSX envolvido em um overlay de modal
  return (
    <div className="modal-overlay" onClick={() => handleCancel(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '700px'}}>
            
            {/* Botão de fechar (opcional mas recomendado) */}
            <button 
                className="modal-close-button" 
                onClick={() => handleCancel(false)}
                style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', zIndex: 10 }}
            >
                &times;
            </button>
            
            {/* O seu formulário 'Editar' original está aqui dentro */}
            <div className="editar-vistoria">
                <FormGeral
                    title="Editar Vistoria"
                    actions={actions}
                    onSubmit={handleSubmit}
                    useGrid={false}
                >
                    {/* Todos os seus 'input-row' e 'Input'
                    permanecem exatamente como estavam.
                    */}
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
        </div>
    </div>
  );
};

export default EditarVistoria;