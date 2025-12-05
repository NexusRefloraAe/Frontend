import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { usuarioService } from '../../services/usuarioService';
import FormGeral from '../FormGeral/FormGeral';
import Button from '../Button/Button';
import Input from '../Input/Input'; 
import perfilusuarioIcon from '../../assets/perfilusuario.svg';
import botaoEditarIcon from '../../assets/botaoeditar.svg';
import botaoSalvarIcon from '../../assets/botaosalvar.svg';
import botaoExcluirIcon from '../../assets/botaoexcluir.svg';
import importarfotoIcon from '../../assets/importarfoto.svg';
import './PerfilUsuario.css';

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

        // --- CORREÇÃO DA URL DA FOTO (Docker -> Localhost) ---
        // 1. Pega a URL bruta vinda do backend (agora mapeada como fotoUsuario)
        let rawUrl = data.fotoUsuario?.url || data.fotoUsuarioResponseDTO?.url || data.fotoUrl || null;

        // 2. Corrige o hostname se for interno do Docker
        if (rawUrl) {
            // Se a URL contiver o nome do container (ex: reflora-minio), troca por localhost
            // Ajuste 'reflora-minio' para o nome exato que aparece no seu erro se for diferente
            if (rawUrl.includes("reflora-minio")) {
                rawUrl = rawUrl.replace("reflora-minio", "localhost");
            } else if (rawUrl.includes("minio")) { // Fallback genérico
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
            fotoUrl: rawUrl // Usa a URL corrigida
        });

      } catch (error) {
        console.error("Erro ao carregar perfil", error);
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
      console.error('Erro ao salvar:', error);
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
        
        // 1. Limpa o LocalStorage
        authService.logout(); 
        
        // 2. FORÇA um recarregamento total da página para matar qualquer 
        // requisição pendente ou interceptor em loop.
        // Ao invés de navigate('/login'), use:
        window.location.href = '/login'; 

      } catch (error) {
        console.error('Erro ao excluir:', error);
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
      
  const imagemExibida = fotoPreview || userData.fotoUrl || perfilusuarioIcon;

  return (
    <div className="perfil-usuario">
      <div className="perfil-usuario__avatar-section">
        <div className="perfil-usuario__avatar">
          <img 
            src={imagemExibida} 
            alt="Avatar do Usuário" 
            style={{ objectFit: 'cover' }} 
            onError={(e) => {
                // Fallback caso a URL ainda falhe
                e.target.onerror = null; 
                e.target.src = perfilusuarioIcon;
            }}
          />
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
        actions={actionsConfig}
        onSubmit={handleSave}
        useGrid={true}
        loading={isLoading}
        layout="wide"
      >
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
          placeholder="(XX) 9 XXXX-XXXX"
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
        
      </FormGeral>
    </div>
  );
};

export default PerfilUsuario;