import React from 'react';

import './Banner.css';
import nomeReflora from '../../assets/nome_reflora.svg';
import fundoReflora from '../../assets/FundoReflora.svg';

const Banner = () => {
    return (
        <div className="banner-container">
            <img
                src={fundoReflora}
                alt="Fundo decorativo com formas de folhas e plantas"
                className="banner-background"
            />

            <img
                src={nomeReflora}
                alt="Logo do Reflora"
                className="banner-logo"
            />
        </div>
    );
};

export default Banner;