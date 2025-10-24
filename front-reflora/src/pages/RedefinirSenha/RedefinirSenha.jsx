import React, { useState } from 'react';
import AuthLayout from '../../components/Layout/AuthLayout';
import AuthForm from '../../components/AuthForm/AuthForm';
import olhoaberto from '../../assets/olhoaberto.svg';
import olhofechado from '../../assets/olhofechado.svg';

const RedefinirSenha = () => {
  const [formData, setFormData] = useState({
    novaSenha: '',
    confirmarSenha: ''
  });
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    console.log("Formulário de redefinição enviado");
  };

  // Configuração específica da Redefinição de Senha
  const redefinirSenhaConfig = {
    title: "Redefinir Senha",
    subtitle: "Faça uma nova senha para acessar sua conta.",
    fields: [
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
        children: "Redefinir Senha"
      }
    ],
    footer: {
      text: "Lembrou sua senha?",
      linkTo: "/login",
      linkText: "Voltar para o Login"
    },
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