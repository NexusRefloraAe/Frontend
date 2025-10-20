import React from 'react';
import Banner from '../Banner/Banner';
import '../../styles/Auth-layout.css';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-container">
      {/* Banner Lateral (Desktop/Tablet) */}
      <aside className="auth-banner">
        <Banner />
      </aside>

      {/* Banner Mobile (Topo) */}
      <div className="auth-banner-mobile">
        <Banner />
      </div>

      {/* Área do Formulário */}
      <main className="auth-form-wrapper">
        <div className="auth-form">
          <header className="auth-form__header">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </header>
          
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;