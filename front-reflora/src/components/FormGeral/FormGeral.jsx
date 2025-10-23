// src/components/FormGeral/FormGeral.jsx
import React from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import './FormGeral.css';

const FormGeral = ({ 
  title, 
  fields = [], 
  actions = [], 
  onSubmit, 
  useGrid = false 
}) => {
  return (
    <div className="form-geral">
      {title && <h2 className="form-geral__titulo">{title}</h2>}

      <form onSubmit={onSubmit} className="form-geral__conteudo">
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
                options={field.options}
                icon={field.icon}
                onIconClick={field.onIconClick}
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