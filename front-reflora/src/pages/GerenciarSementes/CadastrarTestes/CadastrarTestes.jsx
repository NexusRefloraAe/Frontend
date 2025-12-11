import React, { useState } from "react";
import FormGeral from "../../../components/FormGeral/FormGeral";
import Input from "../../../components/Input/Input";
// 1. Importar o serviço correto
import { testeGerminacaoService } from "../../../services/testeGerminacaoService";

const CadastrarTestes = () => {
  // 2. Estado com chaves em camelCase (compatível com o Service)
  const [formData, setFormData] = useState({
    lote: '',
    nomePopular: '',
    dataTeste: '', // Nome correto para o formulário
    quantidade: 0,
    camaraFria: '', // "Sim" ou "Não"
    // Campos de resultado (opcionais no cadastro, mas mantidos se quiser preencher já)
    dataGerminacao: '',
    qntdGerminou: 0,
    taxaGerminou: ''
  });

  const [loading, setLoading] = useState(false);

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

  // 3. Integração com o Backend
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    try {
      setLoading(true);
      // O serviço já sabe mapear 'dataTeste' para 'dataPlantio' no DTO do Java
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
          label="Qtd de sementes (kg/g/und)"
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

        {/* Campos removidos: TipoPlantio e QtdPlantada (não existem em Teste de Germinação) */}
        
        {/* Opcional: Se quiser permitir registrar o resultado já no cadastro */}
        {/* <Input
          label="Data Germinação"
          type="date"
          value={formData.dataGerminacao}
          onChange={handleChange('dataGerminacao')}
        /> 
        */}

      </FormGeral>
    </div>
  );
};

export default CadastrarTestes;