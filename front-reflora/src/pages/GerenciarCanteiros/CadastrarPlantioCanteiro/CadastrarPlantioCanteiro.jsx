import React, { useState, useEffect } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input'; 

import { plantioService } from '../../../services/plantioService';
import { plantioCanteiroService } from '../../../services/plantioCanteiroService';
import { canteiroService } from '../../../services/canteiroService';
import { getBackendErrorMessage } from '../../../utils/errorHandler';

// Importando o CSS
import './CadastrarPlantioCanteiro.css';

const CadastrarPlantioCanteiro = () => {

  const [mudasDisponiveis, setMudasDisponiveis] = useState([]);
  const [nomesCanteiros, setNomesCanteiros] = useState([]);

  const [formData, setFormData] = useState({
    plantioMudaId: '',
    quantidade: 0,    
    dataPlantio: '',  
    nomeCanteiro: '', 
  });

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

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await plantioCanteiroService.create(formData);
      alert('Movimentação para canteiro salva com sucesso!');
      handleCancel(false); 
    } catch (error) {
      console.error("Erro ao salvar:", error);
      const msg = getBackendErrorMessage(error)
      alert('Falha ao salvar cadastro: \n' + (msg || 'Erro interno'));
    }
  };

  const handleIncrement = (field) => () => {
    setFormData((prev) => ({ ...prev, [field]: prev[field] + 1 }));
  };

  const handleDecrement = (field) => () => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(0, prev[field] - 1), 
    }));
  };

  return (
    <div className="cadastro-plantio-canteiro-container">
      <FormGeral
        title="Cadastrar Plantio no Canteiro"
        onSubmit={handleSubmit}
        useGrid={false} // Grid manual
      >
        
        {/* Grid Customizado */}
        <div className="plantio-canteiro-grid">
            
            {/* Lote ocupa a linha toda */}
            <div className="span-full">
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
                    label: `${muda.lote} - ${muda.nomePopular} (${muda.quantidadePlantada} un. disponíveis)`, 
                  }))}
                />
            </div>

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

            {/* Local ocupa a linha toda */}
            <div className="span-full">
                <Input
                  label="Local do plantio (Canteiro)"
                  name="nomeCanteiro"
                  type="select"
                  value={formData.nomeCanteiro}
                  onChange={handleChange('nomeCanteiro')}
                  required={true}
                  placeholder="Selecione o local"
                  options={nomesCanteiros.map(nome => ({
                    value: nome,
                    label: nome
                  }))}
                />
            </div>
        </div>

        {/* Botões Manuais */}
        <div className="plantio-canteiro-actions">
            <button 
                type="button" 
                className="plantio-canteiro-btn btn-cancelar"
                onClick={() => handleCancel(true)}
            >
                Cancelar
            </button>
            <button 
                type="submit" 
                className="plantio-canteiro-btn btn-salvar"
            >
                Salvar Cadastro
            </button>
        </div>

      </FormGeral>
    </div>
  );
};

export default CadastrarPlantioCanteiro;