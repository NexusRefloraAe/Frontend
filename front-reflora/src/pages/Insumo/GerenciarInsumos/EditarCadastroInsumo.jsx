import React, { useState, useEffect } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input';
import insumoService from '../../../services/insumoService';

const EditarCadastroInsumo = ({ isOpen, onClose, item, onSalvar }) => {
  const [formData, setFormData] = useState({
    nomeInsumo: '',
    quantidade: '',
    estoqueMinimo: '',
    unidadeMedida: '',
    tipoInsumo: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        nomeInsumo: item.nome || '',
        quantidade: item.quantidadeAtual || '',
        estoqueMinimo: item.estoqueMinimo || '',
        unidadeMedida: item.unidadeMedida || 'UNIDADE',
        tipoInsumo: item.tipoInsumo || 'MATERIAL'
      });
    }
  }, [item]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getUnidades = () => {
    // Retorna lista baseada no tipo (simplificação)
    if (formData.tipoInsumo === 'FERRAMENTA') {
        return [
            { value: 'UNIDADE', label: 'Unidade' },
            { value: 'JOGO', label: 'Jogo' },
            { value: 'PECA', label: 'Peça' }
        ];
    }
    return [
        { value: 'KG', label: 'Kg' },
        { value: 'LITRO', label: 'Litro' },
        { value: 'UNIDADE', label: 'Unidade' },
        { value: 'SACO', label: 'Saco' },
        { value: 'METRO', label: 'Metro' },
        { value: 'CAIXA', label: 'Caixa' }
    ];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const payload = {
            nomeInsumo: formData.nomeInsumo,
            quantidade: Number(formData.quantidade),
            estoqueMinimo: Number(formData.estoqueMinimo),
            unidadeMedida: formData.unidadeMedida,
            tipoInsumo: item.tipoInsumo // Mantém o tipo original
        };

        // Chama a rota de atualização do INSUMO (não movimentação)
        await insumoService.atualizarInsumo(item.id, payload);
        
        alert("Cadastro atualizado com sucesso!");
        
        if (onSalvar) onSalvar(); // Recarrega a lista pai
        onClose();

    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao atualizar cadastro.");
    }
  };

  const actions = [
    { type: 'button', variant: 'action-secondary', children: 'Cancelar', onClick: onClose },
    { type: 'submit', variant: 'primary', children: 'Salvar Alterações' },
  ];

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn-fechar-modal" onClick={onClose}>×</button>
        <FormGeral
          title={`Editar Cadastro - ${formData.nomeInsumo}`}
          actions={actions}
          onSubmit={handleSubmit}
          useGrid={false}
        >
          <div className="input-row">
            <Input label="Nome do Insumo" name="nomeInsumo" type="text" value={formData.nomeInsumo} onChange={handleChange('nomeInsumo')} required />
          </div>
          
          <div className="input-row">
             <Input label="Estoque Atual (Correção)" name="quantidade" type="number" value={formData.quantidade} onChange={handleChange('quantidade')} required />
             <Input label="Estoque Mínimo" name="estoqueMinimo" type="number" value={formData.estoqueMinimo} onChange={handleChange('estoqueMinimo')} required />
          </div>

          <div className="input-row">
             <Input 
                label="Unidade de Medida" 
                name="unidadeMedida" 
                type="select" 
                value={formData.unidadeMedida} 
                onChange={handleChange('unidadeMedida')} 
                options={getUnidades()}
                required 
             />
             <Input label="Tipo" name="tipoInsumo" type="text" value={formData.tipoInsumo} readOnly />
          </div>
        </FormGeral>
      </div>
    </div>
  );
};

export default EditarCadastroInsumo;