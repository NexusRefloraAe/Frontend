import React, { useState, useEffect } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input';
import './Cadastrar.css';
import { plantioService } from '../../../services/plantioService';
import { vistoriaService } from '../../../services/vistoriaService';

const Cadastrar = () => {
  const [lotesDisponiveis, setLotesDisponiveis] = useState([]);
  const [canteirosDisponiveis, setCanteirosDisponiveis] = useState([]);
  const [loading, setLoading] = useState(false);
  // const hoje = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    lote: '',
    nomePopular: '',
    nomeCanteiro: '',
    dataVistoria: '',
    estadoSaude: '',
    tratosCulturais: '',
    doencasPragas: '',
    estimativaMudasProntas: 0,
    nomeResponsavel: '',
    observacoes: ''
  });

  const handleCancel = (confirmar = true) => {
    const resetForm = () => {
      setFormData({
        lote: '',
        nomePopular: '',
        nomeCanteiro: '',
        dataVistoria: '',
        estadoSaude: '',
        tratosCulturais: '',
        doencasPragas: '',
        estimativaMudasProntas: 0,
        nomeResponsavel: '',
        observacoes: ''
      });
    };
    if (confirmar && window.confirm('Deseja cancelar? As alterações não salvas serão perdidas.')) {
      resetForm();
    } else if (!confirmar) {
      resetForm();
    }
  };

  // 1. Carregar Lotes confirmados ao montar o componente
  useEffect(() => {
      const carregarLotes = async () => {
          const dados = await plantioService.getLotesConfirmados();
          setLotesDisponiveis(dados);
      };
      carregarLotes();
  }, []);

  // 2. Lógica ao mudar o Lote (busca canteiros e preenche espécie)
  const handleLoteChange = async (loteSelecionado) => {
    const infoLote = lotesDisponiveis.find(item => item.loteMuda === loteSelecionado);
    
    setFormData(prev => ({
      ...prev,
      lote: loteSelecionado,
      nomePopular: infoLote ? infoLote.nomePopular : '',
      nomeCanteiro: '' 
    }));

    if (loteSelecionado) {
      try {
          const canteiros = await vistoriaService.getCanteirosPorLote(loteSelecionado);
          setCanteirosDisponiveis(canteiros.map(c => ({ value: c, label: c })));
      } catch (error) {
          console.error("Erro ao buscar canteiros:", error);
      }
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    if (field === 'lote') {
        handleLoteChange(value);
    } else {
        setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleEstimativaInc = () => {
    setFormData(prev => ({ ...prev, estimativaMudas: prev.estimativaMudas + 1 }));
  };

  const handleEstimativaDec = () => {
    setFormData(prev => ({ ...prev, estimativaMudas: Math.max(0, prev.estimativaMudas - 1) }));
  };

  const handleSubmit = async () => {
    try {
        setLoading(true);
        await vistoriaService.create(formData);
        alert('Vistoria cadastrada com sucesso!');
        // Reset ou redirecionamento aqui
    } catch (error) {
        alert('Erro ao salvar: ' + (error.response?.data?.message || 'Erro no servidor'));
    } finally {
        setLoading(false);
    }
  };

  const actions = [
    {
      type: 'button',
      variant: 'action-secondary',
      children: 'Cancelar',
      onClick: () => handleCancel(true),
    },
    {
      type: 'submit',
      variant: 'primary',
      children: 'Salvar Cadastro',
    },
  ];

  return (
    <div className="cadastrar-vistoria">
      <FormGeral
        title="Cadastrar Vistoria"
        actions={actions}
        onSubmit={handleSubmit}
        useGrid={false}
        isLoading={loading}
      >
        <div className="input-row">
          <Input
            label="Lote"
            type="select"
            value={formData.lote}
            onChange={handleChange('lote')}
            options={lotesDisponiveis.map(l => ({ value: l.loteMuda, label: l.loteMuda }))}
            placeholder="Selecione o Lote"
          />
          <Input
              label="Espécie (Nome Popular)"
              value={formData.nomePopular}
              placeholder="Preenchido automaticamente"
              readOnly={true}
              disabled={true}
          />
          <Input
              label="Canteiro"
              type="select"
              value={formData.nomeCanteiro}
              onChange={handleChange('nomeCanteiro')}
              options={canteirosDisponiveis}
              placeholder={formData.lote ? "Selecione o canteiro" : "Selecione um lote primeiro"}
              disabled={!formData.lote}
              required={true}
          />
          <Input
            label="Data da Vistoria"
            type="date"
            value={formData.dataVistoria}
            onChange={handleChange('dataVistoria')}
            required={true}
          />
        </div>

        <div className="input-row">
          <Input
            label="Estado de Saúde"
            type="select"
            value={formData.estadoSaude}
            onChange={handleChange('estadoSaude')}
            required={true}
            placeholder="Selecione o estado de saúde"
            options={[
                { value: 'Ótima', label: 'Ótima' },
                { value: 'Boa', label: 'Boa' },
                { value: 'Regular', label: 'Regular' },
                { value: 'Ruim', label: 'Ruim' },
                { value: 'Péssima', label: 'Péssima' }
            ]}
          />

          <Input
            label="Tratos Culturais"
            name="tratosCulturais"
            type="select"
            value={formData.tratosCulturais}
            onChange={handleChange('tratosCulturais')}
            required={true}
            placeholder="Selecione os tratos"
            options={[
                { value: 'Adubação e Regação', label: 'Adubação, Regação' },
                { value: 'Adubação', label: 'Apenas Adubação' },
                { value: 'Regação', label: 'Apenas Regação' },
                { value: 'Nenhum', label: 'Nenhum' },
            ]}
          />
        </div>

        <div className="input-row">
          <Input
            label="Estimativa de Mudas"
            name="estimativaMudasProntas"
            type="number"
            value={formData.estimativaMudasProntas}
            onChange={handleChange('estimativaMudasProntas')}
            onIncrement={handleEstimativaInc}
            onDecrement={handleEstimativaDec}
            required={true}
          />
          <Input
            label="Nome do Responsável"
            name="nomeResponsavel"
            type="text"
            value={formData.nomeResponsavel}
            onChange={handleChange('nomeResponsavel')}
            placeholder="Informe o nome do responsável"
            required={true}
          />
        </div>

        <Input
          label="Observações"
          name="observacoes"
          type="textarea"
          value={formData.observacoes}
          onChange={handleChange('observacoes')}
          placeholder="Insira observações adicionais..."
          required={false}
          rows={4}
        />
      </FormGeral>
    </div>
  );
};

export default Cadastrar;