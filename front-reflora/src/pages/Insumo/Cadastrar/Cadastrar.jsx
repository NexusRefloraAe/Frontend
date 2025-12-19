import React, { useState } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input';
import insumoService from '../../../services/insumoService';
import './Cadastrar.css';

const Cadastrar = () => {
  const hoje = new Date().toISOString().split('T')[0];

  const [tipoInsumo, setTipoInsumo] = useState('');
  const [formData, setFormData] = useState({
    nomeInsumo: '',
    quantidade: '',
    unidadeMedida: '',
    dataRegistro: hoje,
    responsavelEntrega: '',
    responsavelReceber: '',
    estoqueMinimo: '',
  });

  const handleCancel = (confirmar = true) => {
    const resetForm = () => {
      setTipoInsumo('');
      setFormData({
        nomeInsumo: '',
        quantidade: '',
        unidadeMedida: '',
        dataRegistro: hoje,
        responsavelEntrega: '',
        responsavelReceber: '',
        estoqueMinimo: '',
      });
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

  const handleTipoInsumoChange = (e) => {
    setTipoInsumo(e.target.value);
    setFormData(prev => ({
      ...prev,
      estoqueMinimo: '',
      unidadeMedida: ''
    }));
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
    if (tipoInsumo === 'Ferramenta') {
      return [
        { value: 'Unidade', label: 'Unidade' },
        { value: 'Peça', label: 'Peça' },
        { value: 'Jogo', label: 'Jogo' },
        { value: 'Conjunto', label: 'Conjunto' }
      ];
    } else if (tipoInsumo === 'Material') {
      return [
        { value: 'Quilograma', label: 'Kg' },
        { value: 'Litro', label: 'Litro' },
        { value: 'Metro', label: 'Metro' },
        { value: 'Unidade', label: 'Unidade' },
        { value: 'Saco', label: 'Saco' },
        { value: 'Caixa', label: 'Caixa' }
      ];
    }
    return [];
  };

  const getTitulo = () => {
    return tipoInsumo === 'Ferramenta' ? 'Registrar Ferramenta' :
      tipoInsumo === 'Material' ? 'Registrar Material' :
        'Cadastrar Insumo';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tipoInsumo) {
      alert('Por favor, selecione o tipo de insumo.');
      return;
    }

    try {
      // Prepara o objeto exatamente como o DTO do java espera
      const payload = {
        tipoInsumo: tipoInsumo.toUpperCase(), // Backend espera 'MATERIAL' ou 'FERRAMENTA'
        ...formData
      };

      // Chama o back end
      await insumoService.cadastrar(payload);

      alert(`${tipoInsumo} cadastrado com sucesso!`);
      handleCancel(false);

    } catch (error) {
      console.error('Erro ao cadastrar insumo:', error);
      alert('Erro ao cadastrar insumo. Verifique os dados e tente novamente.');
    }
  };

  // Definição das actions DENTRO do componente para acessar o handleCancel
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
      children: 'Salvar Registro',
    },
  ];

  return (
    <div className="cadastrar-insumo">
      <FormGeral
        title={getTitulo()}
        actions={actions}
        onSubmit={handleSubmit}
        useGrid={false}
      >
        {/* Seletor de tipo de insumo - ocupa linha inteira */}
        <div className="input-row">
          <Input
            label="Tipo de insumo"
            name="tipoInsumo"
            type="select"
            value={tipoInsumo}
            onChange={handleTipoInsumoChange}
            required={true}
            options={[
              { value: '', label: 'Selecione o tipo...' },
              { value: 'Ferramenta', label: 'Ferramenta' },
              { value: 'Material', label: 'Material' }
            ]}
          />
        </div>

        {/* Formulário dinâmico baseado no tipo selecionado */}
        {tipoInsumo && (
          <>
            <div className="input-row">
              <Input
                label="Nome do insumo"
                name="nomeInsumo"
                type="text"
                value={formData.nomeInsumo}
                onChange={handleChange('nomeInsumo')}
                placeholder={tipoInsumo === 'Ferramenta' ? 'Ex: Pá Grande' : 'Ex: Adubo'}
                required={true}
              />
              <Input
                label="Unidade de medida"
                name="unidadeMedida"
                type="select"
                value={formData.unidadeMedida}
                onChange={handleChange('unidadeMedida')}
                required={true}
                options={getUnidadesMedida()}
              />
            </div>

            <div className="input-row">
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

              {tipoInsumo === 'Material' ? (
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
              ) : (
                <Input
                  label="Data de Registro"
                  name="dataRegistro"
                  type="date"
                  value={formData.dataRegistro}
                  onChange={handleChange('dataRegistro')}
                  required={true}
                />
              )}
            </div>

            <div className="input-row">
              {tipoInsumo === 'Material' && (
                <Input
                  label="Data de Registro"
                  name="dataRegistro"
                  type="date"
                  value={formData.dataRegistro}
                  onChange={handleChange('dataRegistro')}
                  required={true}
                />
              )}
              <div /> {/* Espaço vazio para manter o grid */}
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
          </>
        )}
      </FormGeral>
    </div>
  );
};

export default Cadastrar;