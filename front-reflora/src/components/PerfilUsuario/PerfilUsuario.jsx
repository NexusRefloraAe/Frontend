import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { usuarioService } from '../../services/usuarioService';
import FormGeral from '../FormGeral/FormGeral';
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
    nomeCompleto: '', email: '', telefone: '',
    dataNascimento: '', genero: '', empresa: '',
    endereco: '', fotoUrl: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = authService.getCurrentUser();
        if (!user || !user.id) { navigate('/login'); return; }
        setCurrentUser(user);

        const data = await usuarioService.getUsuario(user.id);

        // Tratamento de data para input type="date"
        let dataNascFormatada = '';
        if (data.dataNascimento) {
          if (data.dataNascimento.includes('T') || data.dataNascimento.includes(' ')) {
            dataNascFormatada = data.dataNascimento.substring(0, 10);
          } else if (data.dataNascimento.includes('/')) {
            const parts = data.dataNascimento.split('/');
            if (parts.length === 3) dataNascFormatada = `${parts[2]}-${parts[1]}-${parts[0]}`;
          } else { dataNascFormatada = data.dataNascimento; }
        }

        let rawUrl = data.fotoUsuario?.url || data.fotoUsuarioResponseDTO?.url || data.fotoUrl || null;
        if (rawUrl) {
          rawUrl = rawUrl.replace(/reflora-minio|minio/g, "localhost");
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
        console.error("Erro ao carregar perfil", getBackendErrorMessage(error));
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
      alert('Ocorreu um erro ao salvar as alterações.');
    } finally { setIsLoading(false); }
  };

  const handleCancel = () => {
    setIsEditing(false);
    window.location.reload();
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta?')) {
      try {
        await usuarioService.deleteUsuario(currentUser.id);
        authService.logout();
        window.location.href = '/login';
      } catch (error) { alert('Erro ao excluir conta.'); }
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
        children: isLoading ? 'Salvando...' : 'Salvar Cadastro',
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

  return (
    <div className="perfil-compact-container">
      <FormGeral
        title={isEditing ? 'Editar Perfil' : 'Gerencie suas informações pessoais'}
        actions={actionsConfig}
        onSubmit={handleSave}
        useGrid={false}
        loading={isLoading}
        layout="wide"
      >
        <div className="perfil-form-wrapper">
          {/* Lado Esquerdo: Foto */}
          <div className="perfil-side-photo">
            <div className="avatar-mini-wrapper">
              <img
                src={fotoPreview || userData.fotoUrl || perfilusuarioIcon}
                alt="Avatar"
                onError={(e) => { e.target.src = perfilusuarioIcon; }}
              />
              {isEditing && (
                <button type="button" className="btn-upload-overlay" onClick={handleTrocarFoto}>
                  <img src={importarfotoIcon} alt="Trocar" />
                </button>
              )}
            </div>
          </div>

          {/* Lado Direito: Campos */}
          <div className="perfil-fields-grid">
            <div className="field-full-row">
              <Input
                label="Nome Completo"
                value={userData.nomeCompleto}
                onChange={handleChange('nomeCompleto')}
                readOnly={!isEditing || isLoading}
              />
            </div>

            <Input
              label="E-mail"
              value={userData.email}
              onChange={handleChange('email')}
              readOnly={!isEditing || isLoading}
            />

            <Input
              label="Telefone"
              value={userData.telefone}
              onChange={handleChange('telefone')}
              readOnly={!isEditing || isLoading}
            />

            <Input
              label="Data de Nascimento"
              type="date"
              value={userData.dataNascimento}
              onChange={handleChange('dataNascimento')}
              readOnly={!isEditing || isLoading}
            />

            <Input
              label="Gênero"
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

            <div className="field-full-row">
              <Input
                label="Empresa"
                value={userData.empresa}
                onChange={handleChange('empresa')}
                readOnly={!isEditing || isLoading}
              />
            </div>

            <div className="field-full-row">
              <Input
                label="Endereço"
                value={userData.endereco}
                onChange={handleChange('endereco')}
                readOnly={!isEditing || isLoading}
              />
            </div>
          </div>
        </div>
      </FormGeral>
    </div>
  );
}

export default PerfilUsuario;