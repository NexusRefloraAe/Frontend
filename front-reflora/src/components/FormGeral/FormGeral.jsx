// src/components/FormGeral/FormGeral.jsx
import React from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import './FormGeral.css';

const FormGeral = ({ 
  title,
  subtitle,
  fields = [], 
  actions = [], 
  onSubmit, 
  useGrid = false,
  loading = false,
  className = '',
  layout = 'default'
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit && !loading) {
      onSubmit(e);
    }
  };

  return (
    <div className={`form-geral form-geral--${layout} ${className}`.trim()}>
      {(title || subtitle) && (
        <div className="form-geral__header">
          {title && <h2 className="form-geral__titulo">{title}</h2>}
          {subtitle && <p className="form-geral__subtitulo">{subtitle}</p>}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-geral__form">
        <div className={`form-geral__campos ${useGrid ? 'form-geral__campos--grid' : ''}`}>
          {fields.map((field, index) => (
            <div
              key={field.name || index}
              className={`form-geral__campo ${
                useGrid && field.span === 2 ? 'form-geral__campo--span-2' : ''
              }`}
            >
              <Input
                label={field.label}
                type={field.type || 'text'}
                name={field.name}
                placeholder={field.placeholder}
                value={field.value}
                onChange={field.onChange}
                required={field.required}
                readOnly={field.readOnly}
                disabled={field.disabled || loading}
                options={field.options}
                icon={field.icon}
                onIconClick={field.onIconClick}
                error={field.error}
              />
            </div>
          ))}
        </div>

        {actions.length > 0 && (
          <div className="form-geral__acoes">
            {actions.map((action, idx) => (
              <Button
                key={idx}
                type={action.type || 'button'}
                variant={action.variant}
                icon={action.icon}
                onClick={action.onClick}
                disabled={action.disabled || loading}
              >
                {action.children}
              </Button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default FormGeral;