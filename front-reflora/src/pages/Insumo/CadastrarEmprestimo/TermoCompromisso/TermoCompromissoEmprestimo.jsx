import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './TermoCompromissoEmprestimo.css';

const TermoCompromissoEmprestimo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dadosTermo } = location.state || {};

  if (!dadosTermo) return <p>Nenhum termo disponível.</p>;

  const handleExport = () => {
    window.print();

    const novaDistribuicao = {
      id: new Date().getTime(),
      nomeMaterial: dadosTermo.nomeMaterial,
      quantidade: dadosTermo.quantidade,
      unidade: dadosTermo.unidade,
      finalidade: dadosTermo.finalidade,
      dataRegistro: dadosTermo.dataRegistro,
      responsavelRetirada: dadosTermo.nomeResponsavel,
      responsavelEntrega: dadosTermo.cargoResponsavel,
    };

    setTimeout(() => {
      if (window.confirm("Deseja confirmar o termo e ir para o relatório?")) {
        navigate('/relatorio-termo', {
          state: { termoConfirmado: novaDistribuicao },
        });
      }
    }, 500);
  };

  return (
    <div className="termo-wrapper">
      <div className="termo-container termo-compromisso">
        <h1>Termo de Compromisso</h1>

        <div className="termo-section">
          <p><strong>Material / Ferramenta:</strong> {dadosTermo.nomeMaterial}</p>
          <p><strong>Quantidade:</strong> {dadosTermo.quantidade} {dadosTermo.unidade}</p>
          <p><strong>Finalidade / Uso:</strong> {dadosTermo.finalidade}</p>
          <p><strong>Data:</strong> {dadosTermo.dataRegistro}</p>
        </div>

        <div className="termo-section">
          <p>
            Declaro que recebi o material/ferramenta acima, comprometendo-me a utilizá-lo conforme as normas e devolvê-lo em perfeito estado, se for o caso de empréstimo.
          </p>
        </div>

        <div className="signature">
          <div>
            <p>{dadosTermo.nomeResponsavel}</p>
            <div className="signature-line"></div>
            <p>Responsável Retirada</p>
          </div>
          <div>
            <p>{dadosTermo.cargoResponsavel}</p>
            <div className="signature-line"></div>
            <p>Responsável Entrega</p>
          </div>
        </div>

        <button className="btn-export" onClick={handleExport}>
          Exportar / Imprimir Termo
        </button>
      </div>
    </div>
  );
};

export default TermoCompromissoEmprestimo;
