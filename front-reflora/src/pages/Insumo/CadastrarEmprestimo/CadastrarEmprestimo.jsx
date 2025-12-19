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

  // Estado inicial — se receber item, preenche os dados
  const [formData, setFormData] = useState({
    nomeInsumo: '',
    status: '',
    quantidade: '',
    unidadeMedida: 'Unidade', // Padrão para ferramentas
    dataRegistro: hoje,
    responsavelEntrega: '',
    responsavelReceber: '',
  });

  // Atualiza formData quando o item de edição muda
  useEffect(() => {
    if (item) {
      setFormData({
        nomeInsumo: item.NomeInsumo || item.nome || '', // Ajuste para pegar 'nome' se vier do DTO
        status: item.Status || '',
        quantidade: item.Quantidade || '',
        unidadeMedida: item.UnidadeMedida || 'Unidade',
        dataRegistro: item.Data || hoje,
        responsavelEntrega: item.ResponsavelEntrega || '',
        responsavelReceber: item.ResponsavelRecebe || '',
      });
    }
  }, [item, hoje]);

  const handleCancel = () => {
    if (onCancelar) {
      onCancelar();
    } else {
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
    if (!formData.nomeInsumo) return alert('Por favor, informe o nome da ferramenta.');
    if (!formData.status) return alert('Por favor, selecione o status.');
    if (!formData.quantidade || formData.quantidade <= 0) return alert('Por favor, informe uma quantidade válida.');
    if (!formData.responsavelEntrega) return alert('Por favor, informe o responsável pela entrega.');
    if (!formData.responsavelReceber) return alert('Por favor, informe o responsável por receber.');

    try {
      // Montar payload para o Backend
      // Nota: O backend precisa do ID do insumo. Se 'item' for null (novo cadastro manual),
      // certifique-se de que o backend suporta busca por nome ou ajuste a lógica aqui.
      const payload = {
        insumoId: item ? item.id : null, 
        nomeInsumo: formData.nomeInsumo,
        status: formData.status.toUpperCase(), // 'EMPRESTADO', 'DEVOLVIDO', 'ENTRADA'
        quantidade: Number(formData.quantidade),
        dataRegistro: formData.dataRegistro,
        responsavelEntrega: formData.responsavelEntrega,
        responsavelReceber: formData.responsavelReceber
      };

      await insumoService.registrarMovimentacao(payload);

      alert('Movimento registrado com sucesso!');

      if (onSalvar) {
        onSalvar(formData); // Atualiza a tela pai (Tabela)
      } else {
        resetForm();
      }

    } catch (error) {
      console.error('Erro ao registrar movimentação:', error);
      alert('Erro ao registrar movimentação. Verifique os dados.');
    }
  };

  // Definição das actions dentro do componente para acessar o handleCancel
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
            // Se estiver editando, talvez queira bloquear a mudança do nome para garantir consistência do ID
            readOnly={!!item} 
            className={item ? "input-readonly" : ""}
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
              { value: 'Entrada', label: 'Entrada' }, // Adicionado Entrada para consistência com enum
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
};

export default CadastrarEmprestimo;