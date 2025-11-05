import React from 'react';

const Historico = () => {
  const historico = [
    {
      id: 1,
      lote: 'A001',
      data: '20/05/2025',
      acao: 'Vistoria Cadastrada',
      usuario: 'Antônio Bezerra Santos'
    },
    {
      id: 2,
      lote: 'A001',
      data: '15/05/2025',
      acao: 'Vistoria Atualizada',
      usuario: 'Maria Silva'
    }
  ];

  return (
    <div className="historico-vistorias">
      <h2>Histórico de Vistorias</h2>
      
      <div className="historico-list">
        {historico.map((item) => (
          <div key={item.id} className="historico-item">
            <div className="historico-data">{item.data}</div>
            <div className="historico-info">
              <strong>{item.acao}</strong> - Lote: {item.lote}
            </div>
            <div className="historico-usuario">Por: {item.usuario}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Historico;