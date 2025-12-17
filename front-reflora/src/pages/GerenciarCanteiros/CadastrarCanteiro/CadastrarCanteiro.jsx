import React, { useState, useEffect } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
// 1. Importamos o Input, pois agora a página é responsável por ele
import Input from '../../../components/Input/Input';
// 1. Importa os dois services (Objetos)
import { sementesService } from '../../../services/sementesService';
import { canteiroService } from '../../../services/canteiroService';
import { getBackendErrorMessage } from '../../../utils/errorHandler';

const CadastrarCanteiro = () => {

  const [opcoesEspecies, setOpcoesEspecies] = useState([]); // Opções do select
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    nome: '',
    data: '',
    quantidade: 0, 
    especie: '',
  });

  // --- 2. BUSCAR AS ESPÉCIES NO CARREGAMENTO ---
  useEffect(() => {
    const fetchEspecies = async () => {
      try {
        // Busca a lista de strings ["Ipê", "Mogno"] do backend
        const listaNomes = await sementesService.listarNomesPopulares();
        
        // Transforma no formato { value, label } que o componente Input espera
        const options = listaNomes.map(nome => ({
          value: nome,
          label: nome
        }));
        setOpcoesEspecies(options);
      } catch (error) {
        console.error("Erro ao carregar espécies:", error);
        alert("Não foi possível carregar a lista de espécies.");
      }
    };fetchEspecies();
  }, []);

  // --- Funções de Manipulação do Form (Iguais ao seu código) ---
  const handleCancel = (confirmar = true) => {
    const resetForm = () => {
      setFormData({ nome: '', data: '', quantidade: 0, especie: '' });
    };

    if (confirmar) {
      if (window.confirm('Deseja cancelar? As alterações não salvas serão perdidas.')) {
        resetForm(); // Opcional: Voltar para a lista
      }
    } else {
      resetForm();
    }
  };

  // 2. Ajustamos o handleChange para converter 'number' corretamente
  const handleChange = (field) => (e) => {
    // Se o tipo for 'number', garante que o valor seja salvo como número
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 3. Criamos handlers específicos para o stepper de Quantidade
  const handleQuantidadeInc = () => {
    setFormData(prev => ({ ...prev, quantidade: prev.quantidade + 1 }));
  };

  const handleQuantidadeDec = () => {
    // Evita números negativos
    setFormData(prev => ({ ...prev, quantidade: prev.quantidade > 0 ? prev.quantidade - 1 : 0 }));
  };

  // --- 3. FORMATAR DATA (HTML yyyy-mm-dd -> Java dd/MM/yyyy) ---
  const formatarDataParaBack = (dataInput) => {
    if (!dataInput) return null;
    const [ano, mes, dia] = dataInput.split('-');
    return `${dia}/${mes}/${ano}`;
  };


  const handleSubmit = async (e) => {
    // Validação básica
    if (!formData.nome || !formData.data || !formData.especie) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nome: formData.nome,
        data: formData.data, 
        quantidade: formData.quantidade,
        especie: formData.especie
      };

      await canteiroService.create(payload);

      alert('Canteiro cadastrado com sucesso!');
      handleCancel(false); 

    } catch (error) {
      console.error("Erro ao salvar:", error);
      
      // --- AQUI ESTÁ A MUDANÇA ---
      // A função utilitária extrai a mensagem correta (seja do Spring, rede, ou genérica)
      const mensagemErro = getBackendErrorMessage(error);
      
      alert(`Erro: ${mensagemErro}`);
      // ---------------------------
      
    } finally {
      setLoading(false);
    }
  };

  // 4. O array 'fields' foi REMOVIDO.

  // O array 'actions' permanece o mesmo, pois o FormGeral ainda o aceita.
  const actions = [
    {
      type: 'button',
      variant: 'action-secondary',
      children: 'Cancelar',
      onClick: () => handleCancel(true),
      disabled: loading
    },
    {
      type: 'submit',
      variant: 'primary',
      children: loading ? 'Salvando...' : 'Salvar Cadastro',
      disabled: loading
    },
  ];

  return (
    <div className="pagina-canteiro">
      <FormGeral
        title="Cadastrar Canteiro"
        // 5. A prop 'fields' foi removida
        actions={actions}
        onSubmit={handleSubmit}
        useGrid={false} // Mantém os campos em coluna única
      >
        {/* 6. Os Inputs agora são passados como 'children' */}
        
        <Input
          label="Nome do Canteiro"
          name="nome"
          type="text"
          value={formData.nome}
          onChange={handleChange('nome')}
          required={true}
          placeholder="Ex: Canteiro 1" // Placeholder é usado pelo Input
        />
        
        <Input
          label="Data de Criação"
          name="data"
          type="date"
          value={formData.data}
          onChange={handleChange('data')}
          required={true}
          placeholder="xx/xx/xxxx"
        />
        
        <Input
          label="Quantidade Máxima do canteiro"
          name="quantidade"
          type="number"
          value={formData.quantidade}
          onChange={handleChange('quantidade')} // Para digitação manual
          onIncrement={handleQuantidadeInc}   // Para o botão '+'
          onDecrement={handleQuantidadeDec}   // Para o botão '-'
          required={true}
        />
        
        <Input
          label="Espécie"
          name="especie"
          type="select"
          value={formData.especie}
          onChange={handleChange('especie')}
          required={true}
          placeholder="Selecione a espécie"
          options={opcoesEspecies}
        />

      </FormGeral>
    </div>
  );
};

export default CadastrarCanteiro;