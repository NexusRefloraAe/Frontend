import { useEffect, useState } from "react";
import FormGeral from "../../../../components/FormGeral/FormGeral";
import Input from "../../../../components/Input/Input";

const EditarPlantioSementes = ({ isOpen, onSalvar, onCancelar, plantio }) => {
  const [formData, setFormData] = useState({
    lote: '',
    nomePopular: '',
    qntdSementes: 0,
    dataPlantio: '',
    tipoPlantio: '',
    qntdPlantada: 0,
  });

  // --- 1. FUNÇÃO DE NORMALIZAÇÃO (O SEGREDO DA INTEGRAÇÃO) ---
  // Transforma "Chão", "CHÃO", "chão" -> "CHAO"
  const normalizarEnum = (valor) => {
    if (!valor) return '';
    return String(valor)
      .normalize('NFD')               // Separa acentos
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .toUpperCase();                 // Tudo Maiúsculo
  };

  useEffect(() => {
    if (plantio) {
      const formatarDataInput = (dataStr) => {
          if(!dataStr) return '';
          if(dataStr.includes('/')) {
             const parts = dataStr.split('/');
             return `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
          return dataStr;
      };

      // --- 2. TRATAMENTO NO CARREGAMENTO ---
      // Se o back mandar "Chão" (descrição), convertemos para "CHAO" (value do select)
      // para que o campo já venha selecionado corretamente.
      let tipoPlantioNormalizado = '';
      if (plantio.tipoPlantioDescricao) {
          tipoPlantioNormalizado = normalizarEnum(plantio.tipoPlantioDescricao);
      } else if (plantio.tipoPlantio) {
          tipoPlantioNormalizado = normalizarEnum(plantio.tipoPlantio);
      }

      setFormData({
        lote: plantio.lote || '',
        nomePopular: plantio.nomePopularSemente || plantio.nomePopular || '', 
        qntdSementes: plantio.qtdSemente || plantio.qntdSementes || 0,
        dataPlantio: formatarDataInput(plantio.dataPlantio),
        
        // Aqui usamos o valor tratado
        tipoPlantio: tipoPlantioNormalizado, 
        
        qntdPlantada: plantio.quantidadePlantada || plantio.qntdPlantada || 0,
      });
    }
  }, [plantio]);

  const handleCancel = (confirmar = true) => {
    if (confirmar) {
      if (window.confirm('Deseja cancelar? As alterações não salvas serão perdidas.')) {
        onCancelar();
      }
    } else {
      onCancelar();
    }
  };

  const handleSubmit = () => {
    // --- 3. TRATAMENTO NO ENVIO ---
    // Garante que enviamos "CHAO" sem acento para o Java não dar erro 500
    const dadosSalvos = {
      id: plantio.id, 
      ...formData,
      tipoPlantio: normalizarEnum(formData.tipoPlantio) 
    };

    onSalvar(dadosSalvos);
  };

  const handleChange = (field) => (e) => {
    // Para Selects, as vezes o valor vem direto, as vezes via target
    const value = e.target ? (e.target.type === 'number' ? Number(e.target.value) : e.target.value) : e;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIncrement = (field) => () => {
    setFormData((prev) => ({ ...prev, [field]: prev[field] + 1 }));
  };
  const handleDecrement = (field) => () => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(0, prev[field] - 1),
    }));
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
      children: 'Salvar Edições',
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => handleCancel(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-button" onClick={() => handleCancel(true)}>
          &times;
        </button>

        <FormGeral
          title="Editar Plantio"
          actions={actions}
          onSubmit={handleSubmit}
          useGrid={true}
        >
          <Input
            label="Lote"
            name="lote"
            type="text"
            value={formData.lote}
            onChange={handleChange('lote')}
            required={true}
            placeholder="A001"
          />

          <Input
            label="Nome Popular"
            name="nomePopular"
            type="text"
            value={formData.nomePopular}
            onChange={handleChange('nomePopular')}
            required={true}
            placeholder="Ipê"
          />

          <Input
            label="Data"
            name="dataPlantio"
            type="date"
            value={formData.dataPlantio}
            onChange={handleChange('dataPlantio')}
            required={true}
          />

          <Input
            label="Qtd sementes (kg/g/und)"
            name="qntdSementes"
            type="number"
            value={formData.qntdSementes}
            onChange={handleChange('qntdSementes')}
            onIncrement={handleIncrement('qntdSementes')}
            onDecrement={handleDecrement('qntdSementes')}
            required={true}
          />

          <Input
            label="Qtd plantada (und)"
            name="qntdPlantada"
            type="number"
            value={formData.qntdPlantada}
            onChange={handleChange('qntdPlantada')}
            onIncrement={handleIncrement("qntdPlantada")}
            onDecrement={handleDecrement("qntdPlantada")}
            required={true}
          />

          {/* 4. OPÇÕES DO SELECT
             Os 'values' devem ser IDÊNTICOS às constantes do Enum Java (sem acento, Uppercase).
             Os 'labels' são o que o usuário vê.
          */}
          <Input
            label="Tipo de plantio"
            name="tipoPlantio"
            type="select"
            value={formData.tipoPlantio}
            onChange={handleChange('tipoPlantio')}
            required={true}
            placeholder="Selecione"
            options={[
              { value: 'SEMENTEIRA', label: 'Sementeira' },
              { value: 'SAQUINHO', label: 'Saquinho' },
              { value: 'CHAO', label: 'Chão' }, 
            ]}
          />
        </FormGeral>
      </div>
    </div>
  );
};

export default EditarPlantioSementes;