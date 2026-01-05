import React, { useState, useEffect } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input'; 

import { plantioService } from '../../../services/plantioService';
import { plantioCanteiroService } from '../../../services/plantioCanteiroService';
import { canteiroService } from '../../../services/canteiroService';
import { getBackendErrorMessage } from '../../../utils/errorHandler';

const CadastrarPlantioCanteiro = () => {

  const [mudasDisponiveis, setMudasDisponiveis] = useState([]);
  const [nomesCanteiros, setNomesCanteiros] = useState([]);

  // Ajustamos o formData para os nomes que o seu service/DTO esperam
  const [formData, setFormData] = useState({
    plantioMudaId: '', // ID do plantio de origem (UUID)
    quantidade: 0,     // Quantidade a ser movida
    dataPlantio: '',   // Data da mudança
    nomeCanteiro: '',  // Nome do canteiro de destino
  });

  // 1. Carrega as mudas disponíveis ao montar o componente
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        const mudas = await plantioService.getMudasDisponiveis();
        setMudasDisponiveis(mudas);

        const canteiros = await canteiroService.getNomesCanteiros();
        setNomesCanteiros(canteiros)
      } catch (error) {
        console.error("Erro ao carregar mudas disponíveis:", error);
      }
    };
    carregarDadosIniciais();
  }, []);

  const handleCancel = (confirmar = true) => {
    const resetForm = () => {
      setFormData({
        plantioMudaId: '',
        quantidade: 0,
        dataPlantio: '',
        nomeCanteiro: '',
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

  // 3. Handler 'onChange' que entende 'number'
  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 2. Chama o Service para salvar no Banco de Dados
  const handleSubmit = async () => {
    try {
      // O service já faz a formatação da data e a conversão de tipos
      await plantioCanteiroService.create(formData);
      
      alert('Movimentação para canteiro salva com sucesso!');
      handleCancel(false); // Reseta o form sem perguntar
    } catch (error) {
      console.error("Erro ao salvar:", error);
      const msg = getBackendErrorMessage(error)
      alert('Falha ao salvar cadastro: \n' + (msg || 'Erro interno'));
    }
  };

  // 4. Handlers do Stepper (simplificados, pois o estado já é 'number')
  const handleIncrement = (field) => () => {
    setFormData((prev) => ({ ...prev, [field]: prev[field] + 1 }));
  };

  const handleDecrement = (field) => () => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(0, prev[field] - 1), // Garante que não seja negativo
    }));
  };

  // 5. O array 'fields' foi REMOVIDO.

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
      children: 'Salvar Cadastro',
    },
  ];

  return (
    <div className="cadastrar-plantio-canteiro-pagina">
      <FormGeral
        title="Cadastrar Plantio no Canteiro"
        // 6. Prop 'fields' removida
        actions={actions}
        onSubmit={handleSubmit}
        useGrid={true} // <-- 7. ATIVADO para layout lado a lado
      >
        {/* 8. Inputs renderizados como 'children' e organizados em grid */}

        <Input
          label="Lote (Mudas disponíveis)"
          name="plantioMudaId"
          type="select"
          value={formData.plantioMudaId}
          onChange={handleChange('plantioMudaId')}
          required={true}
          placeholder="Selecione um lote disponível"
          options={mudasDisponiveis.map(muda => ({
            value: muda.id,
            label: `${muda.lote} - ${muda.nomePopular} (${muda.quantidadePlantada} un. disponíveis)`, // Se der erro, altere para quantidadeDisponivel
          }))}
        />
        
        {/* <Input
          label="Nome Popular"
          name="nomePopular"
          type="text"
          value={formData.nomePopular}
          onChange={handleChange('nomePopular')}
          required={true}
          placeholder="Ex: Ipê"
        /> */}

        <Input
          label="Quantidade para mover (und)"
          name="quantidade"
          type="number" 
          value={formData.quantidade}
          onChange={handleChange('quantidade')}
          required={true}
          onIncrement={handleIncrement('quantidade')}
          onDecrement={handleDecrement('quantidade')}
        />
        
        <Input
          label="Data de envio p/ canteiro"
          name="dataPlantio"
          type="date"
          value={formData.dataPlantio}
          onChange={handleChange('dataPlantio')}
          required={true}
          placeholder="dd/mm/aaaa"
        />

        {/* 9. Este 'div' usa a classe do CSS do FormGeral
               para fazer este campo ocupar 2 colunas */}
        <div className="form-geral__campo--span-2">
          <Input
            label="Local do plantio"
            name="nomeCanteiro"
            type="select"
            value={formData.nomeCanteiro}
            onChange={handleChange('nomeCanteiro')}
            required={true}
            placeholder="Selecione o local" // Usando placeholder
            options={nomesCanteiros.map(nome => ({
              value: nome,
              label: nome
            }))}
          />
        </div>

      </FormGeral>
    </div>
  );
};

export default CadastrarPlantioCanteiro;