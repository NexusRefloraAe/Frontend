import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/Layout/AuthLayout';
import AuthForm from '../../components/AuthForm/AuthForm';
import olhoaberto from '../../assets/olhoaberto.svg';
import olhofechado from '../../assets/olhofechado.svg';
import { authService } from '../../services/authService';
import { getBackendErrorMessage } from '../../utils/errorHandler';

const Cadastro = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nomeCompleto: '', email: '', celular: '', dataNascimento: '',
    genero: '', empresa: '', senha: '', confirmarSenha: ''
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    setError(''); // Limpa erros antigos

    // 1. Validação Visual (Frontend)
    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem!");
      return;
    }

    try {
      
      // 2. Chama o Serviço (Conecta com o Java)
      await authService.register(formData); 
      
      // 3. Sucesso: Feedback e Redirecionamento
      alert("Cadastro realizado com sucesso!");
      navigate('/login'); // Redireciona para o login

    } catch (err) {
      console.error(err);
      const mensagem = getBackendErrorMessage(err);
      // 4. Erro: Mostra a mensagem que veio do Backend (ex: "Email já existe")
      setError(mensagem); 
    }
  };

  const cadastroConfig = {
    title: "Cadastre-se", 
    subtitle: "É rápido e fácil.",
    fields: [
      {
        label: "Nome Completo",
        name: "nomeCompleto",
        placeholder: "Digite seu nome completo",
        value: formData.nomeCompleto,
        onChange: handleChange('nomeCompleto'),
        required: true,
        span: 2 
      },
      {
        label: "Email",
        name: "email",
        placeholder: "Digite seu email",
        value: formData.email,
        onChange: handleChange('email'),
        required: true
      },
      {
        label: "Número de celular",
        name: "celular",
        placeholder: "xx9xxxxxxxx",
        value: formData.celular,
        onChange: handleChange('celular'),
        required: true
      },
      {
        label: "Data de Nascimento",
        name: "dataNascimento",
        type: "date",
        value: formData.dataNascimento,
        onChange: handleChange('dataNascimento'),
        required: true
      },
      {
        label: "Gênero",
        name: "genero",
        type: "select",
        placeholder: "Selecione seu gênero",
        value: formData.genero,
        onChange: handleChange('genero'),
        required: true,
        options: [
          { value: "MASCULINO", label: "Masculino" },
          { value: "FEMININO", label: "Feminino" },
          { value: "OUTRO", label: "Outro" },
          { value: "NAO_INFORMAR", label: "Prefiro não informar" }
        ]
      },
      {
        label: "Empresa",
        name: "empresa",
        placeholder: "Digite o nome da empresa",
        value: formData.empresa,
        onChange: handleChange('empresa'),
        span: 2 
      },
      {
        label: "Defina uma senha",
        name: "senha",
        type: mostrarSenha ? 'text' : 'password',
        placeholder: "Mínimo 8 caracteres",
        value: formData.senha,
        onChange: handleChange('senha'),
        required: true,
        icon: mostrarSenha ? olhoaberto : olhofechado,
        onIconClick: () => setMostrarSenha(!mostrarSenha)
      },
      {
        label: "Confirme sua senha",
        name: "confirmarSenha",
        type: mostrarConfirmarSenha ? 'text' : 'password',
        placeholder: "Repita a senha",
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
        children: "Cadastrar"
      }
    ],
    footer: {
      text: "Já tem uma Conta?",
      linkTo: "/login",
      linkText: "Faça o login"
    },
    error: error,
    onSubmit: handleSubmit
  };

  return (
    <AuthLayout 
      title={cadastroConfig.title} 
      subtitle={cadastroConfig.subtitle}
    >
      <AuthForm 
        {...cadastroConfig} 
        layout="dense" 
        useGrid={true}
      />
    </AuthLayout>
  );
};

export default Cadastro;