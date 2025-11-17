import React from 'react';
//import './DetalheVistoria.css'; // Vamos criar este CSS a seguir

const DetalhesPlantio = ({ item }) => {
  return (
    // Este container ajuda a aplicar nosso CSS customizado
    <div className="detalhe-vistoria-info-custom">
      <p><strong>Lote:</strong> {item.lote}</p>
      <p><strong>Nome popular:</strong> {item.nomePopular}</p>
      <p><strong>Data de plantio:</strong> {item.dataPlantio}</p>
      <p><strong>Qtd. Sementes (kg/g/un):</strong> {item.qntdSementes}</p>
      <p><strong>Qtd. Plantada:</strong> {item.qntdPlantada}</p>
      <p><strong>Tipo de Plantio:</strong> {item.tipoPlantio}</p>
      
    </div>
  );
};

export default DetalhesPlantio;