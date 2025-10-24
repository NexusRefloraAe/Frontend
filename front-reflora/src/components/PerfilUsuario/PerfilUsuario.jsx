import React, { useState } from 'react';
import FormGeral from '../FormGeral/FormGeral';
import Button from '../Button/Button';
import Input from '../Input/Input'; // <-- 1. Importamos o Input
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
    // e.preventDefault() já é tratado pelo FormGeral
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
    // TODO: Resetar os dados para o estado original (antes da edição)
    // Por enquanto, apenas sai do modo de edição.
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

  // 2. O 'fieldsConfig' foi REMOVIDO daqui.

  // A lógica de 'actions' está correta e permanece.
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
        // 3. A prop 'fields' foi removida
        actions={actionsConfig}
        onSubmit={handleSave}
        useGrid={true}
        loading={isLoading} // O FormGeral usa 'loading' para desabilitar as 'actions'
        layout="wide"
      >
        {/* 4. Inputs renderizados como 'children' */}
        
        {/* Nome Completo (span: 2) */}
        <div className="form-geral__campo--span-2">
          <Input
            label="Nome Completo"
            name="nomeCompleto"
            type="text"
            value={userData.nomeCompleto}
            onChange={handleChange('nomeCompleto')}
            required={true}
            readOnly={!isEditing || isLoading} // 5. Lógica de ReadOnly atualizada
          />
        </div>

        {/* E-mail */}
        <Input
          label="E-mail"
          name="email"
          type="email"
          value={userData.email}
          onChange={handleChange('email')}
          required={true}
          readOnly={!isEditing || isLoading}
        />

        {/* Telefone */}
        <Input
          label="Telefone"
          name="telefone"
          type="tel"
          placeholder="(XX) 9 XXXX-XXXX"
          value={userData.telefone}
          onChange={handleChange('telefone')}
          readOnly={!isEditing || isLoading}
        />

        {/* Data de Nascimento */}
        <Input
          label="Data de Nascimento"
          name="dataNascimento"
          type="date"
          value={userData.dataNascimento}
          onChange={handleChange('dataNascimento')}
          required={true}
          readOnly={!isEditing || isLoading}
        />

        {/* Gênero */}
        <Input
          label="Gênero"
          name="genero"
          type="select"
          value={userData.genero}
          onChange={handleChange('genero')}
          readOnly={!isEditing || isLoading}
          // O seu Input.jsx (do prompt anterior) usa 'readOnly'
          // Idealmente, ele deveria usar 'disabled' para <select>
          // Mas estamos usando 'readOnly' para manter consistência
          // com o seu código anterior.
          options={[
            { value: 'Feminino', label: 'Feminino' },
            { value: 'Masculino', label: 'Masculino' },
            { value: 'Outro', label: 'Outro' },
            { value: 'Prefiro não informar', label: 'Prefiro não informar' },
          ]}
        />

        {/* Empresa (span: 2) */}
        <div className="form-geral__campo--span-2">
          <Input
            label="Empresa"
            name="empresa"
            type="text"
            value={userData.empresa}
            onChange={handleChange('empresa')}
            readOnly={!isEditing || isLoading}
          />
        </div>

        {/* Endereço (span: 2) */}
        <div className="form-geral__campo--span-2">
          <Input
            label="Endereço"
            name="endereco"
            type="text"
            value={userData.endereco}
            onChange={handleChange('endereco')}
            required={true}
            readOnly={!isEditing || isLoading}
          />
        </div>
        
      </FormGeral>
    </div>
  );
};

export default PerfilUsuario;