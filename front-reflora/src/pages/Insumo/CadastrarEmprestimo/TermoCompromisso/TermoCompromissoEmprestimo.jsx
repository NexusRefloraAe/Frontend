import React, { useEffect } from 'react'; // Importe useEffect se for usar listeners, mas aqui faremos direto na função
import { useLocation, useNavigate } from 'react-router-dom';
import './TermoCompromissoEmprestimo.css';

const TermoCompromissoEmprestimo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dadosTermo } = location.state || {};

  if (!dadosTermo) return <p>Nenhum termo disponível.</p>;

  const handleBack = () => {
    navigate('/registrar-emprestimo');
  };

  const handleExport = () => {
    // 1. Configura o que deve acontecer DEPOIS que a janela de impressão fechar
    window.onafterprint = () => {
      // Limpa o evento para garantir que não execute duas vezes sem querer
      window.onafterprint = null;

      // Navega imediatamente para a tela de relatório
      navigate('/insumo/relatorio-materiais', {
        state: { 
          // Se quiser passar dados para o relatório, eles vão aqui
          termoConfirmado: {
            id: new Date().getTime(),
            nomeMaterial: dadosTermo.nomeMaterial,
            quantidade: dadosTermo.quantidade,
            unidade: dadosTermo.unidade,
            dataRegistro: dadosTermo.dataRegistro,
            responsavelRetirada: dadosTermo.nomeResponsavel,
            responsavelEntrega: dadosTermo.cargoResponsavel,
          } 
        },
      });
    };

    // 2. Abre a janela de impressão (Isso trava a tela até o usuário salvar/fechar)
    window.print();
  };

  return (
    <div className="termo-wrapper">
      <div className="termo-container termo-compromisso">
        <h1>Termo de Compromisso</h1>

        <div className="termo-section">
          <p><strong>Material / Ferramenta:</strong> {dadosTermo.nomeMaterial}</p>
          <p><strong>Quantidade:</strong> {dadosTermo.quantidade} {dadosTermo.unidade}</p>
          {/* Removi Finalidade e Prazo conforme seu pedido anterior */}
          <p><strong>Data do Empréstimo:</strong> {dadosTermo.dataRegistro}</p>
        </div>

        <div className="termo-section">
          <p>
            Declaro que recebi o material/ferramenta acima, comprometendo-me a:
          </p>
          <p>1. Utilizá-lo conforme as normas estabelecidas;</p>
          <p>2. Devolvê-lo em perfeito estado de conservação;</p>
          <p>3. Arcar com os custos de reparo em caso de danos;</p>
          <p>4. Não ceder ou transferir a terceiros sem autorização;</p>
          <p>5. Comunicar qualquer dano, perda ou extravio imediatamente.</p>
        </div>

        {/* Área de Assinatura */}
        <div className="signature">
          <div className="signature-block">
            <p className="signer-name">{dadosTermo.nomeResponsavel}</p>
            <div className="signature-line"></div>
            <p className="signer-role">Responsável Retirada</p>
          </div>
          <div className="signature-block">
            <p className="signer-name">{dadosTermo.cargoResponsavel}</p>
            <div className="signature-line"></div>
            <p className="signer-role">Responsável Entrega</p>
          </div>
        </div>

        {/* Botões */}
        <div className="termo-actions">
          <button className="btn-voltar" onClick={handleBack}>
            Voltar
          </button>
          
          {/* Botão que aciona a lógica */}
          <button className="btn-export" onClick={handleExport}>
            Exportar / Imprimir e Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermoCompromissoEmprestimo;