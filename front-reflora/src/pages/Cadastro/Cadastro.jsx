import React from 'react';
import './Cadastro.css';

import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Banner from '../../components/Banner/Banner';

const Cadastro = () => {
  const handleSubmit = (e) => {
    e.preventDefault();

  };

  return (
    <div className="cadastro-container">
      <aside className="cadastro-banner">
        <Banner />
      </aside>

      <main className="cadastro-form-wrapper">
        <form className="cadastro-form" onSubmit={handleSubmit}>
          <header className="cadastro-form__header">
            <h1>Cadastro</h1>
          </header>

          <div className="cadastro-form__fields">
            {/* 1. Nome Completo */}
            <Input
              label="Nome Completo"
              type="text"
              name="nomeCompleto"
              placeholder="Digite seu nome completo"
              required
            />
            {/* 2. Email */}
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="Digite seu email"
              required
            />
            {/* 3. Número de celular */}
            <Input
              label="Número de celular"
              type="tel"
              name="celular"
              placeholder="(xx) 9 xxxx-xxxx"
              required
            />

            {/* 4. Data de Nascimento e Gênero */}
            <div className="cadastro-form__row">
              {/* Data de Nascimento  */}
              <Input
                label="Data de Nascimento"
                type="date"
                name="dataNascimento"
                placeholder="dd/mm/aaaa"
                required
              />

              {/* Gênero */}
              <div className="input-container">
                <label htmlFor="genero">Gênero</label>
                <select
                  id="genero"
                  name="genero"
                  className="input-field"
                  required
                >
                  <option value="" disabled selected>Gênero</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="Prefiro não responder">Prefiro não responder</option>
                </select>
              </div>
            </div>

            {/* 5. Empresa */}
            <Input
              label="Empresa"
              type="text"
              name="empresa"
              placeholder="Digite o nome da empresa"
            />

            {/* 6. Senha */}
            <Input
              label="Defina uma senha"
              type="password"
              name="senha"
              placeholder="*************"
              required
            />
            {/* 7. Confirme sua senha */}
            <Input
              label="Confirme sua senha"
              type="password"
              name="confirmarSenha"
              placeholder="*************"
              required
            />
          </div>

          <div className="cadastro-form__actions">
            <Button type="submit" variant="primary">
              Cadastrar
            </Button>
          </div>

          <footer className="cadastro-form__footer">
            <p>
              Já tem uma Conta? <a href="#"><strong>Faça o login</strong></a>
            </p>
          </footer>
        </form>
      </main>

    </div>
  );
};

export default Cadastro;