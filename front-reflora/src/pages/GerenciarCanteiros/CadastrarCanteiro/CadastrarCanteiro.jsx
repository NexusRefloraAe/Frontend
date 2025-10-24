import React, { useState } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
// 1. Importamos o Input, pois agora a página é responsável por ele
import Input from '../../../components/Input/Input'; 
import './CadastrarCanteiro.css';

const CadastrarCanteiro = () => {
  const [formData, setFormData] = useState({
    nome: '',
    data: '',
    quantidade: 1200, // <-- Mudei para number para o stepper funcionar
    especie: '',
  });

  const handleCancel = (confirmar = true) => {
    const resetForm = () => {
      setFormData({
        nome: '',
        data: '',
        quantidade: 1200, // <-- Também mudei aqui para number
        especie: '',
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

  // 2. Ajustamos o handleChange para converter 'number' corretamente
  const handleChange = (field) => (e) => {
    // Se o tipo for 'number', garante que o valor seja salvo como número
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 3. Criamos handlers específicos para o stepper de Quantidade
  const handleQuantidadeInc = () => {
    setFormData(prev => ({ ...prev, quantidade: prev.quantidade + 1 }));
  };

  const handleQuantidadeDec = () => {
    // Evita números negativos
    setFormData(prev => ({ ...prev, quantidade: prev.quantidade > 0 ? prev.quantidade - 1 : 0 }));
  };


  const handleSubmit = (e) => {
    // e.preventDefault() já é chamado dentro do FormGeral
    console.log('Dados do Canteiro:', formData);
    alert('Cadastro salvo com sucesso!');
    handleCancel(false); // Reseta o form sem perguntar
  };

  // 4. O array 'fields' foi REMOVIDO.

  // O array 'actions' permanece o mesmo, pois o FormGeral ainda o aceita.
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
    <div className="pagina-canteiro">
      <FormGeral
        title="Cadastrar Canteiro"
        // 5. A prop 'fields' foi removida
        actions={actions}
        onSubmit={handleSubmit}
        useGrid={false} // Mantém os campos em coluna única
      >
        {/* 6. Os Inputs agora são passados como 'children' */}
        
        <Input
          label="Nome"
          name="nome"
          type="select"
          value={formData.nome}
          onChange={handleChange('nome')}
          required={true}
          placeholder="Selecione o canteiro" // Placeholder é usado pelo Input
          options={[
            // Removemos a opção "Selecione..." daqui, pois o placeholder já faz isso
            { value: 'canteiro_1', label: 'Canteiro 1' },
            { value: 'canteiro_2', label: 'Canteiro 2' },
            { value: 'canteiro_3', label: 'Canteiro 3' },
          ]}
        />
        
        <Input
          label="Data"
          name="data"
          type="date"
          value={formData.data}
          onChange={handleChange('data')}
          required={true}
          placeholder="xx/xx/xxxx"
        />
        
        <Input
          label="Quantidade"
          name="quantidade"
          type="number"
          value={formData.quantidade}
          onChange={handleChange('quantidade')} // Para digitação manual
          onIncrement={handleQuantidadeInc}   // Para o botão '+'
          onDecrement={handleQuantidadeDec}   // Para o botão '-'
          required={true}
        />
        
        <Input
          label="Espécie"
          name="especie"
          type="select"
          value={formData.especie}
          onChange={handleChange('especie')}
          required={true}
          placeholder="Selecione a espécie"
          options={[
            { value: 'eucalyptus_globulus', label: 'Eucalyptus globulus' },
            { value: 'ipe_amarelo', label: 'Ipê Amarelo' },
            { value: 'pau_brasil', label: 'Pau-Brasil' },
          ]}
        />

      </FormGeral>
    </div>
  );
};

export default CadastrarCanteiro;