import React from 'react';
import './DetalheVistoria.css'; // Vamos criar este CSS a seguir

const DetalheVistoria = ({ item }) => {
  return (
    // Este container ajuda a aplicar nosso CSS customizado
    <div className="detalhe-vistoria-info-custom">
      <p><strong>Lote da Muda:</strong> {item.Lote}</p>
      <p><strong>Data da inspeção:</strong> {item.DataVistoria}</p>
      <p><strong>Responsável:</strong> {item.Responsavel}</p>
      <p><strong>Estimativa de Mudas prontas:</strong> {item.EstimativaMudas}</p>
      <p><strong>Status:</strong> {item.Status}</p>
      <p><strong>Tratos Culturais:</strong> {item.TratosCulturais}</p>
      <p><strong>Pragas/Doenças:</strong> {item.PragasDoencas}</p>
      
      {/* Classe especial para o layout de "Observações" */}
      <p className="observacoes">
        <strong>Observações:</strong>
        <span>{item.Observacoes}</span>
      </p>
    </div>
  );
};

export default DetalheVistoria;