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
      
      {/* Ajustado para 'estahNaCamaraFria' (já vem como "Sim"/"Não" do back) */}
      <p><strong>Câmara Fria:</strong> {item.estahNaCamaraFria}</p>
      
      <p><strong>Data Germinação:</strong> {item.dataGerminacao}</p>
      
      {/* Ajustado para 'qtdGerminou' (sem 'n' no meio) */}
      <p><strong>Qntd Germinou(und):</strong> {item.qtdGerminou}</p>
      
      {/* Ajustado para 'taxaGerminacao' */}
      <p><strong>Taxa Germinou %:</strong> {item.taxaGerminacao}</p>
      
    </div>
  );
};

export default DetalhesTestes;