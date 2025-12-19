import React, { useState, useEffect } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input';
import insumoService from '../../../services/insumoService';
import './CadastrarEmprestimo.css';

const CadastrarEmprestimo = ({
  item,
  onSalvar,
  onCancelar
}) => {
  const hoje = new Date().toISOString().split('T')[0];

  // Estado inicial — se receber item, está editando
  const [formData, setFormData] = useState(
    item ? {
      nomeInsumo: item.NomeInsumo || '',
      status: item.Status || '',
      quantidade: item.Quantidade || '',
      unidadeMedida: item.UnidadeMedida || 'Unidade',
      dataRegistro: item.Data || hoje,
      responsavelEntrega: item.ResponsavelEntrega || '',
      responsavelReceber: item.ResponsavelRecebe || '',
    } : {
      nomeInsumo: '',
      status: '',
      quantidade: '',
      unidadeMedida: 'Unidade',
      dataRegistro: hoje,
      responsavelEntrega: '',
      responsavelReceber: '',
    }
  );

  // 🔹 Atualiza formData quando item muda
  useEffect(() => {
    if (item) {
      setFormData({
        nomeInsumo: item.NomeInsumo || '',
        status: item.Status || '',
        quantidade: item.Quantidade || '',
        unidadeMedida: item.UnidadeMedida || 'Unidade',
        dataRegistro: item.Data || hoje,
        responsavelEntrega: item.ResponsavelEntrega || '',
        responsavelReceber: item.ResponsavelRecebe || '',
      });
    }
  }, [item]);

  const handleCancel = () => {
    if (onCancelar) {
      onCancelar();
    } else {
      // Comportamento original
      const confirmar = window.confirm('Deseja cancelar? As alterações não salvas serão perdidas.');
      if (confirmar) {
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nomeInsumo: '',
      status: '',
      quantidade: '',
      unidadeMedida: 'Unidade',
      dataRegistro: hoje,
      responsavelEntrega: '',
      responsavelReceber: '',
    });
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

  const handleSubmit = async (e) => {
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
    if (!formData.quantidade || formData.quantidade <= 0) {
      alert('Por favor, informe uma quantidade válida.');
      return;
    }
    if (!formData.responsavelEntrega) {
      alert('Por favor, informe o responsável pela entrega.');
      return;
    }
    if (!formData.responsavelReceber) {
      alert('Por favor, informe o responsável por receber.');
      return;
    }

    console.log('Dados do Empréstimo/Devolução:', formData);

    try {
      //Montar o objeto para o movimentacaoinsumoRequestDTO
      const payload = {
        insumoId: item ? item.id : null, // Se estiver editando um item existente
        nomeInsumo: formData.nomeInsumo, // Se o backend buscar por nome
        status: formData.status.toUpperCase(), // 'EMPRESTADO' ou 'DEVOLVIDO'
        quantidade: Number(formData.quantidade),
        dataRegistro: formData.dataRegistro,
        responsavelEntrega: formData.responsavelEntrega,
        responsavelReceber: formData.responsavelReceber
      };

      await insumoService.registrarMovimentacao(payload);

      alert('Movimento registrado com sucesso!');

      if (onSalvar) {
        onSalvar(formData);
      } else {
        resetForm();
      }
    } catch (error) {
      console.error('Erro ao registrar movimentação:', error);
      alert('Erro ao registrar movimentação.');
    }
  };

  // 🔹 Se tiver onSalvar (modal), chama a função
  if (onSalvar) {
    onSalvar(formData);
    alert('Movimento atualizado com sucesso!');
  } else {
    // Comportamento original
    alert('Movimento registrado com sucesso!');
    resetForm();
  }
};

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
    children: item ? 'Atualizar' : 'Salvar Registro',
  },
];

return (
  <div className="cadastrar-emprestimo">
    <FormGeral
      title={item ? "Editar Movimento da Ferramenta" : "Registrar Movimento da Ferramenta"}
      actions={actions}
      onSubmit={handleSubmit}
      useGrid={false}
    >
      {/* Tipo de Insumo — fixo, não editável */}
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
);

export default CadastrarEmprestimo;