import React, { useState } from 'react';
import AuthLayout from '../../components/Layout/AuthLayout';
import AuthForm from '../../components/AuthForm/AuthForm';
import olhoaberto from '../../assets/olhoaberto.svg';
import olhofechado from '../../assets/olhofechado.svg';

const Cadastro = () => {
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

  const handleSubmit = () => {
    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem!");
      return;
    }
    setError('');
    console.log("Dados do cadastro:", formData);
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
        placeholder: "(xx) 9 xxxx-xxxx",
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
          { value: "masculino", label: "Masculino" },
          { value: "feminino", label: "Feminino" },
          { value: "outro", label: "Outro" },
          { value: "nao-informar", label: "Prefiro não informar" }
        ]
      },
      {
        label: "Empresa (Opcional)",
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
        icon: mostrarConfirmarSenha ? olhofechado : olhoaberto,
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