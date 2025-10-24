import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import Input from '../Input/Input';
import './AuthForm.css';

const AuthForm = ({
  fields,
  actions,
  footer,
  error,
  onSubmit,
  showSeparator = false,
  showForgotPassword = false,
  useGrid = false, // Nova prop para ativar o grid
  layout 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
  };

  const formClassName = `auth-form__fields ${
    layout === 'dense' ? 'auth-form__fields--dense' : ''
  }`;

  const renderFields = () => {
    if (useGrid) {
      return (
        <div className="auth-form__grid">
          {fields.map((field, index) => (
            <div 
              key={field.name || index} 
              className={field.span === 2 ? 'auth-form__grid-item--span-2' : ''}
            >
              <Input
                label={field.label}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={field.value}
                onChange={field.onChange}
                required={field.required}
                icon={field.icon}
                onIconClick={field.onIconClick}
                options={field.options}
              />
            </div>
          ))}
        </div>
      );
    }
    
    return fields.map((field, index) => (
      <Input
        key={field.name || index}
        label={field.label}
        type={field.type}
        name={field.name}
        placeholder={field.placeholder}
        value={field.value}
        onChange={field.onChange}
        required={field.required}
        icon={field.icon}
        onIconClick={field.onIconClick}
        options={field.options}
      />
    ));
  };

  return (
    <form onSubmit={handleSubmit} className={formClassName}>
      
      {renderFields()}

      {showForgotPassword && (
        <div className="auth-form__forgot-password">
          <p>
            Esqueceu a sua senha? <Link to="/redefinir-senha">
            <strong>Clique aqui</strong></Link>
          </p>
        </div>
      )}

      {error && <p className="auth-form__error">{error}</p>}

      <div className="auth-form__actions">
        {actions.map((action, index) => (
          <React.Fragment key={index}>
            <Button 
              type={action.type} 
              variant={action.variant}
              icon={action.icon}
              onClick={action.onClick}
            >
              {action.children}
            </Button>
            
            {showSeparator && index === 0 && actions.length > 1 && (
              <div className="auth-form__separator">Ou</div>
            )}
          </React.Fragment>
        ))}
      </div>

      {footer && (
        <footer className="auth-form__footer">
          <p>
            {footer.text} <Link to={footer.linkTo}><strong>{footer.linkText}</strong></Link>
          </p>
        </footer>
      )}
    </form>
  );
};

export default AuthForm;