import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/Layout/AuthLayout';
import AuthForm from '../../components/AuthForm/AuthForm';
import logoGoogle from '../../assets/logoGoogle.svg';
import olhoaberto from '../../assets/olhoaberto.svg';
import olhofechado from '../../assets/olhofechado.svg';
import { authService } from '../../services/authService';

const Login = () => {
  const navigate = useNavigate(); // INICIALIZAR O HOOK

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Limpa o erro assim que o usuário começa a digitar novamente
    if (error) setError('');
  };

  const handleSubmit = async () => {
    setError(''); // Limpa erros anteriores

    try {
      // Chama o método login do authService (que conecta com /api/auth/login)
      await authService.login(formData.username, formData.password);
      
      // Se não der erro (cair no catch), o login foi sucesso e o token está salvo
      // Redireciona para a home
      navigate('/home');
    } catch (err) {
      console.error(err);
      // Define a mensagem de erro para aparecer no formulário
      setError(err.message || "Erro ao conectar com o servidor.");
    }
  };


  // ALTERAR A FUNÇÃO PARA NAVEGAR
  const handleGoogleLogin = () => {
    console.log("Navegando para /home...");
    navigate('/home'); // <-- AQUI ACONTECE A MÁGICA
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
        onClick: handleGoogleLogin, // A função agora redireciona a página
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