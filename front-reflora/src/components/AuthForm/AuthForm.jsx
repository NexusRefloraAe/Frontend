// src/components/AuthForm/AuthForm.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import FormsGeral from '../FormGeral/FormGeral';
import './AuthForm.css';

const AuthForm = ({
  title,
  subtitle,
  fields,
  actions,
  footer,
  error,
  onSubmit,
  loading = false,
  type = 'login' // 'login', 'register', 'forgot-password'
}) => {
  const getLayout = () => {
    switch (type) {
      case 'login':
      case 'forgot-password':
        return 'compact';
      case 'register':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div className="auth-form">
      <FormGeral
        title={title}
        subtitle={subtitle}
        fields={fields}
        actions={actions}
        onSubmit={onSubmit}
        loading={loading}
        layout={getLayout()}
        className={`auth-form--${type}`}
      />
      
      {error && (
        <div className="auth-form__error">
          {error}
        </div>
      )}

      {footer && (
        <div className="auth-form__footer">
          <p>
            {footer.text} <Link to={footer.linkTo}><strong>{footer.linkText}</strong></Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthForm;