import React from 'react';
// import './DetalheVistoria.css'; // Se tiver CSS específico

const DetalhesTestes = ({ item }) => {
  return (
    <div className="detalhe-vistoria-info-custom">
      <p><strong>Lote:</strong> {item.lote}</p>
      
      {/* Ajustado para 'nomePopularSemente' */}
      <p><strong>Nome popular:</strong> {item.nomePopularSemente}</p>
      
      {/* O backend usa 'dataPlantio' como campo genérico de data */}
      <p><strong>Data do Teste:</strong> {item.dataPlantio}</p>
      
      {/* Ajustado para 'qtdSemente' */}
      <p><strong>Quantidade:</strong> {item.qtdSemente}</p>
      
      <p><strong>Unidade de Medida:</strong> {item.unidadeDeMedida}</p>
      
      {/* Ajustado para 'estahNaCamaraFria' (já vem como "Sim"/"Não" do back) */}
      <p><strong>Câmara Fria:</strong> {item.estahNaCamaraFria}</p>
      
      <p><strong>Data Germinação:</strong> {item.dataGerminacao}</p>
      
      {/* Ajustado para 'numSementesPlantadas' */}
      <p><strong>Qtd de Sementes Plantadas (em unidade):</strong> {item.numSementesPlantadas}</p>

      <p><strong>Qtd de sementes que Germinaram (em unidade):</strong> {item.numSementesGerminaram}</p>
      
      {/* Ajustado para 'taxaGerminacao' */}
      <p><strong>Taxa Germinou %:</strong> {item.taxaGerminacao}</p>
      
    </div>
  );
};

export default DetalhesTestes;