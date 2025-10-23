// src/components/PerfilUsuario/PerfilUsuario.jsx
import React, { useState } from 'react';
import FormsGeral from '../FormsGeral/FormsGeral'; // ✅ novo componente
import Button from '../Button/Button';
import perfilusuarioIcon from '../../assets/perfilusuario.svg';
import botaoEditarIcon from '../../assets/botaoeditar.svg';
import botaoSalvarIcon from '../../assets/botaosalvar.svg';
import botaoExcluirIcon from '../../assets/botaoexcluir.svg';
import importarfotoIcon from '../../assets/importarfoto.svg';
import './PerfilUsuario.css';

const PerfilUsuario = () => {
  const [userData, setUserData] = useState({
    nomeCompleto: 'Maria Silva',
    email: 'maria.silva@exemplo.com',
    telefone: '(00) 9 0000-0000',
    dataNascimento: '1900-01-01',
    genero: 'Feminino',
    empresa: 'XXXXX',
    endereco: 'Rua X, Nº 00, Bairro, Cidade/Estado',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field) => (e) => {
    setUserData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log('Dados salvos:', userData);
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.')) {
      console.log('Conta excluída:', userData.email);
    }
  };

  const handleTrocarFoto = () => {
    alert('Iniciando a importação de nova foto...');
  };

  // Configuração dos campos (igual antes)
  const fieldsConfig = [
    {
      label: 'Nome Completo',
      name: 'nomeCompleto',
      type: 'text',
      value: userData.nomeCompleto,
      onChange: handleChange('nomeCompleto'),
      required: true,
      readOnly: !isEditing,
      span: 2,
    },
    {
      label: 'E-mail',
      name: 'email',
      type: 'email',
      value: userData.email,
      onChange: handleChange('email'),
      required: true,
      readOnly: !isEditing,
    },
    {
      label: 'Telefone',
      name: 'telefone',
      type: 'tel',
      placeholder: '(XX) XXXXX-XXXX',
      value: userData.telefone,
      onChange: handleChange('telefone'),
      required: true,
      readOnly: !isEditing,
    },
    {
      label: 'Data de Nascimento',
      name: 'dataNascimento',
      type: 'date',
      value: userData.dataNascimento,
      onChange: handleChange('dataNascimento'),
      required: true,
      readOnly: !isEditing,
    },
    {
      label: 'Gênero',
      name: 'genero',
      type: 'text',
      value: userData.genero,
      onChange: handleChange('genero'),
      required: true,
      readOnly: !isEditing,
    },
    {
      label: 'Empresa',
      name: 'empresa',
      type: 'text',
      value: userData.empresa,
      onChange: handleChange('empresa'),
      readOnly: !isEditing,
      span: 2,
    },
    {
      label: 'Endereço',
      name: 'endereco',
      type: 'text',
      value: userData.endereco,
      onChange: handleChange('endereco'),
      required: true,
      readOnly: !isEditing,
      span: 2,
    },
  ];

  const actionsConfig = isEditing
    ? [
        {
          type: 'button',
          variant: 'action-secondary',
          children: 'Cancelar Edição',
          onClick: () => setIsEditing(false),
        },
        {
          type: 'submit',
          variant: 'primary',
          children: 'Salvar Edição',
          icon: botaoSalvarIcon,
        },
      ]
    : [
        {
          type: 'button',
          variant: 'action-primary',
          children: 'Editar Informações',
          onClick: () => setIsEditing(true),
          icon: botaoEditarIcon,
        },
        {
          type: 'button',
          variant: 'danger',
          children: 'Excluir Conta',
          onClick: handleDeleteAccount,
          icon: botaoExcluirIcon,
        },
      ];

  const sectionTitle = isEditing ? 'Editar Informações do Usuário' : 'Informações Pessoais do Usuário';
  const titleClass = isEditing
    ? 'configuracoes-profile-section__title--editing'
    : 'configuracoes-profile-section__title';

  return (
    <div className="secao-perfil-usuario">
      <h2 className={titleClass}>{sectionTitle}</h2>

      <div className="secao-perfil-usuario__avatar-area">
        <div className="secao-perfil-usuario__avatar-img">
          <img src={perfilusuarioIcon} alt="Avatar do Usuário" />
        </div>
        {isEditing && (
          <Button variant="primary" icon={importarfotoIcon} onClick={handleTrocarFoto} className="botao-trocar-foto">
            Trocar Foto
          </Button>
        )}
      </div>

      {/* ✅ Substituído AuthForm por FormGeral */}
      <FormsGeral
        fields={fieldsConfig}
        actions={actionsConfig}
        onSubmit={handleSave}
        useGrid={true}
      />
    </div>
  );
};

export default PerfilUsuario;