import React, { useState, useRef } from 'react'; 
import FormGeral from '../FormGeral/FormGeral';
import Input from '../Input/Input';
import perfilusuarioIcon from '../../assets/perfilusuario.svg';
import { FaEdit, FaSave } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
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
    avatarFile: null, // Estado para guardar o arquivo
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // 2. Estado para controlar a pré-visualização da imagem
  const [avatarPreview, setAvatarPreview] = useState(perfilusuarioIcon);
  // 3. Ref para o input de arquivo oculto
  const fileInputRef = useRef(null);

  const handleChange = (field) => (e) => {
    setUserData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async (e) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Dados salvos (incluindo avatar):', userData);
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reseta a foto para a original se a edição for cancelada
    setAvatarPreview(perfilusuarioIcon);
    setUserData(prev => ({ ...prev, avatarFile: null }));
    // TODO: Resetar o resto dos dados
  };

  const handleDeleteAccount = () => {
    // Substituir window.confirm por um modal customizado é o ideal
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.')) {
      console.log('Conta excluída:', userData.email);
    }
  };

  // 4. Função que lê o arquivo e atualiza o estado
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Guarda o arquivo para upload
      setUserData(prev => ({ ...prev, avatarFile: file }));
      
      // Cria a pré-visualização
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result); // base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  // 5. Função para acionar o clique no input oculto
  const triggerFileInput = () => {
    // Só permite o clique se estiver em modo de edição
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const actionsConfig = isEditing
    ? [
        // ... (configuração de ações 'isEditing' permanece a mesma)
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
          children: isLoading ? 'Salvando...' : 'Salvar Edições',
          icon: isLoading ? null : <FaSave />,
          disabled: isLoading,
        },
      ]
    : [
        // ... (configuração de ações 'not isEditing' permanece a mesma)
        {
          type: 'button',
          variant: 'primary',
          children: 'Editar Perfil',
          onClick: () => setIsEditing(true),
          icon: <FaEdit />,
        },
        {
          type: 'button',
          variant: 'danger',
          children: 'Excluir Conta',
          onClick: handleDeleteAccount,
          icon: <RiDeleteBin6Line />,
        },
      ];

  return (
    <div className="perfil-usuario">
      
      {/* 6. Bloco do Avatar ATUALIZADO */}
      <div className="perfil-usuario__avatar-section">
        {/* Usamos as classes do 'ImageUpload' como solicitado */}
        <div className="image-upload-wrapper">
          <div 
            className="image-upload-container" 
            onClick={triggerFileInput} // Aciona o input de arquivo
            // Muda o cursor apenas se estiver editando
            style={{ cursor: isEditing ? 'pointer' : 'default' }}
          >
            {/* Input de arquivo real, mas oculto */}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
            />
            
            {/* Renderiza a pré-visualização ou o ícone padrão.
              Usamos classes diferentes para aplicar 'object-fit'
            */}
            <img 
              src={avatarPreview} 
              alt="Avatar" 
              className={
                avatarPreview === perfilusuarioIcon 
                ? 'image-placeholder-icon' // Classe para o ícone padrão
                : 'image-preview'          // Classe para a foto do usuário
              }
            />
          </div>
        </div>
      </div>

      <FormGeral
        title={isEditing ? 'Editar Perfil' : 'Gerencie suas informações pessoais'}
        actions={actionsConfig}
        onSubmit={handleSave}
        useGrid={true}
        loading={isLoading}
        layout="wide"
      >
        {/* Os campos <Input> permanecem exatamente os mesmos.
          ...
        */}

        {/* Nome Completo (span: 2) */}
        <div className="form-geral__campo--span-2">
          <Input
            label="Nome Completo"
            name="nomeCompleto"
            type="text"
            value={userData.nomeCompleto}
            onChange={handleChange('nomeCompleto')}
            required={true}
            readOnly={!isEditing || isLoading}
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