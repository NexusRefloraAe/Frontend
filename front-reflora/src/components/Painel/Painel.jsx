import React from 'react'
import PainelCard from '../PainelCard/PainelCard'

import card1 from '../../assets/card1.png';
import card2 from '../../assets/card2.png';
import card3 from '../../assets/card3.svg';

const painelItems = [
    { id: 1, titulo: 'Total Sementes (kg)', valor: '200.000', icone: card1 },
    { id: 2, titulo: 'Total Canteiros', valor: '150', icone: card2 },
    { id: 3, titulo: 'Total Mudas', valor: '150.000', icone: card3 },
];

function Painel() {
  return (
    <div className='content-painel'>
      <div className="title-content">
        <h2>Painel</h2>
      </div>
      <div className="cards">
        {painelItems.map(item => (
            <PainelCard 
                key={item.id} 
                titulo={item.titulo} 
                valor={item.valor} 
                icone={item.icone} />
        ))}
      </div>
    </div>
  );
}

export default Painel
