import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input';
import insumoService from '../../../services/insumoService';
import { FaTools, FaBoxOpen, FaArrowLeft } from 'react-icons/fa';
import './CadastrarEmprestimo.css';

const RegistrarSaidaEmprestimo = ({ onSalvar, onCancelar }) => {
  const hoje = new Date().toISOString().split('T')[0];
  const navigate = useNavigate();

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

  // Carregar insumos quando tipo mudar
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
            status: tipoSelecionado === 'MATERIAL' ? 'SAIDA' : 'EMPRESTADO',
            quantidade: '',
            unidadeMedida: '',
            finalidade: ''
          }));
        } catch (error) {
          console.error(error);
          alert("Erro ao buscar itens do estoque.");
        } finally {
          setLoading(false);
        }
      };
      carregarDados();
    }
  }, [tipoSelecionado]);

  // Handlers
  const handleNomeChange = e => {
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

  const selecionarItem = item => {
    setFormData(prev => ({
      ...prev,
      insumoId: item.id,
      nomeInsumo: item.nome,
      unidadeMedida: item.unidadeMedida || 'Unidade'
    }));
    setSugestoes([]);
  };

  const handleBlurNome = () => setTimeout(() => setSugestoes([]), 200);

  const handleChange = field => e => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
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

  // --- Função de gerar termo ---
  const gerarTermo = () => {
    if (!formData.insumoId) return alert('Selecione um item da lista.');
    let qtdNumerica = parseFloat(formData.quantidade.toString().replace(',', '.'));
    if (!qtdNumerica || qtdNumerica <= 0) return alert('Informe uma quantidade válida.');

    const dadosTermo = {
      nomeResponsavel: formData.responsavelReceber,
      cargoResponsavel: formData.responsavelEntrega,
      nomeMaterial: formData.nomeInsumo,
      quantidade: qtdNumerica,
      unidade: formData.unidadeMedida,
      finalidade: formData.finalidade,
      dataRegistro: formData.dataRegistro
    };

    // Navega para a tela do termo, passando dados pelo state
    navigate('/termo-compromisso-emprestimo', { state: { dadosTermo } });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.insumoId) return alert('Selecione um item da lista.');
    let qtdNumerica = parseFloat(formData.quantidade.toString().replace(',', '.'));
    if (!qtdNumerica || qtdNumerica <= 0) return alert('Informe uma quantidade válida.');

    const itemSelecionado = listaInsumos.find(i => i.id === formData.insumoId);
    if (itemSelecionado && formData.status !== 'DEVOLVIDO') {
      if (qtdNumerica > itemSelecionado.quantidadeAtual) {
        return alert(`Estoque insuficiente! Disponível: ${itemSelecionado.quantidadeAtual} ${itemSelecionado.unidadeMedida}`);
      }
    }

    try {
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

      setFormData(prev => ({ ...prev, insumoId: '', nomeInsumo: '', quantidade: '', finalidade: '' }));
    } catch (error) {
      console.error(error);
      alert("Erro ao registrar movimentação.");
    }
  };

  // TELA 1: SELEÇÃO DE TIPO
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

  // TELA 2: FORMULÁRIO
  const tituloForm = tipoSelecionado === 'MATERIAL' ? "Registrar Saída de Material" : "Movimentação de Ferramenta";
  const labelQuantidade = tipoSelecionado === 'MATERIAL' ? "Quantidade Utilizada" : (formData.status === 'EMPRESTADO' ? "Qtd a Retirar" : "Qtd a Devolver");

  
  const actions = [
    { type: 'button', variant: 'action-secondary', children: 'Voltar', onClick: () => setTipoSelecionado(null), icon: <FaArrowLeft /> },
    { type: 'button', variant: 'primary', children: 'Gerar Termo', onClick: gerarTermo },
    { type: 'submit', variant: 'success', children: 'Confirmar Registro' }
  ];

  return (
    <div className="cadastrar-emprestimo">
      <FormGeral
        title={tituloForm}
        actions={actions}
        onSubmit={handleSubmit}
        useGrid={false}
      >
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
                    placeholder="Digite para buscar no estoque..."
                    autoComplete="off"
                />
                
                {sugestoes.length > 0 && (
                    <ul className="autocomplete-lista" style={{
                        position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000,
                        backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px',
                        maxHeight: '200px', overflowY: 'auto', listStyle: 'none', padding: 0, margin: 0
                    }}>
                        {sugestoes.map((f) => (
                            <li key={f.id} onClick={() => selecionarItem(f)} 
                                style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                            >
                                <strong>{f.nome}</strong>
                                <span style={{ fontSize: '0.85em', color: f.quantidadeAtual > 0 ? 'green' : 'red', backgroundColor: '#eef', padding: '2px 6px', borderRadius: '4px' }}>
                                    Disp: {f.quantidadeAtual} {f.unidadeMedida}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

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
                    label="Tipo de Movimento"
                    name="status"
                    type="text"
                    value="SAÍDA (Consumo)"
                    readOnly
                />
            )}
        </div>

        <div className="input-row">
            {/* CORREÇÃO AQUI: Step e Min */}
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
                step="0.01" // Permite decimais
                placeholder="0.00"
            />
             <Input
                label="Unidade"
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
                    placeholder="Ex: Adubação do canteiro de Alface"
                    required
                />
             </div>
        )}

        <div className="input-row">
            <Input label="Data do Registro" name="dataRegistro" type="date" value={formData.dataRegistro} onChange={handleChange('dataRegistro')} required />
        </div>

        <div className="input-row">
            <Input
                label={tipoSelecionado === 'MATERIAL' ? "Responsável Almoxarifado" : (formData.status === 'EMPRESTADO' ? "Quem Entregou?" : "Quem Recebeu?")}
                name="responsavelEntrega"
                type="text"
                value={formData.responsavelEntrega}
                onChange={handleChange('responsavelEntrega')}
                required
            />
            <Input
                label={tipoSelecionado === 'MATERIAL' ? "Quem Retirou?" : (formData.status === 'EMPRESTADO' ? "Quem Retirou?" : "Quem Devolveu?")}
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