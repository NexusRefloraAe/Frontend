import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input';
import insumoService from '../../../services/insumoService';
import { FaTools, FaBoxOpen, FaArrowLeft } from 'react-icons/fa';
import './RegistrarEmprestimo.css'; // Certifique-se que o CSS existe

const RegistrarSaidaEmprestimo = ({
  onSalvar,
  onCancelar
}) => {
  const hoje = new Date().toISOString().split('T')[0];
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [tipoSelecionado, setTipoSelecionado] = useState(null); 
  const [listaInsumos, setListaInsumos] = useState([]);
  const [sugestoes, setSugestoes] = useState([]); 
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    insumoId: '',
    nomeInsumo: '',
    status: '', 
    quantidade: '', 
    unidadeMedida: '',
    dataRegistro: hoje,
    responsavelEntrega: '',
    responsavelReceber: '',
    finalidade: ''
  });

  // --- CARREGAMENTO DE DADOS ---
  useEffect(() => {
    if (tipoSelecionado) {
      const carregarDados = async () => {
        try {
          setLoading(true);
          const dados = await insumoService.listarInsumos(tipoSelecionado);
          setListaInsumos(dados);
          
          setFormData(prev => ({
            ...prev,
            insumoId: '',
            nomeInsumo: '',
            // Define o status padrão baseado no tipo
            status: tipoSelecionado === 'MATERIAL' ? 'SAIDA' : 'EMPRESTADO',
            quantidade: '',
            unidadeMedida: '',
            finalidade: ''
          }));
        } catch (error) {
          console.error("Erro ao carregar lista:", error);
          alert("Erro ao buscar itens do estoque.");
        } finally {
          setLoading(false);
        }
      };
      carregarDados();
    }
  }, [tipoSelecionado]);

  // --- HANDLERS DE FORMULÁRIO ---
  const handleNomeChange = (e) => {
    const valor = e.target.value;
    setFormData(prev => ({ ...prev, nomeInsumo: valor, insumoId: '' }));

    if (valor.length > 0) {
      const filtrados = listaInsumos.filter(item => 
        item.nome.toLowerCase().includes(valor.toLowerCase())
      );
      setSugestoes(filtrados);
    } else {
      setSugestoes([]);
    }
  };

  const selecionarItem = (item) => {
    setFormData(prev => ({
      ...prev,
      insumoId: item.id,
      nomeInsumo: item.nome,
      unidadeMedida: item.unidadeMedida || 'Unidade'
    }));
    setSugestoes([]);
  };

  const handleBlurNome = () => setTimeout(() => setSugestoes([]), 200);

  const handleChange = (field) => (e) => {
    const value = e.target.value; 
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuantidadeInc = () => {
    setFormData(prev => {
        const val = parseFloat(prev.quantidade) || 0;
        return { ...prev, quantidade: (val + 1).toString() };
    });
  };

  const handleQuantidadeDec = () => {
    setFormData(prev => {
        const val = parseFloat(prev.quantidade) || 0;
        return { ...prev, quantidade: Math.max(0, val - 1).toString() };
    });
  };

  // --- AÇÃO 1: GERAR TERMO (Apenas Navegação) ---
  const gerarTermo = () => {
    if (!formData.insumoId) return alert('Selecione um item da lista.');
    
    let qtdNumerica = parseFloat(formData.quantidade.toString().replace(',', '.'));
    if (!qtdNumerica || qtdNumerica <= 0) return alert('Informe uma quantidade válida.');

    if (!formData.dataRegistro) return alert('Por favor, preencha a Data do Registro.');
    if (!formData.responsavelEntrega) return alert('Por favor, preencha o Responsável pela Entrega.');
    if (!formData.responsavelReceber) return alert('Por favor, preencha o Responsável por Receber.');

    const dadosTermo = {
      insumoId: formData.insumoId, // ID é crucial para salvar na próxima tela
      nomeResponsavel: formData.responsavelReceber,
      cargoResponsavel: formData.responsavelEntrega,
      nomeMaterial: formData.nomeInsumo,
      quantidade: qtdNumerica,
      unidade: formData.unidadeMedida,
      dataRegistro: formData.dataRegistro,
      responsavelEntrega: formData.responsavelEntrega,
      responsavelReceber: formData.responsavelReceber
    };

    navigate('/termo-compromisso-emprestimo', { state: { dadosTermo } });
  };

  // --- AÇÃO 2: SUBMIT DIRETO (Salvar no Banco) ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.insumoId) return alert('Selecione um item da lista.');
    
    let qtdNumerica = parseFloat(formData.quantidade.toString().replace(',', '.'));

    if (!qtdNumerica || isNaN(qtdNumerica) || qtdNumerica <= 0) {
        return alert('Informe uma quantidade válida maior que zero.');
    }
    
    // Validação de Estoque (Não valida se for Devolução, pois estoque vai aumentar)
    const itemSelecionado = listaInsumos.find(i => i.id === formData.insumoId);
    if (itemSelecionado && formData.status !== 'DEVOLVIDO') { 
        if (qtdNumerica > itemSelecionado.quantidadeAtual) {
            return alert(`Estoque insuficiente! Disponível: ${itemSelecionado.quantidadeAtual} ${itemSelecionado.unidadeMedida}`);
        }
    }

    try {
      setLoading(true);
      const payload = {
        insumoId: formData.insumoId,
        nomeInsumo: formData.nomeInsumo,
        status: formData.status, 
        quantidade: qtdNumerica, 
        dataRegistro: formData.dataRegistro,
        responsavelEntrega: formData.responsavelEntrega,
        responsavelReceber: formData.responsavelReceber,
        observacao: formData.finalidade 
      };

      await insumoService.registrarMovimentacao(payload);
      
      alert("Movimentação registrada com sucesso!");
      
      if (onSalvar) onSalvar();
      
      // Limpa o formulário
      setFormData(prev => ({ 
          ...prev, 
          insumoId: '', nomeInsumo: '', quantidade: '', finalidade: '' 
      }));

    } catch (error) {
      console.error(error);
      alert("Erro ao registrar movimentação.");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERIZAÇÃO DA TELA DE SELEÇÃO ---
  if (!tipoSelecionado) {
      return (
          <div className="selecao-tipo-container" style={{ padding: '20px', textAlign: 'center' }}>
              <h2>O que você deseja registrar?</h2>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
                  <button 
                    onClick={() => setTipoSelecionado('MATERIAL')}
                    className="btn-escolha"
                    style={{ padding: '30px', cursor: 'pointer', borderRadius: '8px', border: '1px solid #ccc', background: 'white' }}
                  >
                      <FaBoxOpen size={40} color="#2e7d32" />
                      <h3 style={{ marginTop: '10px' }}>Saída de Material</h3>
                      <p style={{ color: '#666', fontSize: '0.9em' }}>Consumo (Adubo, Terra, Sementes...)</p>
                  </button>

                  <button 
                    onClick={() => setTipoSelecionado('FERRAMENTA')}
                    className="btn-escolha"
                    style={{ padding: '30px', cursor: 'pointer', borderRadius: '8px', border: '1px solid #ccc', background: 'white' }}
                  >
                      <FaTools size={40} color="#e65100" />
                      <h3 style={{ marginTop: '10px' }}>Movimentação Ferramenta</h3>
                      <p style={{ color: '#666', fontSize: '0.9em' }}>Empréstimos e Devoluções</p>
                  </button>
              </div>
              
              {onCancelar && (
                  <button onClick={onCancelar} style={{ marginTop: '30px', background: 'transparent', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
                      Cancelar
                  </button>
              )}
          </div>
      );
  }

  // --- VARIÁVEIS DO FORMULÁRIO ---
  const tituloForm = tipoSelecionado === 'MATERIAL' ? "Registrar Saída de Material" : "Movimentação de Ferramenta";
  const labelQuantidade = tipoSelecionado === 'MATERIAL' ? "Quantidade Utilizada" : (formData.status === 'EMPRESTADO' ? "Qtd a Retirar" : "Qtd a Devolver");

  // --- CONFIGURAÇÃO DOS BOTÕES (ACTIONS) ---
  const actions = [
    { 
      type: 'button', 
      variant: 'action-secondary',
      children: 'Cancelar', 
      onClick: () => setTipoSelecionado(null),
      disabled: loading,
      icon: <FaArrowLeft />
    },
    
    // REGRA: Botão "Gerar Termo" APENAS se for Ferramenta + Empréstimo
    ...(tipoSelecionado === 'FERRAMENTA' && formData.status === 'EMPRESTADO' ? [{ 
      type: 'button', 
      variant: 'primary', 
      children: loading ? 'Gerando...' : 'Gerar Termo', 
      onClick: gerarTermo,
      disabled: loading 
    }] : []),

    // REGRA: Botão "Confirmar" se for Material OU Ferramenta + Devolução
    ...((tipoSelecionado === 'MATERIAL' || (tipoSelecionado === 'FERRAMENTA' && formData.status === 'DEVOLVIDO')) ? [{ 
      type: 'submit', 
      variant: 'primary', 
      children: loading ? 'Salvando...' : 'Confirmar Registro',
      disabled: loading 
    }] : [])
  ];

  return (
    <div className="cadastrar-emprestimo">
      <FormGeral title={tituloForm} actions={actions} onSubmit={handleSubmit} useGrid={false}>
        <div className="input-row">
            <div style={{ position: 'relative', flex: 1 }}>
                <Input
                    label={tipoSelecionado === 'MATERIAL' ? "Qual material saiu?" : "Qual ferramenta?"}
                    name="nomeInsumo"
                    type="text"
                    value={formData.nomeInsumo}
                    onChange={handleNomeChange}
                    onBlur={handleBlurNome}
                    required
                    placeholder="Digite para buscar..."
                    autoComplete="off"
                />
                {sugestoes.length > 0 && (
                    <ul className="autocomplete-list">
                        {sugestoes.map((f) => (
                            <li key={f.id} onClick={() => selecionarItem(f)}>
                                <strong>{f.nome}</strong>
                                <span>Disp: {f.quantidadeAtual} {f.unidadeMedida}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* SELETOR DE STATUS PARA FERRAMENTA */}
            {tipoSelecionado === 'FERRAMENTA' ? (
                 <Input
                    label="Tipo de Ação"
                    name="status"
                    type="select"
                    value={formData.status}
                    onChange={handleChange('status')}
                    required
                    options={[
                        { value: 'EMPRESTADO', label: 'Emprestar (Saída)' },
                        { value: 'DEVOLVIDO', label: 'Devolver (Entrada)' },
                    ]}
                />
            ) : (
                <Input
                    label="Tipo de Ação"
                    name="status"
                    type="text"
                    value="SAÍDA (Consumo)"
                    readOnly
                    className="input-readonly"
                />
            )}
        </div>

        <div className="input-row">
            <Input
                label={labelQuantidade}
                name="quantidade"
                type="number"
                value={formData.quantidade}
                onChange={handleChange('quantidade')}
                onIncrement={handleQuantidadeInc}
                onDecrement={handleQuantidadeDec}
                required
                min="0"
                step="0.01" 
                placeholder="0.00"
            />
             <Input
                label="Unidade de medida"
                name="unidadeMedida"
                type="text"
                value={formData.unidadeMedida}
                readOnly
            />
        </div>

        {tipoSelecionado === 'MATERIAL' && (
             <div className="input-row">
                <Input
                    label="Finalidade / Uso"
                    name="finalidade"
                    type="text"
                    value={formData.finalidade}
                    onChange={handleChange('finalidade')}
                    placeholder="Ex: Adubação do canteiro"
                    required
                />
             </div>
        )}

        <div className="input-row">
            <Input label="Data de Registro" name="dataRegistro" type="date" value={formData.dataRegistro} onChange={handleChange('dataRegistro')} required />
        </div>

        <div className="input-row">
            <Input
                label={tipoSelecionado === 'MATERIAL' ? "Responsável Almoxarifado" : "Responsável pela Entrega"}
                name="responsavelEntrega"
                type="text"
                value={formData.responsavelEntrega}
                onChange={handleChange('responsavelEntrega')}
                required
            />
            <Input
                label={tipoSelecionado === 'MATERIAL' ? "Quem Retirou?" : "Responsável por Receber"}
                name="responsavelReceber"
                type="text"
                value={formData.responsavelReceber}
                onChange={handleChange('responsavelReceber')}
                required
            />
        </div>
      </FormGeral>
    </div>
  );
};

export default RegistrarSaidaEmprestimo;