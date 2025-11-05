import React from 'react';

function NotificacaoItem({ icone, titulo, mensagem }) {
    return (
        <div className="card-notification">
            <img src={icone} alt="Ícone de notificação" />
            <div className="info-text">
                <h4>{titulo}</h4>
                <span>{mensagem}</span>
            </div>
        </div>
    );
}

export default NotificacaoItem;