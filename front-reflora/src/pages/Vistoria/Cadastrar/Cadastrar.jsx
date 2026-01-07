import React, { useState, useEffect } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input';
import { plantioService } from '../../../services/plantioService';
import { vistoriaService } from '../../../services/vistoriaService';
import './Cadastrar.css';

const Cadastrar = () => {
  const [lotesDisponiveis, setLotesDisponiveis] = useState([]);
  const [canteirosDisponiveis, setCanteirosDisponiveis] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const carregarLotes = async () => {
      try {
        const dados = await plantioService.getLotesConfirmados();
        setLotesDisponiveis(dados);
      } catch (error) {
        console.error("Erro ao carregar lotes:", error);
      }
    };
    carregarLotes();
  }, []);

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
    setFormData(prev => ({ ...prev, estimativaMudasProntas: Number(prev.estimativaMudasProntas) + 1 }));
  };

  const handleEstimativaDec = () => {
    setFormData(prev => ({ ...prev, estimativaMudasProntas: Math.max(0, Number(prev.estimativaMudasProntas) - 1) }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      await vistoriaService.create(formData);
      alert('Vistoria cadastrada com sucesso!');
      handleCancel(false);
    } catch (error) {
      alert('Erro ao salvar: ' + (error.response?.data?.message || 'Erro no servidor'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-vistoria-container">
      <FormGeral
        title="Cadastrar Vistoria"
        actions={[]}
        onSubmit={handleSubmit}
        useGrid={false}
      >

        <div className="insumo-grid">
          {/* Campos de seleção e dados iniciais */}
          <Input
            label="Lote"
            type="select"
            value={formData.lote}
            onChange={handleChange('lote')}
            options={lotesDisponiveis.map(l => ({ value: l.loteMuda, label: l.loteMuda }))}
            placeholder="Selecione o Lote"
            required
          />
          <Input
            label="Espécie (Nome Popular)"
            value={formData.nomePopular}
            placeholder="Preenchido automaticamente"
            readOnly
          />

          <Input
            label="Canteiro"
            type="select"
            value={formData.nomeCanteiro}
            onChange={handleChange('nomeCanteiro')}
            options={canteirosDisponiveis}
            placeholder={formData.lote ? "Selecione o canteiro" : "Selecione um lote"}
            disabled={!formData.lote}
            required
          />
          <Input
            label="Data da Vistoria"
            type="date"
            value={formData.dataVistoria}
            onChange={handleChange('dataVistoria')}
            required
          />

          <Input
            label="Estado de Saúde"
            type="select"
            value={formData.estadoSaude}
            onChange={handleChange('estadoSaude')}
            required
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
            type="select"
            value={formData.tratosCulturais}
            onChange={handleChange('tratosCulturais')}
            required
            options={[
              { value: 'Adubação e Regação', label: 'Adubação, Regação' },
              { value: 'Adubação', label: 'Apenas Adubação' },
              { value: 'Regação', label: 'Apenas Regação' },
              { value: 'Nenhum', label: 'Nenhum' },
            ]}
          />

          <Input
            label="Estimativa de Mudas"
            type="number"
            value={formData.estimativaMudasProntas}
            onChange={handleChange('estimativaMudasProntas')}
            onIncrement={handleEstimativaInc}
            onDecrement={handleEstimativaDec}
            required
          />
          <Input
            label="Pragas/Doenças"
            type="select"
            value={formData.doencasPragas}
            onChange={handleChange('doencasPragas')}
            required
            options={[
              { value: 'Nenhuma', label: 'Nenhuma' },
              { value: 'Formigas', label: 'Formigas' },
              { value: 'Fungos', label: 'Fungos' },
              { value: 'Outros', label: 'Outros' },
            ]}
          />

          {/* Agora estes dois campos ficam um ao lado do outro no Desktop */}
          <Input
            label="Nome do Responsável"
            type="text"
            value={formData.nomeResponsavel}
            onChange={handleChange('nomeResponsavel')}
            placeholder="Informe o nome"
            required
          />
          <Input
            label="Observações"
            type="textarea"
            value={formData.observacoes}
            onChange={handleChange('observacoes')}
            placeholder="Observações adicionais..."
            rows={3}
          />

          {/* Botões alinhados à direita */}
          <div className="grid-span-2 insumo-actions">
            <button
              type="button"
              className="insumo-btn btn-cancelar"
              onClick={() => handleCancel(true)}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="insumo-btn btn-salvar"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Cadastro'}
            </button>
          </div>
        </div>
      </FormGeral>
    </div>
  );
};

export default Cadastrar;