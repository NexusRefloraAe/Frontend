import React, { useState } from "react";
import FormGeral from "../../../components/FormGeral/FormGeral";
import Input from "../../../components/Input/Input";
import { plantioService } from "../../../services/plantioService";

const CadastrarPlantio = () => {

  // 1. Estado inicial (chaves em camelCase)
  const [formData, setFormData] = useState({
    lote: '',
    nomePopular: '',
    qntdSementes: 0,
    dataPlantio: '',
    tipoPlantio: '',
    qntdPlantada: 0,
  });

  const [loading, setLoading] = useState(false); // Adicionei estado de carregamento

  const handleCancel = (confirmar = true) => {
    const resetForm = () => {
      setFormData({
        lote: '',
        nomePopular: '',
        qntdSementes: 0,
        dataPlantio: '',
        tipoPlantio: '',
        qntdPlantada: 0,
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

  // 2. Integração com o Back-End
  const handleSubmit = async (e) => {
    // FormGeral previne o default, mas é bom garantir
    if(e && e.preventDefault) e.preventDefault();

    try {
      setLoading(true); // Bloqueia o botão
      
      // O 'formData' aqui já tem as chaves corretas (lote, nomePopular...)
      // que o plantioService.create espera para montar o DTO.
      await plantioService.create(formData); 
      
      alert("Plantio cadastrado com sucesso!");
      handleCancel(false); // Reseta o formulário
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar plantio. Verifique os dados.");
    } finally {
      setLoading(false); // Libera o botão
    }
  }

  const actions = [
    {
      type: 'button',
      variant: 'action-secondary',
      children: 'Cancelar',
      onClick: () => handleCancel(true),
      disabled: loading // Desabilita se estiver carregando
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
        title="Cadastro/Editar Plantio"
        actions={actions}
        onSubmit={handleSubmit}
        useGrid={true}
      >
        {/* CORREÇÃO IMPORTANTE ABAIXO: 
            Usei 'lote' (minúsculo) em vez de 'Lote' para bater com o useState 
        */}
        
        <Input
          label="Lote"
          name="lote"
          type="text"
          value={formData.lote} // <-- Corrigido
          onChange={handleChange('lote')} // <-- Corrigido
          required={true}
          placeholder="A001"
        />

        <Input
          label="Nome Popular"
          name="nomePopular"
          type="text"
          value={formData.nomePopular} // <-- Corrigido
          onChange={handleChange('nomePopular')} // <-- Corrigido
          required={true}
          placeholder="Ipê"
        />
        
        <Input
          label="Data"
          name="dataPlantio"
          type="date"
          value={formData.dataPlantio} // <-- Corrigido
          onChange={handleChange('dataPlantio')} // <-- Corrigido
          required={true}
        />
        
        <Input
          label="Qtd sementes (kg/g/und)"
          name="qntdSementes"
          type="number"
          value={formData.qntdSementes} // <-- Corrigido
          onChange={handleChange('qntdSementes')} 
          onIncrement={() => handleIncrement("qntdSementes")}
          onDecrement={() => handleDecrement("qntdSementes")}
          required={true}
        />

        <Input
          label="Qtd plantada (und)"
          name="qntdPlantada"
          type="number"
          value={formData.qntdPlantada} // <-- Corrigido
          onChange={handleChange('qntdPlantada')}
          onIncrement={() => handleIncrement("qntdPlantada")}
          onDecrement={() => handleDecrement("qntdPlantada")}
          required={true}
        />

        <Input
          label="Tipo de plantio"
          name="tipoPlantio"
          type="select"
          value={formData.tipoPlantio} // <-- Corrigido
          onChange={handleChange('tipoPlantio')}
          required={true}
          placeholder="Selecione..."
          options={[
            // DICA: Se o backend espera 'SEMENTEIRA' (Maiúsculo), é melhor já enviar assim no value
            { value: 'SEMENTEIRA', label: 'Sementeira' },
            { value: 'SAQUINHO', label: 'Saquinho' },
            { value: 'CHAO', label: 'Chão' },
          ]}
        />
      </FormGeral>
    </div>
  );
};

export default CadastrarPlantio;