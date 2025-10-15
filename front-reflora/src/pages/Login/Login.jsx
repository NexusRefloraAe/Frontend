import React, { useState } from 'react';
import AuthLayout from '../../components/Layout/AuthLayout';
import AuthForm from '../../components/AuthForm/AuthForm';
import logoGoogle from '../../assets/logoGoogle.svg';
import olhoaberto from '../../assets/olhoaberto.svg';
import olhofechado from '../../assets/olhofechado.svg';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    console.log("Tentativa de login com:", formData);
  };

  const handleGoogleLogin = () => {
    console.log("Login com Google");
  };

  // Configuração específica do Login
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
        children: "Entrar"
      },
      {
        type: "button",
        variant: "secondary",
        icon: logoGoogle,
        onClick: handleGoogleLogin,
        children: "Continuar com a Google"
      }
    ],
    footer: {
      text: "Não tem uma Conta?",
      linkTo: "/cadastro",
      linkText: "Cadastre-se"
    },
    showSeparator: true,
    showForgotPassword: true,
    onSubmit: handleSubmit
  };

  return (
    <AuthLayout title={loginConfig.title} subtitle={loginConfig.subtitle}>
      <AuthForm {...loginConfig} />
    </AuthLayout>
  );
};

export default Login;