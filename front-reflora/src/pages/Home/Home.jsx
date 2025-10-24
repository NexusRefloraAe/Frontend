import React from 'react';
import './Home.css';
import card1 from '../../assets/card1.png';
import card2 from '../../assets/card2.png';
import card3 from '../../assets/card3.svg';
import info from '../../assets/info.svg';
import zapoff from '../../assets/off.svg';

function Home() {
  return (
    <div className="home-container">
      {/* Container para os Cards - SEM BORDA */}
      <div className="content-painel">
        <div className="title-content">
          <h2>Painel</h2>
        </div>

        <div className="cards">
          <div className="card">
            <p>Total Sementes (kg)</p>
            <h1>200.000</h1>
            <img src={card1} alt="Sementes" />
          </div>
          <div className="card">
            <p>Total Canteiros</p>
            <h1>150</h1>
            <img src={card2} alt="Canteiros" />
          </div>
          <div className="card">
            <p>Total Mudas</p>
            <h1>150.000</h1>
            <img src={card3} alt="Mudas" />
          </div>
        </div>
      </div>

      {/* Container para as Notificações - APENAS UM FUNDO */}
      <div className="notifications-container">
        <div className="title-notifications">
          <h2>Notificações de Alerta</h2>
          <span>Marcar como lido</span>
        </div>
        <div className="cards-notification">
          <div className="card-notification">
            <img src={info} alt="Info" />
            <div className="info-text">
              <h4>É hora de agendar a vistoria do Canteiro 01.</h4>
              <span>Lembre-se de voltar lá para garantir o bom desenvolvimento.</span>
            </div>
          </div>
          <div className="card-notification">
            <img src={zapoff} alt="Estoque baixo" />
            <div className="info-text">
              <h4>O nível de estoque está baixo</h4>
              <span>Lembre-se de repor os insumos para continuar o plantio.</span>
            </div>
          </div>
          <div className="card-notification">
            <img src={info} alt="Info" />
            <div className="info-text">
              <h4>Alerta de irrigação pendente</h4>
              <span>O sistema detectou que o canteiro 03 não foi regado hoje.</span>
            </div>
          </div>
          <div className="card-notification">
            <img src={info} alt="Info" />
            <div className="info-text">
              <h4>Relatório semanal disponível</h4>
              <span>Confira o desempenho das mudas na última semana.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;