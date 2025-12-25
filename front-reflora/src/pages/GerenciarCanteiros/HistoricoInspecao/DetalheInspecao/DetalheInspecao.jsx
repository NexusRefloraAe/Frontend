import React from 'react';
import './DetalheInspecao.css'; // Vamos criar este CSS a seguir

const DetalheInspecao = ({ item }) => {
  return (
    // Este container ajuda a aplicar nosso CSS customizado
    <div className="detalhe-inpecao-info-custom">
      <p><strong>Lote da Muda:</strong> {item.loteMuda}</p>
      <p><strong>Nome da Muda</strong> {item.nomePopular}</p>
      <p><strong>Local</strong> {item.nomeCanteiro}</p>
      <p><strong>Data da inspeção:</strong> {item.dataInspecao}</p>
      <p><strong>Responsável:</strong> {item.nomeResponsavel}</p>
      <p><strong>Estimativa de Mudas prontas:</strong> {item.estimativaMudasProntas}</p>
      <p><strong>Status:</strong> {item.estadoSaude}</p>
      <p><strong>Tratos Culturais:</strong> {item.tratosCulturais}</p>
      <p><strong>Pragas/Doenças:</strong> {item.doencasPragas}</p>
      
      {/* Classe especial para o layout de "Observações" */}
      <p className="observacoes">
        <strong>Observações:</strong>
        <span>{item.observacao}</span>
      </p>
    </div>
  );
};

export default DetalheInspecao;