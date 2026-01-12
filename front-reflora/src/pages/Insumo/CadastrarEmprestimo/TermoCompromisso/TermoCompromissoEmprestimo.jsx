import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import insumoService from '../../../../services/insumoService';// 1. IMPORTAR O SERVIÇO
import './TermoCompromissoEmprestimo.css';

const TermoCompromissoEmprestimo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dadosTermo } = location.state || {};
  
  // Estado para controlar o botão e evitar cliques duplos
  const [loading, setLoading] = useState(false);

  if (!dadosTermo) return <div className="termo-wrapper"><p>Nenhum termo selecionado.</p></div>;

  const formatarDataBr = (data) => {
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const datasCalculadas = useMemo(() => {
    // Tenta usar a data que veio do form, senão usa hoje
    const dataBase = dadosTermo.dataRegistro ? new Date(dadosTermo.dataRegistro) : new Date();
    // Ajuste de fuso horário simples (opcional, dependendo de como o browser trata 'YYYY-MM-DD')
    // Se a data vier "2023-10-25", o new Date pode pegar o dia anterior devido ao fuso. 
    // Para garantir, vamos usar a dataBase como está.
    
    const dataDevolucao = new Date(dataBase);
    dataDevolucao.setDate(dataDevolucao.getDate() + 10);

    return {
      hojeExtenso: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
      dataRegistroFmt: formatarDataBr(dataBase),
      dataDevolucaoFmt: formatarDataBr(dataDevolucao)
    };
  }, [dadosTermo.dataRegistro]);

  const handleBack = () => {
    if (!loading && window.confirm("Tem certeza que deseja cancelar? Os dados não foram salvos.")) {
      navigate(-1);
    }
  };

  // --- NOVA FUNÇÃO: SALVAR E IMPRIMIR ---
  const handleConfirmarEImprimir = async () => {
    if (loading) return;

    // Validação de segurança
    if (!dadosTermo.insumoId) {
        alert("Erro: ID da ferramenta não encontrado. Volte e selecione novamente.");
        return;
    }

    try {
        setLoading(true);

        // 1. Montar o payload para o Backend
        // Mapeamos os nomes visuais do Termo para os nomes técnicos da API
        const payload = {
            insumoId: dadosTermo.insumoId, 
            nomeInsumo: dadosTermo.nomeMaterial,
            status: 'EMPRESTADO', // Define que é uma saída por empréstimo
            quantidade: Number(dadosTermo.quantidade),
            dataRegistro: dadosTermo.dataRegistro || new Date().toISOString().split('T')[0],
            responsavelEntrega: dadosTermo.responsavelEntrega,
            responsavelReceber: dadosTermo.responsavelReceber,
            observacao: 'Saída registrada via Termo de Compromisso'
        };

        // 2. Chamar o serviço para salvar no banco
        await insumoService.registrarMovimentacao(payload);

        // 3. Se deu certo, configurar o evento de pós-impressão
        const onPrintClosed = () => {
            window.removeEventListener('afterprint', onPrintClosed);
            // Redireciona para a lista principal após imprimir
            navigate('/insumo'); 
        };
        
        window.addEventListener('afterprint', onPrintClosed);

        // 4. Abrir a janela de impressão
        // O usuário verá o diálogo de impressão. Quando fechar (imprimindo ou cancelando), o 'afterprint' roda.
        window.print();

    } catch (error) {
        console.error("Erro ao salvar:", error);
        alert("Erro ao registrar a movimentação. O termo não será impresso.");
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
        
        {/* Botões - Não aparecem na impressão via CSS @media print */}
        <div className="termo-actions">
          <button className="btn-voltar" onClick={handleBack} disabled={loading}>
            ✖ Cancelar
          </button>
          
          <button 
            className="btn-export" 
            onClick={handleConfirmarEImprimir} 
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}
          >
            {loading ? 'Salvando...' : '🖨️ Confirmar e Imprimir'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default TermoCompromissoEmprestimo;