import React, { useState } from "react";
import FormGeral from "../../../components/FormGeral/FormGeral";
import Input from "../../../components/Input/Input";
import { plantioService } from "../../../services/plantioService";

const CadastrarPlantio = () => {
  const [formData, setFormData] = useState({
    lote: '',
    nomePopular: '',
    qtdSemente: 0,
    dataPlantio: '',
    tipoPlantio: '',
    quantidadePlantada: 0
  });

  const [loading, setLoading] = useState(false);
  const [sugestoes, setSugestoes] = useState([]); // Lista de lotes encontrados

  // --- Lógica do Autocomplete ---
  const handleLoteChange = async (e) => {
    const valor = e.target.value;
    
    // 1. Atualiza o input normalmente
    setFormData(prev => ({ ...prev, lote: valor }));

    // 2. Se tiver mais de 1 caractere, busca sugestões
    if (valor.length > 1) {
      try {
        const resultados = await plantioService.pesquisarSementes(valor);
        setSugestoes(resultados);
      } catch (error) {
        console.error("Erro ao buscar sugestões:", error);
      }
    } else {
      setSugestoes([]); // Limpa se for muito curto
    }
  };

  // Quando o usuário clica em uma opção da lista
  const selecionarSugestao = (semente) => {
    // Extrai apenas o número da string "100 KG" ou "500 und"
    const estoque = parseInt(semente.quantidadeAtualFormatada) || 0;

    setFormData(prev => ({
      ...prev,
      lote: semente.lote,
      nomePopular: semente.nomePopular,
      qtdSemente: estoque // Preenche com o estoque atual
    }));

    setSugestoes([]); // Esconde a lista
  };

  // Garante que a lista suma se clicar fora (delay pequeno para permitir o clique)
  const handleBlurLote = () => {
    setTimeout(() => setSugestoes([]), 200);
  };
  // ------------------------------

  const handleCancel = (confirmar = true) => {
    const resetForm = () => setFormData({ lote: '', nomePopular: '', qtdSemente: 0, dataPlantio: '', tipoPlantio: '', quantidadePlantada: 0 });
    if (confirmar && !window.confirm('Deseja cancelar?')) return;
    resetForm();
    setSugestoes([]);
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIncrement = (field) => setFormData(prev => ({ ...prev, [field]: prev[field] + 1 }));
  const handleDecrement = (field) => setFormData(prev => ({ ...prev, [field]: Math.max(0, prev[field] - 1) }));

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.lote || !formData.nomePopular) return alert("Selecione um Lote válido.");
    
    try {
      setLoading(true);
      await plantioService.create(formData);
      alert("Plantio cadastrado com sucesso!");
      handleCancel(false);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Erro desconhecido.";
      alert(`Erro ao salvar: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    { type: 'button', variant: 'action-secondary', children: 'Cancelar', onClick: () => handleCancel(true), disabled: loading },
    { type: 'submit', variant: 'primary', children: loading ? 'Salvando...' : 'Salvar Cadastro', disabled: loading },
  ];

  return (
    <FormGeral title="Cadastro Plantio" actions={actions} onSubmit={handleSubmit} useGrid={true}>
        
        {/* --- CAMPO LOTE COM LISTA SUSPENSA --- */}
        <div style={{ position: 'relative' }}>
            <Input
              label="Lote"
              name="lote"
              type="text"
              value={formData.lote}
              onChange={handleLoteChange} // Usa o handler especial
              onBlur={handleBlurLote}     // Fecha ao sair
              required={true}
              placeholder="Digite para buscar..."
              autoComplete="off"          // Desliga o autocomplete nativo do navegador
            />
            
            {/* Lista de Sugestões Flutuante */}
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
                            key={s.id}
                            onClick={() => selecionarSugestao(s)}
                            style={{
                                padding: '10px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #eee',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            <strong>{s.lote}</strong>
                            <span style={{ color: '#666' }}>{s.nomePopular}</span>
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
          disabled={true} 
          placeholder="Selecionado automaticamente"
        />

        <Input
          label="Data do Plantio"
          name="dataPlantio"
          type="date"
          value={formData.dataPlantio}
          onChange={handleChange('dataPlantio')}
          required={true}
        />

        <Input
          label="Quantidade de sementes no estoque (kg/g/und)"
          name="qtdSemente"
          type="number"
          value={formData.qtdSemente}
          onChange={handleChange('qtdSemente')}
          required={true}
          disabled={true}
        />

        <Input
          label="Quantidade a ser plantada (kg/g/und)"
          name="quantidadePlantada"
          type="number"
          onChange={handleChange('quantidadePlantada')}
          onIncrement={() => handleIncrement("quantidadePlantada")}
          onDecrement={() => handleDecrement("quantidadePlantada")}
          required={true}
        />

        <Input
          label="Onde está sendo plantado?"
          name="tipoPlantio"
          type="select"
          value={formData.tipoPlantio}
          onChange={handleChange('tipoPlantio')}
          required={true}
          placeholder="Selecione o tipo de plantio"
          options={[
            { value: 'SEMENTEIRA', label: 'Sementeira' },
            { value: 'SAQUINHO', label: 'Saquinho' },
            { value: 'CHAO', label: 'Chão' },
          ]}
        />
    </FormGeral>
  );
};

export default CadastrarPlantio;