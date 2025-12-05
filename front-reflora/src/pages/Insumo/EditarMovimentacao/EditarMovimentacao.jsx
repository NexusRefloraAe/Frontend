import React, { useState, useEffect } from 'react';
import Modal from '../../../components/Modal/Modal'; // Assumindo que você tem um componente Modal genérico
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input';

const EditarMovimentacao = ({ 
  isOpen,         // Controla a visibilidade do modal
  onClose,        // Função para fechar o modal
  onSave,         // Função para salvar os dados
  itemParaEditar  // O item que será editado
}) => {
  const hoje = new Date().toISOString().split('T')[0];

  // Renomeia as props para o contexto interno do formulário
  const item = itemParaEditar;
  const onSalvar = onSave;
  const onCancelar = onClose;

  const [formData, setFormData] = useState({
    nomeInsumo: '',
    status: '',
    quantidade: '',
    unidadeMedida: 'Unidade',
    dataRegistro: hoje,
    responsavelEntrega: '',
    responsavelReceber: '',
  });

  // 🔹 Atualiza formData quando itemParaEditar muda
  useEffect(() => {
    if (itemParaEditar) {
      setFormData({
        nomeInsumo: itemParaEditar.NomeInsumo || '',
        status: itemParaEditar.Status || '',
        quantidade: itemParaEditar.Quantidade || '',
        unidadeMedida: itemParaEditar.UnidadeMedida || 'Unidade',
        dataRegistro: itemParaEditar.Data || hoje,
        responsavelEntrega: itemParaEditar.ResponsavelEntrega || '',
        responsavelReceber: itemParaEditar.ResponsavelRecebe || '',
      });
    }
  }, [itemParaEditar]); // Depende do itemParaEditar

  const handleCancel = () => {
    if (onCancelar) {
      onCancelar(); // Apenas chama a função de fechar o modal
    }
  };

  // Funções de manipulação do formulário (copiadas de CadastrarEmprestimo)
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nomeInsumo) {
      alert('Por favor, informe o nome da ferramenta.');
      return;
    }
    if (!formData.status) {
      alert('Por favor, selecione o status (Emprestado/Devolvido).');
      return;
    }
    // ... (outras validações) ...

    console.log('Dados atualizados:', formData);
    
    if (onSalvar) {
      // Passa os dados atualizados E o ID do item original
      onSalvar({ ...formData, id: item.id }); 
    }
  };

  // Botões do formulário
  const actions = [
    {
      type: 'button',
      variant: 'action-secondary',
      children: 'Cancelar',
      onClick: handleCancel,
    },
    {
      type: 'submit',
      variant: 'primary',
      children: 'Atualizar', // Texto fixo para "Atualizar"
    },
  ];

  // Renderiza o Modal
  return (
    <Modal isOpen={isOpen} onClose={onClose} titulo="Editar Movimento da Ferramenta">
      <div className="cadastrar-emprestimo"> {/* Classe para aplicar estilos */}
        <FormGeral
          // O título está no Modal, não no FormGeral
          actions={actions}
          onSubmit={handleSubmit}
          useGrid={false}
        >
          {/* Tipo de Insumo */}
          <div className="input-row">
            <Input
              label="Tipo de insumo"
              name="tipoInsumo"
              type="text"
              value="Ferramenta"
              readOnly={true}
              className="input-readonly"
            />
          </div>

          {/* Nome do Insumo */}
          <div className="input-row">
            <Input
              label="Nome do Insumo"
              name="nomeInsumo"
              type="text"
              value={formData.nomeInsumo}
              onChange={handleChange('nomeInsumo')}
              placeholder="Ex: Pá Grande"
              required={true}
            />
          </div>

          {/* Status */}
          <div className="input-row">
            <Input
              label="Status"
              name="status"
              type="select"
              value={formData.status}
              onChange={handleChange('status')}
              required={true}
              options={[
                { value: '', label: 'Selecione o status...' },
                { value: 'Emprestado', label: 'Emprestado' },
                { value: 'Devolvido', label: 'Devolvido' },
                { value: 'Entrada', label: 'Entrada' },
              ]}
            />
          </div>

          {/* Quantidade e Unidade */}
          <div className="input-row">
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
            <Input
              label="Unidade de Medida"
              name="unidadeMedida"
              type="text"
              value="Unidade"
              readOnly={true}
              className="input-readonly"
            />
          </div>

          {/* Data de Registro */}
          <div className="input-row">
            <Input
              label="Data de Registro"
              name="dataRegistro"
              type="date"
              value={formData.dataRegistro}
              onChange={handleChange('dataRegistro')}
              required={true}
            />
          </div>

          {/* Responsáveis */}
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
    </Modal>
  );
};

export default EditarMovimentacao;