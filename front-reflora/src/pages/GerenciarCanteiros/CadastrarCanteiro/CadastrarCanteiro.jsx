// src/pages/GerenciarCanteiros/CadastrarCanteiro/CadastrarCanteiro.jsx
import React, { useState } from 'react';
import BotaoSubmenus from '../../../components/BotaoSubmenus/BotaoSubmenus';
import FormGeral from '../../../components/FormsGeral/FormsGeral';
import Button from '../../../components/Button/Button';
import './CadastrarCanteiro.css';

// Ícones (substitua pelos seus reais)
import iconeSalvar from '../../../assets/botaosalvar.svg';
import iconeCancelar from '../../../assets/botaoeditar.svg'; // ou um ícone de "voltar"

const CadastrarCanteiro = () => {
  // Submenus da seção "Gerenciar Canteiros"
  const submenus = [
    { id: 'cadastrar', label: 'Cadastrar Canteiro', icon: null },
    { id: 'listar', label: 'Meus Canteiros', icon: null },
    // Adicione mais abas se quiser depois
  ];

  const [activeTab, setActiveTab] = useState('cadastrar');

  // Só renderiza o formulário na aba "cadastrar"
  if (activeTab !== 'cadastrar') {
    return (
      <div className="pagina-canteiro">
        <BotaoSubmenus
          menus={submenus}
          activeMenuId={activeTab}
          onMenuClick={setActiveTab}
        />
        <div className="pagina-canteiro__mensagem">
          <p>Selecione a aba "Cadastrar Canteiro" para adicionar um novo canteiro.</p>
        </div>
      </div>
    );
  }

  // Estado do formulário
  const [formData, setFormData] = useState({
    nomeCanteiro: '',
    localizacao: '',
    tipoSolo: '',
    area: '',
    irrigacao: '',
    culturas: '',
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Canteiro cadastrado:', formData);
    alert('Canteiro cadastrado com sucesso!');
    // Aqui você pode limpar o formulário ou redirecionar
  };

  const handleCancel = () => {
    if (window.confirm('Deseja cancelar o cadastro? As alterações não salvas serão perdidas.')) {
      setFormData({
        nomeCanteiro: '',
        localizacao: '',
        tipoSolo: '',
        area: '',
        irrigacao: '',
        culturas: '',
      });
    }
  };

  // Configuração dos campos
  const fields = [
    {
      label: 'Nome do Canteiro',
      name: 'nomeCanteiro',
      type: 'text',
      value: formData.nomeCanteiro,
      onChange: handleChange('nomeCanteiro'),
      required: true,
    },
    {
      label: 'Localização (Endereço ou Coordenadas)',
      name: 'localizacao',
      type: 'text',
      value: formData.localizacao,
      onChange: handleChange('localizacao'),
      required: true,
      span: 2,
    },
    {
      label: 'Tipo de Solo',
      name: 'tipoSolo',
      type: 'select',
      value: formData.tipoSolo,
      onChange: handleChange('tipoSolo'),
      required: true,
      options: [
        { value: '', label: 'Selecione o tipo de solo' },
        { value: 'arenoso', label: 'Arenoso' },
        { value: 'argiloso', label: 'Argiloso' },
        { value: 'humifero', label: 'Húmico' },
        { value: 'calcario', label: 'Calcário' },
      ],
    },
    {
      label: 'Área (m²)',
      name: 'area',
      type: 'number',
      value: formData.area,
      onChange: handleChange('area'),
      required: true,
    },
    {
      label: 'Sistema de Irrigação',
      name: 'irrigacao',
      type: 'select',
      value: formData.irrigacao,
      onChange: handleChange('irrigacao'),
      required: true,
      options: [
        { value: '', label: 'Selecione o sistema' },
        { value: 'gotejamento', label: 'Gotejamento' },
        { value: 'aspersao', label: 'Aspersão' },
        { value: 'manual', label: 'Manual' },
        { value: 'gravidade', label: 'Por gravidade' },
      ],
    },
    {
      label: 'Culturas Planejadas (separadas por vírgula)',
      name: 'culturas',
      type: 'text',
      value: formData.culturas,
      onChange: handleChange('culturas'),
      span: 2,
    },
  ];

  // Botões de ação
  const actions = [
    {
      type: 'button',
      variant: 'action-secondary',
      children: 'Cancelar',
      onClick: handleCancel,
    },
    {
      type: 'submit',
      variant: 'primary',
      children: 'Salvar Canteiro',
      icon: iconeSalvar,
    },
  ];

  return (
    <div className="pagina-canteiro">
      <BotaoSubmenus
        menus={submenus}
        activeMenuId={activeTab}
        onMenuClick={setActiveTab}
      />
      <FormGeral
        title="Cadastrar Novo Canteiro"
        fields={fields}
        actions={actions}
        onSubmit={handleSubmit}
        useGrid={true}
      />
    </div>
  );
};

export default CadastrarCanteiro;