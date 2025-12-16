import React, { useState, useEffect } from "react";
import FormGeral from "../../../components/FormGeral/FormGeral";
import Input from "../../../components/Input/Input";
import { testeGerminacaoService } from "../../../services/testeGerminacaoService";
// IMPORTANTE: Reutilizamos o serviço que já tem a busca de sementes
import { plantioService } from "../../../services/plantioService"; 

const CadastrarTestes = () => {
  const [formData, setFormData] = useState({
    lote: '',
    nomePopular: '',
    dataTeste: '',
    quantidade: 0,
    camaraFria: '',
    dataGerminacao: '',
    qntdGerminou: 0,
    taxaGerminou: ''
  });

  const [loading, setLoading] = useState(false);
  
  // --- NOVOS ESTADOS PARA O AUTOCOMPLETE ---
  const [sugestoes, setSugestoes] = useState([]);
  const [estoqueAtual, setEstoqueAtual] = useState(null); // Apenas visual
  // -----------------------------------------

  // --- LÓGICA DO AUTOCOMPLETE (Igual ao Plantio) ---
  const handleLoteChange = async (e) => {
    const valor = e.target.value;
    
    // Atualiza o input de lote
    setFormData(prev => ({ ...prev, lote: valor }));

    if (valor.length > 1) {
      try {
        // Busca sementes pelo lote digitado
        const resultados = await plantioService.pesquisarSementes(valor);
        setSugestoes(resultados);
      } catch (error) {
        console.error("Erro ao buscar sugestões:", error);
      }
    } else {
      setSugestoes([]);
    }
  };

  const handleBlurLote = () => {
    // Delay para permitir o clique na lista antes de fechar
    setTimeout(() => setSugestoes([]), 200);
  };

  const selecionarSugestao = (semente) => {
    // Extrai o número do estoque (ex: "1500 KG" -> 1500)
    
    setEstoqueAtual(semente.quantidadeAtualFormatada); // Guarda para exibir na tela

    setFormData(prev => ({
      ...prev,
      lote: semente.lote,
      nomePopular: semente.nomePopular,
      // Nota: Não preenchemos 'quantidade' automaticamente no teste pois 
      // geralmente testa-se apenas uma amostra, não o estoque todo.
    }));

    setSugestoes([]); // Fecha a lista
  };
  // ----------------------------------------------------

  // --- Efeito para calcular a Taxa automaticamente ---
  useEffect(() => {
    const total = Number(formData.quantidade);
    const germinou = Number(formData.qntdGerminou);

    if (total > 0 && germinou >= 0) {
      const taxa = ((germinou / total) * 100).toFixed(2);
      
      setFormData(prev => {
        if (prev.taxaGerminou === taxa) return prev;
        return { ...prev, taxaGerminou: taxa };
      });
    } else {
      setFormData(prev => ({ ...prev, taxaGerminou: '' }));
    }
  }, [formData.quantidade, formData.qntdGerminou]);

  const handleCancel = (confirmar = true) => {
    const resetForm = () => {
      setFormData({
        lote: '',
        nomePopular: '',
        dataTeste: '',
        quantidade: 0,
        camaraFria: '',
        dataGerminacao: '',
        qntdGerminou: 0,
        taxaGerminou: ''
      });
      setSugestoes([]);
      setEstoqueAtual(null);
    };

    if (confirmar) {
      if (window.confirm('Deseja cancelar? As alterações não salvas serão perdidas.')) {
        resetForm();
      }
    } else {
      resetForm();
    }
  };

  const handleChange = (field) => (e) => {
    let value = e.target.value;
    if (e.target.type === 'number') {
        value = value === '' ? '' : Number(value);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIncrement = (field) => {
    setFormData(prev => ({ 
        ...prev, 
        [field]: (typeof prev[field] === 'number' ? prev[field] : 0) + 1 
    }));
  };

  const handleDecrement = (field) => {
    setFormData(prev => {
        const valorAtual = typeof prev[field] === 'number' ? prev[field] : 0;
        return { 
            ...prev, 
            [field]: valorAtual > 0 ? valorAtual - 1 : 0 
        };
    });
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!formData.lote || !formData.nomePopular) {
        return alert("Por favor, selecione um Lote válido da lista.");
    }

    try {
      setLoading(true);
      await testeGerminacaoService.create(formData);
      alert('Teste cadastrado com sucesso!');
      handleCancel(false);
    } catch (error) {
      console.error("Erro ao cadastrar teste:", error);
      alert("Erro ao salvar cadastro.");
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    { type: 'button', variant: 'action-secondary', children: 'Cancelar', onClick: () => handleCancel(true), disabled: loading },
    { type: 'submit', variant: 'primary', children: loading ? 'Salvando...' : 'Salvar Cadastro', disabled: loading },
  ];

  return (
    <div className="">
      <FormGeral
        title="Cadastro Teste de Germinação"
        actions={actions}
        onSubmit={handleSubmit}
        useGrid={true}
      >
        {/* --- CAMPO LOTE COM AUTOCOMPLETE --- */}
        <div style={{ position: 'relative' }}>
            <Input
              label="Lote"
              name="lote"
              type="text"
              value={formData.lote}
              onChange={handleLoteChange} // Handler específico
              onBlur={handleBlurLote}     // Fecha ao sair
              required={true}
              placeholder="Digite para buscar..."
              autoComplete="off"
            />
            
            {/* Lista Flutuante */}
            {sugestoes.length > 0 && (
                <ul style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    maxHeight: '200px',
                    overflowY: 'auto'
                }}>
                    {sugestoes.map((s) => (
                        <li 
                            key={s.id || s.lote}
                            onClick={() => selecionarSugestao(s)}
                            style={{
                                padding: '10px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #eee',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            <div>
                                <strong>{s.lote}</strong> - {s.nomePopular}
                            </div>
                            <span style={{ fontSize: '0.85em', color: '#666', backgroundColor: '#eef', padding: '2px 6px', borderRadius: '4px' }}>
                                Estoque Atual: {s.quantidadeAtualFormatada}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>

        <Input
          label="Nome Popular"
          name="nomePopular"
          type="text"
          value={formData.nomePopular}
          onChange={handleChange('nomePopular')}
          required={true}
          disabled={true} // Bloqueado pois vem do lote
          placeholder="Selecionado automaticamente"
        />

        <Input
          label="Data do Teste"
          name="dataTeste"
          type="date"
          value={formData.dataTeste}
          onChange={handleChange('dataTeste')}
          required={true}
        />

        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            
            {/* 1. Envolvemos o Input em uma div com flex: 1 para ele ocupar o espaço */}
            <div style={{ flex: 1 }}>
                <Input
                    label="Qtd de sementes (Amostra)"
                    name="quantidade"
                    type="number"
                    value={formData.quantidade}
                    onChange={handleChange('quantidade')}
                    onIncrement={() => handleIncrement("quantidade")}
                    onDecrement={() => handleDecrement("quantidade")}
                    required={true}
                    placeholder="0"
                />
            </div>

            {/* 2. O texto agora fica ao lado. Ajuste o marginTop se precisar alinhar com o input (ignorando o label) */}
            {estoqueAtual && (
                <small style={{ 
                    color: '#666', 
                    whiteSpace: 'nowrap', // Impede que o texto quebre linha
                    marginTop: '15px'     // Empurra um pouco para baixo para alinhar com a caixa do input (devido ao Label em cima)
                }}>
                    Disponível: <strong>{estoqueAtual}</strong>
                </small>
            )}
        </div>

        <Input
          label="Câmara fria"
          name="camaraFria"
          type="select"
          value={formData.camaraFria}
          onChange={handleChange('camaraFria')}
          required={true}
          placeholder="Sim/não"
          options={[
            { value: 'Sim', label: 'Sim' },
            { value: 'Não', label: 'Não' },
          ]}
        />

        <Input
          label="Data Germinação"
          name="dataGerminacao"
          type="date"
          value={formData.dataGerminacao}
          onChange={handleChange('dataGerminacao')}
          required={false} 
        />

        <Input
          label="Qtd Germinou (und)"
          name="qntdGerminou"
          type="number"
          value={formData.qntdGerminou}
          onChange={handleChange('qntdGerminou')}
          onIncrement={() => handleIncrement("qntdGerminou")}
          onDecrement={() => handleDecrement("qntdGerminou")}
          required={false} 
          placeholder="0"
        />

        <Input
          label="Taxa Germinação (%)"
          name="taxaGerminou"
          type="text"
          value={formData.taxaGerminou ? `${formData.taxaGerminou}%` : ''} 
          onChange={() => {}} 
          disabled={true} 
          placeholder="Calculado automaticamente..."
        />

      </FormGeral>
    </div>
  );
};

export default CadastrarTestes;