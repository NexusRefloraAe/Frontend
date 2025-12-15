import React, { useState, useEffect } from "react";
import FormGeral from "../../../components/FormGeral/FormGeral";
import Input from "../../../components/Input/Input";
import { testeGerminacaoService } from "../../../services/testeGerminacaoService";

const CadastrarTestes = () => {
  const [formData, setFormData] = useState({
    lote: '',
    nomePopular: '',
    dataTeste: '',
    quantidade: 0,
    camaraFria: '',
    dataGerminacao: '',
    qntdGerminou: 0,
    taxaGerminou: '' // Campo calculado
  });

  const [loading, setLoading] = useState(false);

  // --- NOVO: Efeito para calcular a Taxa automaticamente ---
  useEffect(() => {
    const total = Number(formData.quantidade);
    const germinou = Number(formData.qntdGerminou);

    if (total > 0 && germinou >= 0) {
      // Calcula: (Germinou / Total) * 100
      const taxa = ((germinou / total) * 100).toFixed(2);
      
      // Atualiza o estado apenas se o valor mudou para evitar loop
      setFormData(prev => {
        if (prev.taxaGerminou === taxa) return prev;
        return { ...prev, taxaGerminou: taxa };
      });
    } else {
      setFormData(prev => ({ ...prev, taxaGerminou: '' }));
    }
  }, [formData.quantidade, formData.qntdGerminou]);
  // ---------------------------------------------------------

  const handleCancel = (confirmar = true) => {
    const resetForm = () => {
      setFormData({
        lote: '',
        nomePopular: '',
        dataTeste: '',
        quantidade: 0,
        camaraFria: '',
        dataGerminacao: '',
        qntdGerminou: 0,
        taxaGerminou: ''
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

  const handleIncrement = (field) => {
    setFormData(prev => ({ ...prev, [field]: prev[field] + 1 }));
  };

  const handleDecrement = (field) => {
    setFormData(prev => ({ ...prev, [field]: prev[field] > 0 ? prev[field] - 1 : 0 }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    try {
      setLoading(true);
      await testeGerminacaoService.create(formData);
      alert('Teste cadastrado com sucesso!');
      handleCancel(false);
    } catch (error) {
      console.error("Erro ao cadastrar teste:", error);
      alert("Erro ao salvar cadastro.");
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    {
      type: 'button',
      variant: 'action-secondary',
      children: 'Cancelar',
      onClick: () => handleCancel(true),
      disabled: loading
    },
    {
      type: 'submit',
      variant: 'primary',
      children: loading ? 'Salvando...' : 'Salvar Cadastro',
      disabled: loading
    },
  ];

  return (
    <div className="">
      <FormGeral
        title="Cadastro Teste de Germinação"
        actions={actions}
        onSubmit={handleSubmit}
        useGrid={true}
      >
        <Input
          label="Lote"
          name="lote"
          type="text"
          value={formData.lote}
          onChange={handleChange('lote')}
          required={true}
          placeholder="A001"
        />

        <Input
          label="Nome Popular"
          name="nomePopular"
          type="text"
          value={formData.nomePopular}
          onChange={handleChange('nomePopular')}
          required={true}
          placeholder="Ipê"
        />

        <Input
          label="Data do Teste"
          name="dataTeste"
          type="date"
          value={formData.dataTeste}
          onChange={handleChange('dataTeste')}
          required={true}
        />

        <Input
          label="Qtd de sementes (Total)"
          name="quantidade"
          type="number"
          value={formData.quantidade}
          onChange={handleChange('quantidade')}
          onIncrement={() => handleIncrement("quantidade")}
          onDecrement={() => handleDecrement("quantidade")}
          required={true}
        />

        <Input
          label="Câmara fria"
          name="camaraFria"
          type="select"
          value={formData.camaraFria}
          onChange={handleChange('camaraFria')}
          required={true}
          placeholder="Sim/não"
          options={[
            { value: 'Sim', label: 'Sim' },
            { value: 'Não', label: 'Não' },
          ]}
        />

        <Input
          label="Data Germinação"
          name="dataGerminacao"
          type="date"
          value={formData.dataGerminacao}
          onChange={handleChange('dataGerminacao')}
          required={false} 
        />

        <Input
          label="Qtd Germinou (und)"
          name="qntdGerminou"
          type="number"
          value={formData.qntdGerminou}
          onChange={handleChange('qntdGerminou')}
          onIncrement={() => handleIncrement("qntdGerminou")}
          onDecrement={() => handleDecrement("qntdGerminou")}
          required={false} 
        />

        {/* --- NOVO CAMPO ADICIONADO --- */}
        <Input
          label="Taxa Germinação (%)"
          name="taxaGerminou"
          type="text"
          value={formData.taxaGerminou ? `${formData.taxaGerminou}%` : ''} 
          onChange={() => {}} // Sem onChange pois é apenas leitura
          disabled={true}     // Desabilita edição manual
          placeholder="Calculado automaticamente..."
        />

      </FormGeral>
    </div>
  );
};

export default CadastrarTestes;