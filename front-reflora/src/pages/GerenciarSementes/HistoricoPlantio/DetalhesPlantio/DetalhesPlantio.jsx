import React from 'react';

const DetalhesPlantio = ({ item }) => {
  return (
    <div className="detalhe-vistoria-info-custom">
      <p><strong>Lote:</strong> {item.lote}</p>
      <p><strong>Nome popular:</strong> {item.nomePopularSemente}</p>
      <p><strong>Data de plantio:</strong> {item.dataPlantio}</p>
      <p><strong>Qtd. Sementes (kg/g/un):</strong> {item.qtdSemente}</p>
      <p><strong>Qtd. Plantada:</strong> {item.quantidadePlantada}</p>
      <p><strong>Tipo de Plantio:</strong> {item.tipoPlantioDescricao}</p>
      
    </div>
  );
};

export default DetalhesPlantio;