import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './TermoCompromissoEmprestimo.css';

const TermoCompromissoEmprestimo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dadosTermo } = location.state || {};

  // Caso não tenha dados, exibe mensagem simples
  if (!dadosTermo) return <div className="termo-wrapper"><p>Nenhum termo selecionado.</p></div>;

  // --- Lógica de Datas ---
  
  // 1. Função auxiliar para formatar Date -> dd/mm/aaaa
  const formatarDataBr = (data) => {
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // 2. Processamento das datas (useMemo evita recálculo desnecessário)
  const datasCalculadas = useMemo(() => {
    // Tenta criar uma data a partir do registro (aceita Date object ou string ISO/BR se formatada)
    // Assumindo que dadosTermo.dataRegistro venha como string ou Date válido
    const dataInicial = new Date(); // Fallback para hoje
    
    // Calcula prazo de devolução (10 dias)
    const dataDevolucao = new Date(dataInicial);
    dataDevolucao.setDate(dataDevolucao.getDate() + 10);

    return {
      hojeExtenso: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
      dataRegistroFmt: formatarDataBr(dataInicial),
      dataDevolucaoFmt: formatarDataBr(dataDevolucao)
    };
  }, [dadosTermo.dataRegistro]);


  // --- Ações ---

  const handleBack = () => {
    if(window.confirm("Tem certeza que deseja cancelar? Os dados não salvos serão perdidos.")) {
        navigate('/registrar-emprestimo');
    }
  };

  const handleExport = () => {
    // Escuta o evento "afterprint" para redirecionar após fechar a janela de impressão
    const onPrintClosed = () => {
       // Limpa o listener para não acumular
       window.removeEventListener('afterprint', onPrintClosed);
       
       // Confirmação final opcional ou redirecionamento direto
       navigate('/insumo'); 
    };

    window.addEventListener('afterprint', onPrintClosed);
    window.print();
  };

  return (
    <div className="termo-wrapper">
      <div className="termo-container termo-compromisso">
        
        {/* Cabeçalho */}
        <header className="termo-header">
            <h1>Termo de Empréstimo</h1>
            <p className="sub-header">Comprovante de Responsabilidade</p>
        </header>

        {/* Dados do Empréstimo */}
        <div className="termo-section">
          {/* Grid para organizar melhor visualmente */}
          <div className="termo-dados-grid">
              <div>
                  <p><strong>Ferramenta:</strong><br/> {dadosTermo.nomeMaterial}</p>
                  <p><strong>Quantidade:</strong><br/> {dadosTermo.quantidade} {dadosTermo.unidade}</p>
              </div>
              <div>
                  <p><strong>Data de Empréstimo:</strong><br/> {datasCalculadas.dataRegistroFmt}</p>
                  <p><strong>Prazo de Devolução:</strong><br/> <span style={{color: '#d32f2f'}}>{datasCalculadas.dataDevolucaoFmt} (10 dias)</span></p>
              </div>
          </div>
          
        </div>

        {/* Declaração */}
        <div className="termo-section declaracao">
          <p>
          Declaro que recebi a ferramenta descrito acima, comprometendo-me a:
          </p>
          <ul>
            <li>Utilizá-lo conforme as normas estabelecidas;</li>
            <li>Devolvê-lo em perfeito estado de conservação;</li>
            <li>Arcar com os custos de reparo em caso de danos por mau uso;</li>
            <li>Não ceder ou transferir a terceiros sem autorização prévia;</li>
            <li>Comunicar qualquer dano, perda ou extravio imediatamente.</li>
            <li><strong>Devolver o item até a data limite ({datasCalculadas.dataDevolucaoFmt});</strong></li>
          </ul>
        </div>

        {/* Local e Data */}
        <div className="data-extenso">
            <p>João Pessoa - PB, {datasCalculadas.hojeExtenso}.</p>
        </div>

        {/* Assinaturas */}
        <div className="signature">
          <div className="signature-block">
            <div className="signature-line"></div>
            <p className="signer-name">{dadosTermo.nomeResponsavel || "Nome do Solicitante"}</p>
            <p className="signer-role">Responsável pela Retirada</p>
          </div>
          
          <div className="signature-block">
            <div className="signature-line"></div>
            <p className="signer-name">{dadosTermo.cargoResponsavel || "Gestor do Almoxarifado"}</p>
            <p className="signer-role">Responsável pela Entrega</p>
          </div>
        </div>

        {/* Rodapé Sistema */}
        <div className="system-footer">
            <p>Documento gerado pelo Sistema Reflora_aê | ID: {new Date().getTime()}</p>
        </div>

        {/* Botões de Ação */}
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