import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import insumoService from '../../../../services/insumoService';
import './TermoCompromissoEmprestimo.css';

const TermoCompromissoEmprestimo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dadosTermo } = location.state || {};
  const [loading, setLoading] = useState(false);

  if (!dadosTermo) return <div>Nenhum termo selecionado.</div>;

  const formatarDataBr = (data) => {
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Cálculos de datas e prazos
  const infoCalculada = useMemo(() => {
    const dataReg = new Date(dadosTermo.dataRegistro);
    // Usa a data de devolução escolhida no formulário
    const dataDev = new Date(dadosTermo.dataDevolucao);
    
    // Cálculo da diferença em dias (para mostrar no texto)
    const diffTime = Math.abs(dataDev - dataReg);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    return {
      hojeExtenso: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
      dataRegistroFmt: formatarDataBr(dataReg),
      dataDevolucaoFmt: formatarDataBr(dataDev),
      prazoDias: diffDays
    };
  }, [dadosTermo.dataRegistro, dadosTermo.dataDevolucao]);

  const handleConfirmarEImprimir = async () => {
    if (loading) return;
    try {
        setLoading(true);

        const payload = {
            insumoId: dadosTermo.insumoId, 
            nomeInsumo: dadosTermo.nomeMaterial,
            status: 'EMPRESTADO', 
            quantidade: Number(dadosTermo.quantidade),
            dataRegistro: dadosTermo.dataRegistro,
            
            // IMPORTANTE: O Model Java pede 'int dataDevolucao', então enviamos os DIAS
            dataDevolucao: infoCalculada.prazoDias, 
            
            responsavelEntrega: dadosTermo.responsavelEntrega,
            responsavelReceber: dadosTermo.responsavelReceber,
            observacao: 'Via Termo de Compromisso'
        };

        await insumoService.registrarMovimentacao(payload);

        const onPrintClosed = () => {
            window.removeEventListener('afterprint', onPrintClosed);
            navigate('/insumo'); 
        };
        window.addEventListener('afterprint', onPrintClosed);
        window.print();

    } catch (error) {
        console.error("Erro", error);
        alert("Erro ao salvar.");
    } finally {
        setLoading(false);
    }
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
              <p><strong>Data de Empréstimo:</strong><br /> {infoCalculada.dataRegistroFmt}</p>
              <p><strong>Prazo de Devolução:</strong><br /> 
                 <span style={{ color: '#d32f2f' }}>
                    {infoCalculada.dataDevolucaoFmt} ({infoCalculada.prazoDias} dias)
                 </span>
              </p>
            </div>
          </div>
        </div>

        <div className="termo-section declaracao">
          <p>Declaro que recebi a ferramenta, comprometendo-me a:</p>
          <ul>
            <li>Utilizá-lo conforme as normas;</li>
            <li>Devolvê-lo em perfeito estado;</li>
            <li>Comunicar perdas imediatamente;</li>
            <li><strong>Devolver até {infoCalculada.dataDevolucaoFmt};</strong></li>
          </ul>
        </div>

        <div className="data-extenso">
          <p>Araruna - PB, {infoCalculada.hojeExtenso}.</p>
        </div>

        <div className="signature-container">
          <div className="signature-block">
            <div className="signature-line"></div>
            <p className="signer-name">{dadosTermo.responsavelReceber}</p>
            <p className="signer-role">Responsável pela Retirada</p>
          </div>
          <div className="signature-block">
            <div className="signature-line"></div>
            <p className="signer-name">{dadosTermo.responsavelEntrega}</p>
            <p className="signer-role">Responsável pela Entrega</p>
          </div>
        </div>
        
        <div className="termo-actions">
           <button className="btn-voltar" onClick={() => navigate(-1)} disabled={loading}>✖ Cancelar</button>
           <button className="btn-export" onClick={handleConfirmarEImprimir} disabled={loading}>
             {loading ? 'Salvando...' : '🖨️ Confirmar e Imprimir'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default TermoCompromissoEmprestimo;