import React, { useState, useEffect } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input';
import insumoService from '../../../services/insumoService';
import './EditarFerramenta.css';

const EditarFerramenta = ({ isOpen, onClose, itemParaEditar, onSalvar }) => {
  const [formData, setFormData] = useState({
    nomeInsumo: '',
    quantidade: '',
    unidadeMedida: 'UNIDADE',
    dataRegistro: '',
    responsavelEntrega: '',
    responsavelReceber: '',
    status: ''
  });

  useEffect(() => {
    if (itemParaEditar) {
      setFormData({
        nomeInsumo: itemParaEditar.NomeInsumo || '',
        quantidade: itemParaEditar.Quantidade || '',
        // Garante que tenha valor ou usa UNIDADE
        unidadeMedida: itemParaEditar.UnidadeMedida || 'UNIDADE', 
        dataRegistro: formatarDataParaInput(itemParaEditar.Data),
        responsavelEntrega: itemParaEditar.ResponsavelEntrega || '',
        responsavelReceber: itemParaEditar.ResponsavelRecebe || '',
        status: itemParaEditar.Status || ''
      });
    }
  }, [itemParaEditar]);

  const formatarDataParaInput = (dataBR) => {
    if (!dataBR || dataBR.includes('-')) return dataBR;
    const [dia, mes, ano] = dataBR.split('/');
    return `${ano}-${mes}-${dia}`;
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuantidadeInc = () => setFormData(p => ({ ...p, quantidade: Number(p.quantidade) + 1 }));
  const handleQuantidadeDec = () => setFormData(p => ({ ...p, quantidade: Math.max(0, Number(p.quantidade) - 1) }));

  // --- NOVA FUNÇÃO DE OPÇÕES ---
  const getUnidadesFerramenta = () => {
    return [
      { value: 'UNIDADE', label: 'Unidade' },
      { value: 'PECA', label: 'Peça' },
      { value: 'JOGO', label: 'Jogo' },
      { value: 'CONJUNTO', label: 'Conjunto' }
    ];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemParaEditar?.id) return alert('Erro: ID não encontrado.');

    let sucessoApi = false;

    try {
        const payload = {
            insumoId: itemParaEditar.id,
            nomeInsumo: formData.nomeInsumo,
            status: formData.status.toUpperCase(),
            quantidade: Number(formData.quantidade),
            dataRegistro: formData.dataRegistro,
            responsavelEntrega: formData.responsavelEntrega,
            responsavelReceber: formData.responsavelReceber,
            unidadeMedida: formData.unidadeMedida // Envia a nova unidade selecionada
        };

        await insumoService.atualizarMovimentacao(itemParaEditar.id, payload);
        sucessoApi = true;

        alert('Ferramenta atualizada com sucesso!');
        
        onSalvar({ 
            id: itemParaEditar.id,
            Data: formData.dataRegistro.split('-').reverse().join('/'),
            NomeInsumo: formData.nomeInsumo,
            Status: formData.status,
            Quantidade: Number(formData.quantidade),
            UnidadeMedida: formData.unidadeMedida,
            ResponsavelEntrega: formData.responsavelEntrega,
            ResponsavelRecebe: formData.responsavelReceber,
            imagem: itemParaEditar.imagem
        });

    } catch (error) {
        console.error("Erro:", error);
        if(!sucessoApi) alert("Erro ao atualizar ferramenta.");
    }
  };

  const actions = [
    { type: 'button', variant: 'action-secondary', children: 'Cancelar', onClick: () => onClose() },
    { type: 'submit', variant: 'primary', children: 'Salvar Edições' },
  ];

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn-fechar-modal" onClick={onClose}>×</button>
        <FormGeral
          title={`Editar Ferramenta - ${itemParaEditar?.NomeInsumo || ''}`}
          actions={actions}
          onSubmit={handleSubmit}
          useGrid={false}
        >
          <div className="input-row">
            <Input label="Nome" name="nomeInsumo" type="text" value={formData.nomeInsumo} onChange={handleChange('nomeInsumo')} required />
            <Input label="Qtd" name="quantidade" type="number" value={formData.quantidade} onChange={handleChange('quantidade')} onIncrement={handleQuantidadeInc} onDecrement={handleQuantidadeDec} />
          </div>
          
          <div className="input-row">
            {/* INPUT ATUALIZADO PARA SELECT */}
            <Input 
                label="Unidade de Medida" 
                name="unidadeMedida" 
                type="select" 
                value={formData.unidadeMedida} 
                onChange={handleChange('unidadeMedida')}
                options={getUnidadesFerramenta()} 
                required
            />

            <Input label="Status" name="status" type="select" value={formData.status} onChange={handleChange('status')} required options={[
                { value: 'EMPRESTADO', label: 'Emprestado' },
                { value: 'DEVOLVIDO', label: 'Devolvido' },
                { value: 'ENTRADA', label: 'Entrada' }
            ]} />
          </div>
          
          <div className="input-row">
            <Input label="Data" name="dataRegistro" type="date" value={formData.dataRegistro} onChange={handleChange('dataRegistro')} required />
          </div>
          
          <div className="input-row">
            <Input label="Resp. Entrega" name="responsavelEntrega" type="text" value={formData.responsavelEntrega} onChange={handleChange('responsavelEntrega')} required />
            <Input label="Resp. Recebe" name="responsavelReceber" type="text" value={formData.responsavelReceber} onChange={handleChange('responsavelReceber')} required />
          </div>
        </FormGeral>
      </div>
    </div>
  );
};

export default EditarFerramenta;