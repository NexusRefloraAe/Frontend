import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/Layout/AuthLayout';
import AuthForm from '../../components/AuthForm/AuthForm';
import { FcGoogle } from 'react-icons/fc';
import olhoaberto from '../../assets/olhoaberto.svg';
import olhofechado from '../../assets/olhofechado.svg';
import { authService } from '../../services/authService';
import { getBackendErrorMessage } from '../../utils/errorHandler';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [error, setError] = useState('');

  // NOVO: Estado para controlar o carregamento
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async () => {
    setError(''); // Limpa erros anteriores

    // NOVO: Ativa o carregamento
    setIsLoading(true);

    try {
      // Chama o método login do authService
      await authService.login(formData.username, formData.password);
      
      // Se não der erro, redireciona para a home
      navigate('/home');
    } catch (err) {
      console.error(err);
      const mensagem = getBackendErrorMessage(err);
      setError(mensagem);
    } finally {
      // NOVO: Desativa o carregamento (independente de sucesso ou erro)
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Navegando para /home...");
    navigate('/home'); 
  };

  const loginConfig = {
    title: "Faça Login",
    subtitle: "Acesse sua conta para continuar",
    fields: [
      {
        label: "Nome, Email ou telefone do usuário",
        type: "text",
        name: "username",
        placeholder: "Digite seu nome, email ou telefone de usuário",
        value: formData.username,
        onChange: handleChange('username'),
        required: true
      },
      {
        label: "Senha",
        type: mostrarSenha ? 'text' : 'password',
        name: "password",
        placeholder: "Digite sua senha",
        value: formData.password,
        onChange: handleChange('password'),
        required: true,
        icon: mostrarSenha ? olhoaberto : olhofechado,
        onIconClick: () => setMostrarSenha(!mostrarSenha)
      }
    ],
    actions: [
      {
        type: "submit",
        variant: "primary",
        // NOVO: Altera o texto e desabilita o botão durante o carregamento
        children: isLoading ? "Entrando..." : "Entrar",
        disabled: isLoading
      },
      {
        type: "button",
        variant: "secondary",
        icon: <FcGoogle />,
        onClick: handleGoogleLogin,
        children: "Continuar com a Google",
        // Opcional: Desabilitar o botão do Google enquanto faz login normal também
        disabled: isLoading 
      }
    ],
    footer: {
      text: "Não tem uma Conta?",
      linkTo: "/cadastro",
      linkText: "Cadastre-se"
    },
    showSeparator: true,
    showForgotPassword: true,
    onSubmit: handleSubmit,
    error: error
  };

  return (
    <AuthLayout title={loginConfig.title} subtitle={loginConfig.subtitle}>
      <AuthForm {...loginConfig} />
    </AuthLayout>
  );
};

export default Login;