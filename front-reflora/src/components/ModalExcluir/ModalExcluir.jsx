import React from 'react';
import Button from '../Button/Button';
import './ModalExcluir.css';

const ModalExcluir = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  titulo = "Confirmar Exclusão",
  mensagem = "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.",
  textoConfirmar = "Excluir",
  textoCancelar = "Cancelar",
  nomeItem 
}) => {
  if (!isOpen) return null;

  const mensagemFinal = nomeItem 
    ? mensagem.replace('xxxxxxx', nomeItem)
    : mensagem;

  return (
    <div className="modal-excluir-overlay" onClick={onClose}>
      <div className="modal-excluir-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-excluir-header">
          <h2 className="modal-excluir-titulo">{titulo}</h2>
        </div>
        
        <div className="modal-excluir-body">
          <p className="modal-excluir-mensagem">{mensagemFinal}</p>
        </div>
        
        <div className="modal-excluir-actions">
          <Button 
            variant="action-secondary" 
            onClick={onClose}
            type="button"
          >
            {textoCancelar}
          </Button>
          <Button 
            variant="danger" 
            onClick={onConfirm}
            type="button"
          >
            {textoConfirmar}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalExcluir;