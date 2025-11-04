// src/pages/Vistorias/Listar/Listar.jsx
import React, { useState } from 'react';
import './Listar.css';

const Listar = () => {
  const [vistorias] = useState([
    {
      id: 1,
      lote: 'A001',
      dataInspecao: '20/05/2025',
      estadoSaude: 'Boa',
      responsavel: 'Antônio Bezerra Santos',
      estimativaMudas: 700
    },
    {
      id: 2,
      lote: 'B002',
      dataInspecao: '18/05/2025',
      estadoSaude: 'Excelente',
      responsavel: 'Maria Silva',
      estimativaMudas: 850
    }
  ]);

  return (
    <div className="listar-vistorias">
      <h2>Lista de Vistorias</h2>
      
      <div className="vistorias-table-container">
        <table className="vistorias-table">
          <thead>
            <tr>
              <th>Lote</th>
              <th>Data da Inspeção</th>
              <th>Estado de Saúde</th>
              <th>Responsável</th>
              <th>Estimativa de Mudas</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vistorias.map((vistoria) => (
              <tr key={vistoria.id}>
                <td>{vistoria.lote}</td>
                <td>{vistoria.dataInspecao}</td>
                <td>{vistoria.estadoSaude}</td>
                <td>{vistoria.responsavel}</td>
                <td>{vistoria.estimativaMudas}</td>
                <td>
                  <button className="btn-editar">Editar</button>
                  <button className="btn-excluir">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Listar;