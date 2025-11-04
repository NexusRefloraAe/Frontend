import React from 'react';
import Button from '../Button/Button';
import './FormGeral.css';

const FormGeral = ({ 
  title,
  subtitle,
  children, 
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
        {/* O 'children' agora é renderizado aqui dentro */}
        <div className={`form-geral__campos ${useGrid ? 'form-geral__campos--grid' : ''}`}>
          {children}
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