import React from 'react';
import './Login.css';

import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Banner from '../../components/Banner/Banner'; 
import logoGoogle from '../../assets/logoGoogle.svg';

const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de login aqui
  };

  return (
    <div className="login-container">
     
      <aside className="login-banner">
        <Banner />
      </aside>

      {/* Banner para mobile */}
      <div className="login-banner-mobile">
        <Banner />
      </div>

      <main className="login-form-wrapper">
        <form className="login-form" onSubmit={handleSubmit}>
          <header className="login-form__header">
            <h1>Faça Login</h1>
            <p>Acesse sua conta para continuar</p>
          </header>

          <div className="login-form__fields">
            <Input
              label="Nome, Email ou telefone do usuário"
              type="text"
              name="username"
              placeholder="Digite seu nome, email ou telefone de usuário"
              required
            />
            <Input
              label="Senha"
              type="password"
              name="password"
              placeholder="Digite sua senha"
              required
            />
          </div>
          <footer className="login-form__forgot-password">
            <p>
              Esqueceu a sua senha? <a href="#"><strong>Clique aqui</strong></a>
            </p>
          </footer>

          <div className="login-form__actions">
            <Button type="submit" variant="primary">
              Entrar
            </Button>
            
            <div className="separator">Ou</div>

            <Button type="button" variant="secondary" icon={logoGoogle}>
              Continuar com a Google
            </Button>
          </div>

          <footer className="login-form__footer">
            <p>
              Não tem uma Conta? <a href="#"><strong>Cadastre-se</strong></a>
            </p>
          </footer>
        </form>
      </main>

    </div>
  );
};

export default Login;