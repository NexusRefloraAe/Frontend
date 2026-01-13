import React, { useState } from 'react';
import AuthLayout from '../../components/Layout/AuthLayout';
import AuthForm from '../../components/AuthForm/AuthForm';
import olhoaberto from '../../assets/olhoaberto.svg';
import olhofechado from '../../assets/olhofechado.svg';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { getBackendErrorMessage } from '../../utils/errorHandler';

const RedefinirSenha = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identificador: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [error, setError] = useState('');

  // NOVO: Estado para controlar o carregamento
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    setError('');

    // Validações Básicas
    if (formData.novaSenha !== formData.confirmarSenha) {
      setError("As senhas não coincidem!");
      return;
    }
    if (!formData.identificador) {
      setError("Por favor, informe seu email, usuário ou celular.");
      return;
    }

    // NOVO: Ativa o carregamento
    setIsLoading(true);

    try {
      // 2. Lógica de Detecção do Tipo de Identificador
      const valor = formData.identificador;
      const payload = {
        novaSenha: formData.novaSenha,
        confirmarNovaSenha: formData.confirmarSenha
      };

      const isEmail = /\S+@\S+\.\S+/.test(valor);
      const looksLikePhone = /^\d{2}9\d{8}$/.test(valor);

      if (isEmail) {
        payload.email = valor;
      } else if (looksLikePhone) {
        payload.numeroCelular = valor; 
      } else {
        payload.nomeUsuario = valor;
      }

      // 3. Chamada ao serviço
      await authService.changePassword(payload);
      
      alert("Senha alterada com sucesso!");
      navigate('/login');

    } catch (err) {
      console.error(err);
      const mensagem = getBackendErrorMessage(err);
      setError(mensagem || "Erro ao redefinir senha.");
    } finally {
      // NOVO: Desativa o carregamento (sempre executa)
      setIsLoading(false);
    }
  };

  const redefinirSenhaConfig = {
    title: "Redefinir Senha",
    subtitle: "Faça uma nova senha para acessar sua conta.",
    fields: [
      {
        label: "Nome Completo, Email ou número de celular",
        name: "identificador",
        type: "text",
        placeholder: "Digite seu nome completo, email ou número de celular",
        value: formData.identificador,
        onChange: handleChange('identificador'),
        required: true,
        span: 2 
      },
      {
        label: "Nova Senha",
        type: mostrarNovaSenha ? 'text' : 'password',
        name: "novaSenha",
        placeholder: "Digite sua nova senha",
        value: formData.novaSenha,
        onChange: handleChange('novaSenha'),
        required: true,
        icon: mostrarNovaSenha ? olhoaberto : olhofechado,
        onIconClick: () => setMostrarNovaSenha(!mostrarNovaSenha)
      },
      {
        label: "Confirme a nova senha",
        type: mostrarConfirmarSenha ? 'text' : 'password',
        name: "confirmarSenha",
        placeholder: "Digite novamente sua nova senha",
        value: formData.confirmarSenha,
        onChange: handleChange('confirmarSenha'),
        required: true,
        icon: mostrarConfirmarSenha ? olhoaberto : olhofechado,
        onIconClick: () => setMostrarConfirmarSenha(!mostrarConfirmarSenha)
      }
    ],
    actions: [
      {
        type: "submit",
        variant: "primary",
        // NOVO: Feedback visual no botão
        children: isLoading ? "Redefinindo..." : "Redefinir Senha",
        disabled: isLoading
      }
    ],
    footer: {
      text: "Lembrou sua senha?",
      linkTo: "/login",
      linkText: "Voltar para o Login"
    },
    error: error,
    onSubmit: handleSubmit
  };

  return (
    <AuthLayout 
      title={redefinirSenhaConfig.title} 
      subtitle={redefinirSenhaConfig.subtitle}
    >
      <AuthForm {...redefinirSenhaConfig} />
    </AuthLayout>
  );
};

export default RedefinirSenha;