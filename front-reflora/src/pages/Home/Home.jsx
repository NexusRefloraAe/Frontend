import React from 'react'
import '../Home/Home.css'
import card1 from '../../assets/card1.png'
import card2 from '../../assets/card2.png'
import card3 from '../../assets/card3.svg'


function Home() {
  return (
    <div className='container'>
      <div className="navbar">
        <h1>Reflora_aê</h1>
        <div className="options">
          <ul>
            <li>Banco de Sementes</li>
            <li>Gerenciador de Sementes</li>
            <li>Gerenciar Canteiro</li>
            <li>Vistorias</li>
            <li>Gestão de Insumos</li>
            <li>Relatórios</li>
            <li>Configuração</li>
            <li>Sair</li>
          </ul>
        </div>
      </div>
      <div className="content">
        <div className="title-menu">
          <h1>Menu Inicial</h1>
        </div>
        <div className="content-menu">
          <div className="title-content">
            <h2>Painel</h2>
          </div>
          <div className="cards">
            <div className="card1">
              <p>Total Sementes (kg)</p>
              <h1>200.000</h1>
              <img src={card1} alt="card1" />
            </div>
            <div className="card2">
              <p>Total Canteiros</p>
              <h1>150</h1>
              <img src={card2} alt="card2" />
            </div>
            <div className="card3">
              <p>Total Mudas</p>
              <h1>150.000</h1>
              <img src={card3} alt="card3" />
            </div>
          </div>
          <div className="notifications">
            <div className="title-notifications">
              <h2>Notificações de Alerta</h2>
              <span>Marcar como lido</span>
            </div>
            <div className="cards-notification">
              <div className="card-notification">
                <h3>É hora de agendar a vistoria do Canteiro 01.</h3>
                <span>Lembre-se de voltar lá para garantir o bom desenvolvimento.</span>
              </div>
              <div className="card-notification">
                <h3>O nivel de estoque está baixo</h3>
                <span>Lembre-se de voltar lá para garantir o bom desenvolvimento.</span>
              </div>
              <div className="card-notification">
                <h3>xxxxxxxxxxxxx</h3>
                <span>Lembre-se de voltar lá para garantir o bom desenvolvimento.</span>
              </div>
              <div className="card-notification">
                <h3>xxxxxxxxxxxxx</h3>
                <span>Lembre-se de voltar lá para garantir o bom desenvolvimento.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
