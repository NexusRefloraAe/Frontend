import React from 'react';
//import './DetalheVistoria.css'; // Vamos criar este CSS a seguir

const DetalhesMaterial = ({ item }) => {
    return (
        // Este container ajuda a aplicar nosso CSS customizado
        <div className="detalhe-vistoria-info-custom">
            <p><strong>Nome do Insumo:</strong> {item.NomeInsumo}</p>
            <p><strong>Data de Registro:</strong> {item.Data}</p>
            <p><strong>Status:</strong> {item.Status}</p>
            <p><strong>Quantidade:</strong> {item.quantidade}</p>
            <p><strong>Unidade de Medida:</strong> {item.UnidadeMedida}</p>
            <p><strong>Responsável pela Entrega:</strong> {item.ResponsavelEntrega}</p>
            <p><strong>Responsável pelo Recebimento:</strong> {item.ResponsavelRecebe}</p>
        </div>
    );
};

export default DetalhesMaterial;