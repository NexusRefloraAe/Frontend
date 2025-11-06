import React, { useState, useEffect } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input';
import './Editar.css';

const Editar = () => {
  const [insumos, setInsumos] = useState([
    {
      id: 1,
      tipoInsumo: 'Ferramenta',
      nomeInsumo: 'Pá Grande',
      quantidade: 300,
      unidadeMedida: 'Unidade',
      dataRegistro: '2025-05-20',
      responsavelEntrega: 'Arthur dos Santos Pereira',
      responsavelReceber: 'Ramil dos Santos Pereira'
    },
    {
      id: 2,
      tipoInsumo: 'Material',
      nomeInsumo: 'Adubo',
      quantidade: 300,
      estoqueMinimo: 100,
      unidadeMedida: 'Quilograma',
      dataRegistro: '2025-05-20',
      responsavelEntrega: 'Arthur dos Santos Pereira',
      responsavelReceber: 'Ramil dos Santos Pereira'
    }
  ]);

  const [insumoSelecionado, setInsumoSelecionado] = useState('');
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
    if (insumoSelecionado) {
      const insumo = insumos.find(item => item.id === parseInt(insumoSelecionado));
      if (insumo) {
        setFormData({
          tipoInsumo: insumo.tipoInsumo,
          nomeInsumo: insumo.nomeInsumo,
          quantidade: insumo.quantidade,
          unidadeMedida: insumo.unidadeMedida,
          dataRegistro: insumo.dataRegistro,
          responsavelEntrega: insumo.responsavelEntrega,
          responsavelReceber: insumo.responsavelReceber,
          estoqueMinimo: insumo.estoqueMinimo || ''
        });
      }
    } else {
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
    }
  }, [insumoSelecionado, insumos]);

  const handleCancel = (confirmar = true) => {
    const resetForm = () => {
      setInsumoSelecionado('');
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
    if (formData.tipoInsumo === 'Ferramenta') {
      return [
        { value: 'Unidade', label: 'Unidade' },
        { value: 'Peça', label: 'Peça' },
        { value: 'Jogo', label: 'Jogo' },
        { value: 'Conjunto', label: 'Conjunto' }
      ];
    } else if (formData.tipoInsumo === 'Material') {
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
    return formData.tipoInsumo === 'Ferramenta' ? 'Editar Ferramenta' : 
           formData.tipoInsumo === 'Material' ? 'Editar Material' : 
           'Editar Insumo';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!insumoSelecionado) {
      alert('Por favor, selecione um insumo para editar.');
      return;
    }

    const insumosAtualizados = insumos.map(insumo => 
      insumo.id === parseInt(insumoSelecionado) 
        ? { ...insumo, ...formData }
        : insumo
    );
    
    setInsumos(insumosAtualizados);
    
    console.log('Insumo atualizado:', formData);
    alert('Insumo atualizado com sucesso!');
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
      children: 'Salvar Alterações',
    },
  ];

  return (
    <div className="editar-insumo">
      <FormGeral
        title={getTitulo()}
        actions={actions}
        onSubmit={handleSubmit}
        useGrid={false}
      >
        {/* Seletor de insumo - ocupa linha inteira */}
        <div className="input-row input-row-single">
          <Input
            label="Selecionar Insumo para Editar"
            name="insumoSelecionado"
            type="select"
            value={insumoSelecionado}
            onChange={(e) => setInsumoSelecionado(e.target.value)}
            required={true}
            options={[
              { value: '', label: 'Selecione um insumo...' },
              ...insumos.map(insumo => ({
                value: insumo.id,
                label: `${insumo.tipoInsumo} - ${insumo.nomeInsumo} (${insumo.quantidade} ${insumo.unidadeMedida})`
              }))
            ]}
          />
        </div>

        {insumoSelecionado && (
          <>
            <div className="input-row">
              <Input
                label="Tipo de insumo"
                name="tipoInsumo"
                type="select"
                value={formData.tipoInsumo}
                onChange={handleChange('tipoInsumo')}
                required={true}
                options={[
                  { value: 'Ferramenta', label: 'Ferramenta' },
                  { value: 'Material', label: 'Material' }
                ]}
              />
              <Input
                label="Nome do insumo"
                name="nomeInsumo"
                type="text"
                value={formData.nomeInsumo}
                onChange={handleChange('nomeInsumo')}
                placeholder={formData.tipoInsumo === 'Ferramenta' ? 'Ex: Pá Grande' : 'Ex: Adubo'}
                required={true}
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
              {formData.tipoInsumo === 'Material' && (
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
              )}
              <Input
                label="Data de Registro"
                name="dataRegistro"
                type="date"
                value={formData.dataRegistro}
                onChange={handleChange('dataRegistro')}
                required={true}
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
          </>
        )}
      </FormGeral>
    </div>
  );
};

export default Editar;