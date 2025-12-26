import React, { useState, useEffect } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input';
import insumoService from '../../../services/insumoService';
import './CadastrarEmprestimo.css';

const CadastrarEmprestimo = ({
  item,       
  onSalvar,   
  onCancelar  
}) => {
  const hoje = new Date().toISOString().split('T')[0];
  
  // Lista completa vinda do banco
  const [listaFerramentas, setListaFerramentas] = useState([]);
  
  // Lista filtrada para o autocomplete
  const [sugestoes, setSugestoes] = useState([]); 
  
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    insumoId: '',
    nomeInsumo: '', // O que o usuário digita
    status: 'EMPRESTADO',
    quantidade: '',
    unidadeMedida: 'Unidade',
    dataRegistro: hoje,
    responsavelEntrega: '',
    responsavelReceber: '',
  });

  // 1. Carregar a lista completa ao abrir
  useEffect(() => {
    const carregarFerramentas = async () => {
      try {
        setLoading(true);
        const dados = await insumoService.listarInsumos('FERRAMENTA');
        setListaFerramentas(dados);
      } catch (error) {
        console.error("Erro ao carregar ferramentas:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarFerramentas();
  }, []);

  // 2. Se vier edição, preenche
  useEffect(() => {
    if (item) {
      setFormData(prev => ({
        ...prev,
        insumoId: item.id,
        nomeInsumo: item.NomeInsumo || item.nomeInsumo || '',
        status: item.Status ? item.Status.toUpperCase() : 'EMPRESTADO',
        quantidade: '',
        unidadeMedida: item.UnidadeMedida || 'Unidade',
      }));
    }
  }, [item]);

  // --- Lógica do Autocomplete ---
  const handleNomeChange = (e) => {
    const valor = e.target.value;
    
    // Atualiza o texto do input e limpa o ID se o usuário estiver digitando
    setFormData(prev => ({ 
        ...prev, 
        nomeInsumo: valor,
        insumoId: '' // Força o usuário a selecionar da lista novamente
    }));

    if (valor.length > 0) {
      // Filtra a lista localmente (case insensitive)
      const filtrados = listaFerramentas.filter(f => 
        f.nome.toLowerCase().includes(valor.toLowerCase())
      );
      setSugestoes(filtrados);
    } else {
      setSugestoes([]);
    }
  };

  const selecionarFerramenta = (ferramenta) => {
    setFormData(prev => ({
      ...prev,
      insumoId: ferramenta.id,
      nomeInsumo: ferramenta.nome,
      unidadeMedida: ferramenta.unidadeMedida || 'Unidade'
    }));
    setSugestoes([]); // Esconde a lista
  };

  const handleBlurNome = () => {
    // Delay para permitir o clique na sugestão
    setTimeout(() => setSugestoes([]), 200);
  };
  // ------------------------------

  const handleCancel = () => {
    if (onCancelar) onCancelar();
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuantidadeInc = () => {
    setFormData(prev => ({ ...prev, quantidade: Math.max(0, (prev.quantidade || 0) + 1) }));
  };

  const handleQuantidadeDec = () => {
    setFormData(prev => ({ ...prev, quantidade: Math.max(0, (prev.quantidade || 0) - 1) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.insumoId) return alert('Por favor, selecione uma ferramenta da lista.');
    if (!formData.quantidade || formData.quantidade <= 0) return alert('Informe uma quantidade válida.');
    if (!formData.responsavelEntrega) return alert('Informe o responsável pela entrega.');
    if (!formData.responsavelReceber) return alert('Informe o responsável por receber.');

    try {
      const payload = {
        insumoId: formData.insumoId,
        nomeInsumo: formData.nomeInsumo,
        status: formData.status,
        quantidade: Number(formData.quantidade),
        dataRegistro: formData.dataRegistro,
        responsavelEntrega: formData.responsavelEntrega,
        responsavelReceber: formData.responsavelReceber
      };

      await insumoService.registrarMovimentacao(payload);

      const acaoRealizada = formData.status === 'EMPRESTADO' ? 'Empréstimo' : 'Devolução';
      alert(`${acaoRealizada} registrada com sucesso!`);

      if (onSalvar) {
        onSalvar(formData); 
      } else {
        setFormData({ 
            ...formData, 
            quantidade: '', 
            responsavelEntrega: '', 
            responsavelReceber: '',
            nomeInsumo: '',
            insumoId: '' 
        });
      }

    } catch (error) {
      console.error('Erro ao registrar:', error);
      if (error.response && error.response.data) {
          alert(`Erro: ${error.response.data.message || 'Erro ao registrar.'}`);
      } else {
          alert('Erro ao registrar movimentação.');
      }
    }
  };

  const textoBotao = formData.status === 'EMPRESTADO' ? 'Registrar Saída' : 'Registrar Entrada';

  const actions = [
    { type: 'button', variant: 'action-secondary', children: 'Cancelar', onClick: handleCancel },
    { type: 'submit', variant: 'primary', children: textoBotao },
  ];

  return (
    <div className="cadastrar-emprestimo">
      <FormGeral
        title={`Movimentação de Ferramenta`}
        actions={actions}
        onSubmit={handleSubmit}
        useGrid={false}
      >
        <div className="input-row">
          
          {/* CAMPO COM AUTOCOMPLETE (IGUAL PLANTIO) */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Input
              label="Ferramenta"
              name="nomeInsumo"
              type="text"
              value={formData.nomeInsumo}
              onChange={handleNomeChange}
              onBlur={handleBlurNome}
              required={true}
              placeholder="Digite para buscar..."
              autoComplete="off"
              // Se estiver editando um item específico (vindo da tabela), bloqueia a busca
              readOnly={!!item} 
            />

            {/* LISTA SUSPENSA */}
            {sugestoes.length > 0 && !item && (
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
                    {sugestoes.map((f) => (
                        <li 
                            key={f.id}
                            onClick={() => selecionarFerramenta(f)}
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
                                <strong>{f.nome}</strong>
                            </div>
                            <span style={{ fontSize: '0.85em', color: '#666', backgroundColor: '#eef', padding: '2px 6px', borderRadius: '4px' }}>
                                Estoque: {f.quantidadeAtual} {f.unidadeMedida?.toLowerCase() || 'und'}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
          </div>
           
           <Input
            label="Tipo de Ação"
            name="status"
            type="select"
            value={formData.status}
            onChange={handleChange('status')}
            required={true}
            options={[
              { value: 'EMPRESTADO', label: 'Emprestar (Sai do Estoque)' },
              { value: 'DEVOLVIDO', label: 'Devolver (Volta ao Estoque)' },
            ]}
          />
        </div>

        <div className="input-row">
          <Input
            label={formData.status === 'EMPRESTADO' ? "Quantidade a Retirar" : "Quantidade a Devolver"}
            name="quantidade"
            type="number"
            value={formData.quantidade}
            onChange={handleChange('quantidade')}
            onIncrement={handleQuantidadeInc}
            onDecrement={handleQuantidadeDec}
            placeholder="Ex: 1"
            required={true}
            min="1"
          />
          <Input
            label="Medida"
            name="unidadeMedida"
            type="text"
            value={formData.unidadeMedida}
            readOnly={true}
          />
        </div>

        <div className="input-row">
          <Input
            label="Data"
            name="dataRegistro"
            type="date"
            value={formData.dataRegistro}
            onChange={handleChange('dataRegistro')}
            required={true}
          />
        </div>

        <div className="input-row">
          <Input
            label={formData.status === 'EMPRESTADO' ? "Resp. Entrega (Almoxarifado)" : "Quem está Devolvendo?"}
            name="responsavelEntrega"
            type="text"
            value={formData.responsavelEntrega}
            onChange={handleChange('responsavelEntrega')}
            placeholder="Nome da pessoa"
            required={true}
          />
          <Input
            label={formData.status === 'EMPRESTADO' ? "Resp. Recebe (Funcionário)" : "Quem Recebeu no Estoque?"}
            name="responsavelReceber"
            type="text"
            value={formData.responsavelReceber}
            onChange={handleChange('responsavelReceber')}
            placeholder="Nome da pessoa"
            required={true}
          />
        </div>
      </FormGeral>
    </div>
  );
};

export default CadastrarEmprestimo;