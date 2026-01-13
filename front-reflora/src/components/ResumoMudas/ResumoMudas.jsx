import React from 'react';
import './ResumoMudas.css';

/**
 * Componente para exibir um resumo de mudas selecionadas.
 * @param {Object[]} mudas - Array de objetos de mudas.
 * @param {string} mudas[].nome - O nome/espécie da muda.
 * @param {number} mudas[].quantidade - A quantidade daquela muda.
 */
const ResumoMudas = ({ mudas }) => {
  
  // Calcula o total de mudas automaticamente a partir do array
  const totalMudas = mudas.reduce((acc, muda) => acc + muda.quantidade, 0);

  // Formata números para ter o ponto de milhar (ex: 11.000)
  const formatarNumero = (num) => {
    return num.toLocaleString('pt-BR');
  };

  return (
    <div className="resumo-mudas-box">
      <h4>Mudas Selecionadas</h4>
      <ul>
        {mudas.map((muda) => (
          <li key={muda.nome}>
            {muda.nome}: {formatarNumero(muda.quantidade)}
          </li>
        ))}
      </ul>
      <p>
        <strong>Total de mudas: {formatarNumero(totalMudas)}</strong>
      </p>
    </div>
  );
};

export default ResumoMudas;