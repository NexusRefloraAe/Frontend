import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { usuarioService } from '../../services/usuarioService';
import FormGeral from '../FormGeral/FormGeral';
import Button from '../Button/Button';
import Input from '../Input/Input'; 
import perfilusuarioIcon from '../../assets/perfilusuario.svg';
import { FaEdit, FaSave } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import './PerfilUsuario.css';
import importarfotoIcon from '../../assets/importarfoto.svg';
import { getBackendErrorMessage } from '../../utils/errorHandler';

const PerfilUsuario = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null); 

  const [userData, setUserData] = useState({
    nomeCompleto: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    genero: '',
    empresa: '',
    endereco: '',
    fotoUrl: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = authService.getCurrentUser();
        
        if (!user || !user.id) {
            navigate('/login');
            return;
        }
        setCurrentUser(user);

        const data = await usuarioService.getUsuario(user.id);
        console.log("Dados do usuário:", data);

        // --- Tratamento de Data ---
        let dataNascFormatada = '';
        if (data.dataNascimento) {
            if(data.dataNascimento.includes('T') || data.dataNascimento.includes(' ')) {
                dataNascFormatada = data.dataNascimento.substring(0, 10);
            } else if (data.dataNascimento.includes('/')) {
                const parts = data.dataNascimento.split('/'); 
                if(parts.length === 3) {
                    dataNascFormatada = `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
            } else {
                dataNascFormatada = data.dataNascimento;
            }
        }

        // --- CORREÇÃO DA URL DA FOTO ---
        let rawUrl = data.fotoUsuario?.url || data.fotoUsuarioResponseDTO?.url || data.fotoUrl || null;

        if (rawUrl) {
            if (rawUrl.includes("reflora-minio")) {
                rawUrl = rawUrl.replace("reflora-minio", "localhost");
            } else if (rawUrl.includes("minio")) { 
                 rawUrl = rawUrl.replace("minio", "localhost");
            }
        }

        setUserData({
            nomeCompleto: data.nomeCompleto || '',
            email: data.email || '',
            telefone: data.numeroCelular || '', 
            dataNascimento: dataNascFormatada,
            genero: data.genero || '', 
            empresa: data.empresa || '',
            endereco: data.endereco || '',
            fotoUrl: rawUrl 
        });

      } catch (error) {
        const mensagem = getBackendErrorMessage(error);
        console.error("Erro ao carregar perfil", mensagem);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (field) => (e) => {
    setUserData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    setIsLoading(true);
    try {
      await usuarioService.updateUsuario(currentUser.id, userData, fotoFile);
      
      alert('Dados salvos com sucesso!');
      setIsEditing(false);
      setFotoFile(null); 
      window.location.reload(); 

    } catch (error) {
      const mensagem = getBackendErrorMessage(error);
      console.error('Erro ao salvar:', mensagem);
      alert('Ocorreu um erro ao salvar as alterações.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFotoFile(null);
    setFotoPreview(null);
    window.location.reload();
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.')) {
      try {
        await usuarioService.deleteUsuario(currentUser.id);
        
        alert('Conta excluída.');
        authService.logout(); 
        window.location.href = '/login'; 

      } catch (error) {
        const mensagem = getBackendErrorMessage(error);
        console.error('Erro ao excluir:', mensagem);
        alert('Erro ao excluir conta.');
      }
    }
  };

  const handleTrocarFoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFotoFile(file); 
        setFotoPreview(URL.createObjectURL(file)); 
      }
    };
    input.click();
  };

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
          children: isLoading ? 'Salvando...' : 'Salvar Edições',
          icon: isLoading ? null : <FaSave />,
          disabled: isLoading,
        },
      ]
    : [
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
      
  const imagemExibida = fotoPreview || userData.fotoUrl || perfilusuarioIcon;

  return (
    <div className="perfil-usuario">

      <FormGeral
        title={isEditing ? 'Editar Perfil' : 'Gerencie suas informações pessoais'}
        actions={actionsConfig}
        onSubmit={handleSave}
        useGrid={true}
        loading={isLoading}
        layout="wide"
      >
        {/* --- SEÇÃO DO AVATAR CORRIGIDA --- */}
      {/* Usamos flex-column para colocar o botão embaixo da imagem */}
      <div className="perfil-usuario__avatar-section " style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
        
        {/* Container da imagem (Circular) */}
        <div className="perfil-usuario__avatar" 
          style={{ 
                width: '150px', 
                height: '150px', 
                overflow: 'hidden', 
                borderRadius: '50%', 
                border: '2px solid #ccc',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f0f0f0'
            }}>
          <img 
            src={imagemExibida} 
            alt="Avatar do Usuário" 
            style={{ objectFit: 'cover', width: '100%', height: '100%' }} 
            onError={(e) => {
                e.target.onerror = null; 
                e.target.src = perfilusuarioIcon;
            }}
          />
        </div>

        {/* Botão movido para FORA do círculo da imagem */}
        {isEditing && (
            <div style={{ display: 'flex', justifyContent: 'center',   }}>
              <Button
                variant="outline"
                icon={<img src={importarfotoIcon} alt="Ícone de Câmera" style={{ width: '20px', height: '20px' }} />}
                onClick={handleTrocarFoto}
                size="small"
                children={"Trocar Foto"}
              />
            </div>
        )}
      </div>
      <div className="grupo-selects-grid-2-perfil">
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

        <Input
          label="E-mail"
          name="email"
          type="email"
          value={userData.email}
          onChange={handleChange('email')}
          required={true}
          readOnly={!isEditing || isLoading}
        />

        <Input
          label="Telefone"
          name="telefone"
          type="tel"
          placeholder="XX9XXXXXXXX"
          value={userData.telefone}
          onChange={handleChange('telefone')}
          readOnly={!isEditing || isLoading}
        />

        <Input
          label="Data de Nascimento"
          name="dataNascimento"
          type="date"
          value={userData.dataNascimento}
          onChange={handleChange('dataNascimento')}
          required={true}
          readOnly={!isEditing || isLoading}
        />

        <Input
          label="Gênero"
          name="genero"
          type="select"
          value={userData.genero} 
          onChange={handleChange('genero')}
          readOnly={!isEditing || isLoading}
          options={[
            { value: 'FEMININO', label: 'Feminino' },
            { value: 'MASCULINO', label: 'Masculino' },
            { value: 'OUTRO', label: 'Outro' },
            { value: 'NAO_INFORMAR', label: 'Prefiro não informar' },
          ]}
        />

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
        </div>
        
      </FormGeral>
    </div>
  );
};

export default PerfilUsuario;