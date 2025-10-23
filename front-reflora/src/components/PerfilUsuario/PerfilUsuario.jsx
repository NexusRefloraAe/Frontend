// src/components/PerfilUsuario/PerfilUsuario.jsx
import React, { useState } from 'react';
import FormGeral from '../FormGeral/FormGeral';
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
    dataNascimento: '1990-01-01',
    genero: 'Feminino',
    empresa: 'XXXXX',
    endereco: 'Rua X, Nº 00, Bairro, Cidade/Estado',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setUserData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Dados salvos:', userData);
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.')) {
      console.log('Conta excluída:', userData.email);
    }
  };

  const handleTrocarFoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        console.log('Foto selecionada:', file.name);
      }
    };
    input.click();
  };

  // Configuração dos campos
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
      placeholder: '(XX) 9 XXXX-XXXX',
      value: userData.telefone,
      onChange: handleChange('telefone'),
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
      type: 'select',
      value: userData.genero,
      onChange: handleChange('genero'),
      readOnly: !isEditing,
      options: [
        { value: 'Feminino', label: 'Feminino' },
        { value: 'Masculino', label: 'Masculino' },
        { value: 'Outro', label: 'Outro' },
        { value: 'Prefiro não informar', label: 'Prefiro não informar' },
      ],
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
          variant: 'secondary',
          children: 'Cancelar',
          onClick: handleCancel,
          disabled: isLoading,
        },
        {
          type: 'submit',
          variant: 'primary',
          children: isLoading ? 'Salvando...' : 'Salvar Alterações',
          icon: isLoading ? null : botaoSalvarIcon,
          disabled: isLoading,
        },
      ]
    : [
        {
          type: 'button',
          variant: 'primary',
          children: 'Editar Perfil',
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

  return (
    <div className="perfil-usuario">
      <div className="perfil-usuario__avatar-section">
        <div className="perfil-usuario__avatar">
          <img src={perfilusuarioIcon} alt="Avatar do Usuário" />
          {isEditing && (
            <div className="perfil-usuario__avatar-overlay">
              <Button
                variant="outline"
                icon={importarfotoIcon}
                onClick={handleTrocarFoto}
                size="small"
              >
                Trocar Foto
              </Button>
            </div>
          )}
        </div>
      </div>

      <FormGeral
        title={isEditing ? 'Editar Perfil' : 'Gerencie suas informações pessoais'}
        fields={fieldsConfig}
        actions={actionsConfig}
        onSubmit={handleSave}
        useGrid={true}
        loading={isLoading}
        layout="wide"
      />
    </div>
  );
};

export default PerfilUsuario;