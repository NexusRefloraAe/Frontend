import React, { useState, useEffect } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input'; 
import { plantioCanteiroService } from '../../../services/plantioCanteiroService';

const EditarCanteiro = ({ itemParaEditar, aoSalvarSucesso, aoCancelar }) => {
  const [formData, setFormData] = useState({
    id: '',
    nomeCanteiro: '',
    especie: '',
    data: '',
    quantidade: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (itemParaEditar) {
      // Mapeia os dados do PlantioCanteiroListagemDTO para o estado do formulário
      setFormData({
        id: itemParaEditar.id,
        nomeCanteiro: itemParaEditar.nomeCanteiro || 'Não informado', // Exibição
        especie: itemParaEditar.nomeEspecie || '', // Exibição
        // Se a data vier do Java como dd/MM/yyyy, o input type="date" precisa de yyyy-MM-dd
        data: formatarParaInputDate(itemParaEditar.dataPlantio), 
        quantidade: itemParaEditar.quantidade || 0,
      });
    }
  }, [itemParaEditar]);

  // Função auxiliar para converter "25/12/2025" -> "2025-12-25"
  const formatarParaInputDate = (dataBR) => {
    if (!dataBR) return '';
    const [dia, mes, ano] = dataBR.split('/');
    return `${ano}-${mes}-${dia}`;
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await plantioCanteiroService.update(formData.id, formData);
      alert('Lote editado com sucesso!');
      if (aoSalvarSucesso) aoSalvarSucesso(); // Função para fechar modal ou recarregar lista
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Erro ao salvar alteração.');
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    {
      type: 'button',
      variant: 'action-secondary',
      children: 'Cancelar',
      onClick: aoCancelar,
    },
    {
      type: 'submit',
      variant: 'primary',
      children: loading ? 'Salvando...' : 'Salvar Edição',
      disabled: loading
    },
  ];

  return (
    <div className="pagina-canteiro">
      <FormGeral
        title="Editar Lote no Canteiro"
        actions={actions}
        onSubmit={handleSubmit}
        useGrid={false}
      >
        {/* EXIBIÇÃO APENAS: Nome do Canteiro e Espécie */}
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <p><strong>Canteiro:</strong> {formData.nomeCanteiro}</p>
          <p><strong>Espécie:</strong> {formData.especie}</p>
        </div>

        <Input
          label="Nova Data de Plantio"
          name="data"
          type="date"
          value={formData.data}
          onChange={handleChange('data')}
          required={true}
        />
        
        <Input
          label="Nova Quantidade"
          name="quantidade"
          type="number"
          value={formData.quantidade}
          onChange={handleChange('quantidade')}
          onIncrement={() => setFormData(p => ({...p, quantidade: p.quantidade + 1}))}
          onDecrement={() => setFormData(p => ({...p, quantidade: p.quantidade > 0 ? p.quantidade - 1 : 0}))}
          required={true}
        />
      </FormGeral>
    </div>
  );
};

export default EditarCanteiro;