import React, { useState } from "react";
import FormGeral from "../../../components/FormGeral/FormGeral";
import Input from "../../../components/Input/Input";
// Importação do serviço
import { plantioService } from "../../../services/plantioService";

const CadastrarPlantio = () => {

  // 1. Estado inicial padronizado (camelCase)
  const [formData, setFormData] = useState({
    lote: '',
    nomePopular: '',
    qntdSementes: 0,
    dataPlantio: '',
    tipoPlantio: '',
    qntdPlantada: 0,
  });

  const [loading, setLoading] = useState(false);

  // 2. Funções de Manipulação do Formulário
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
    // Garante que campos numéricos sejam salvos como Number
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIncrement = (field) => {
    setFormData((prev) => ({ ...prev, [field]: prev[field] + 1 }));
  };

  const handleDecrement = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] > 0 ? prev[field] - 1 : 0
    }));
  };

  // 3. Envio para o Backend via Service
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    try {
      setLoading(true);
      
      // Chama o serviço que formata os dados e envia para /api/movimentacoes
      await plantioService.create(formData);
      
      alert("Plantio cadastrado com sucesso!");
      handleCancel(false); // Reseta o form sem perguntar
    } catch (error) {
      console.error("Erro ao cadastrar plantio:", error);
      
      // Tratamento básico de erro para feedback visual
      if (error.response && error.response.data && error.response.data.message) {
         alert(`Erro: ${error.response.data.message}`);
      } else {
         alert("Erro ao cadastrar plantio. Verifique se o Lote existe no Banco de Sementes.");
      }
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
      disabled: loading,
    },
    {
      type: 'submit',
      variant: 'primary',
      children: loading ? 'Salvando...' : 'Salvar Cadastro',
      disabled: loading,
    },
  ];

  return (
    <div className="">
      <FormGeral
        title="Cadastro Plantio"
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
          label="Data"
          name="dataPlantio"
          type="date"
          value={formData.dataPlantio}
          onChange={handleChange('dataPlantio')}
          required={true}
        />

        <Input
          label="Qtd sementes (kg/g/und)"
          name="qntdSementes"
          type="number"
          value={formData.qntdSementes}
          onChange={handleChange('qntdSementes')}
          onIncrement={() => handleIncrement("qntdSementes")}
          onDecrement={() => handleDecrement("qntdSementes")}
          required={true}
        />

        <Input
          label="Qtd plantada (und)"
          name="qntdPlantada"
          type="number"
          value={formData.qntdPlantada}
          onChange={handleChange('qntdPlantada')}
          onIncrement={() => handleIncrement("qntdPlantada")}
          onDecrement={() => handleDecrement("qntdPlantada")}
          required={true}
        />

        <Input
          label="Tipo de plantio"
          name="tipoPlantio"
          type="select"
          value={formData.tipoPlantio}
          onChange={handleChange('tipoPlantio')}
          required={true}
          placeholder="Selecione..."
          options={[
            // Valores em Maiúsculo para bater com o Enum do Java (TipoPlantio.java)
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