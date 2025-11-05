import React from 'react';

function PainelCard({ titulo, valor, icone }) {
    return (
        <div className="card">
            <p>{titulo}</p>
            <h1>{valor}</h1>
            <img src={icone} alt={titulo} />
        </div>
    );
}

export default PainelCard;