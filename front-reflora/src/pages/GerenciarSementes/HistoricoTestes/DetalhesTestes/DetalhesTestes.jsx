import React from 'react';
// import './DetalheVistoria.css'; // Vamos criar este CSS a seguir

const DetalhesTestes = ({ item }) => {
  return (
    // Este container ajuda a aplicar nosso CSS customizado
    <div className="detalhe-vistoria-info-custom">
      <p><strong>Lote:</strong> {item.lote}</p>
      <p><strong>Nome popular:</strong> {item.nomePopular}</p>
      <p><strong>Data do Teste:</strong> {item.dataTeste}</p>
      <p><strong>Quantidade:</strong> {item.quantidade}</p>
      <p><strong>Câmara Fria:</strong> {item.camaraFria}</p>
      <p><strong>Data Germinação:</strong> {item.dataGerminacao}</p>
      <p><strong>Qntd Germinou(und):</strong> {item.qntdGerminou}</p>
      <p><strong>Taxa Germinou %:</strong> {item.taxaGerminou}</p>
      
    </div>
  );
};

export default DetalhesTestes;