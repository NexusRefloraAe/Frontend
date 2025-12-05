import React from 'react'
import NotificacaoItem from '../NotificacaoItem/NotificacaoItem'

import info from '../../assets/info.svg';
import zapoff from '../../assets/zapoff.png';

const notificacaoItems = [
    { id: 1, icone: info, titulo: 'É hora de agendar a vistoria do Canteiro 01.', mensagem: 'Lembre-se de voltar lá para garantir o bom desenvolvimento.' },
    { id: 2, icone: zapoff, titulo: 'O nível de estoque está baixo', mensagem: 'Lembre-se de repor os insumos para continuar o plantio.' },
    { id: 3, icone: info, titulo: 'Alerta de irrigação pendente', mensagem: 'O sistema detectou que o canteiro 03 não foi regado hoje.' },
    { id: 4, icone: info, titulo: 'Relatório semanal disponível', mensagem: 'Confira o desempenho das mudas na última semana.' },
]

const Notificacoes = () => {
    return (
        <div className='notifications-container'>
            <div className="title-notifications">
                <h2>Notificações de Alerta</h2>
                <span>Marcar como lido</span>
            </div>
            <div className="cards-notification">
                {notificacaoItems.map(item => (
                    <NotificacaoItem 
                        key={item.id} 
                        icone={item.icone}
                        titulo={item.titulo} 
                        mensagem={item.mensagem} />
                ))}
            </div>
        </div>
    );
}

export default Notificacoes
