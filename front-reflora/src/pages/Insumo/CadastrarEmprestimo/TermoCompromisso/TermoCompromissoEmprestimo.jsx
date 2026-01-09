import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './TermoCompromissoEmprestimo.css';

const TermoCompromissoEmprestimo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dadosTermo } = location.state || {};

  if (!dadosTermo) return <div className="termo-wrapper"><p>Nenhum termo selecionado.</p></div>;

  const formatarDataBr = (data) => {
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const datasCalculadas = useMemo(() => {
    const dataInicial = new Date();
    const dataDevolucao = new Date(dataInicial);
    dataDevolucao.setDate(dataDevolucao.getDate() + 10);

    return {
      hojeExtenso: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
      dataRegistroFmt: formatarDataBr(dataInicial),
      dataDevolucaoFmt: formatarDataBr(dataDevolucao)
    };
  }, [dadosTermo.dataRegistro]);

  const handleBack = () => {
    if (window.confirm("Tem certeza que deseja cancelar? Os dados não salvos serão perdidos.")) {
      navigate('/registrar-emprestimo');
    }
  };

  const handleExport = () => {
    const onPrintClosed = () => {
      window.removeEventListener('afterprint', onPrintClosed);
      navigate('/insumo');
    };
    window.addEventListener('afterprint', onPrintClosed);
    window.print();
  };

  return (
    <div className="termo-wrapper">
      <div className="termo-container">

        <header className="termo-header">
          <h1>Termo de Empréstimo</h1>
          <p className="sub-header">Comprovante de Responsabilidade</p>
        </header>

        <div className="termo-section">
          <div className="termo-dados-grid">
            <div>
              <p><strong>Ferramenta:</strong><br /> {dadosTermo.nomeMaterial}</p>
              <p><strong>Quantidade:</strong><br /> {dadosTermo.quantidade} {dadosTermo.unidade}</p>
            </div>
            <div>
              <p><strong>Data de Empréstimo:</strong><br /> {datasCalculadas.dataRegistroFmt}</p>
              <p><strong>Prazo de Devolução:</strong><br /> <span style={{ color: '#d32f2f' }}>{datasCalculadas.dataDevolucaoFmt} (10 dias)</span></p>
            </div>
          </div>
        </div>

        <div className="termo-section declaracao">
          <p>Declaro que recebi a ferramenta descrito acima, comprometendo-me a:</p>
          <ul>
            <li>Utilizá-lo conforme as normas estabelecidas;</li>
            <li>Devolvê-lo em perfeito estado de conservação;</li>
            <li>Arcar com os custos de reparo em caso de danos por mau uso;</li>
            <li>Não ceder ou transferir a terceiros sem autorização prévia;</li>
            <li>Comunicar qualquer dano, perda ou extravio imediatamente.</li>
            <li><strong>Devolver o item até a data limite ({datasCalculadas.dataDevolucaoFmt});</strong></li>
          </ul>
        </div>

        <div className="data-extenso">
          <p>João Pessoa - PB, {datasCalculadas.hojeExtenso}.</p>
        </div>

        {/* Seção de Assinaturas */}
        <div className="signature-container">
          <div className="signature-block">
            <div className="signature-line"></div>
            <p className="signer-name">{dadosTermo.responsavelReceber || "JOSÉ"}</p>
            <p className="signer-role">Responsável pela Retirada</p>
          </div>

          <div className="signature-block">
            <div className="signature-line"></div>
            <p className="signer-name">{dadosTermo.responsavelEntrega || "MARCELO"}</p>
            <p className="signer-role">Responsável pela Entrega</p>
          </div>
        </div>
        

        <div className="termo-actions">
          <button className="btn-voltar" onClick={handleBack}>
            ✖ Cancelar
          </button>
          <button className="btn-export" onClick={handleExport}>
            🖨️ Confirmar e Imprimir
          </button>
        </div>

      </div>
    </div>
  );
};

export default TermoCompromissoEmprestimo;