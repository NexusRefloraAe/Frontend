import { useEffect, useState } from "react";
import FormGeral from "../../../../components/FormGeral/FormGeral";
import Input from "../../../../components/Input/Input";

const EditarPlantioSementes = ({ isOpen, onSalvar, onCancelar, plantio }) => {
  // 1. Estado alinhado com o DTO do Java (nomes exatos)
  const [formData, setFormData] = useState({
    lote: '',
    nomePopular: '', // Apenas para exibição (não é salvo no update)
    qtdSemente: 0,   // ✅ Corrigido (era qntdSementes)
    dataPlantio: '',
    tipoPlantio: '',
    quantidadePlantada: 0, // ✅ Corrigido (era qntdPlantada)
  });

  useEffect(() => {
    if (plantio) {
      // Função auxiliar: dd/MM/yyyy (Back) -> yyyy-MM-dd (Input)
      const formatarDataInput = (dataStr) => {
          if (!dataStr) return '';
          if (dataStr.includes('/')) {
             const parts = dataStr.split('/');
             return `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
          return dataStr;
      };

      // Função para converter "Sementeira" -> "SEMENTEIRA"
      const converterTipoPlantio = (valor) => {
          if (!valor) return '';
          // Se já for maiúsculo (SEMENTEIRA), retorna. Se for descritivo (Sementeira), converte.
          const mapa = {
              'Sementeira': 'SEMENTEIRA',
              'Saquinho': 'SAQUINHO',
              'Chão': 'CHAO',
              'Chao': 'CHAO'
          };
          return mapa[valor] || valor.toUpperCase();
      };

      // 2. Mapeamento Backend -> State
      setFormData({
        lote: plantio.lote || '',
        
        // Backend envia 'nomePopularSemente' na listagem
        nomePopular: plantio.nomePopularSemente || plantio.nomePopular || '', 
        
        // Backend envia 'qtdSemente'
        qtdSemente: plantio.qtdSemente || plantio.qntdSementes || 0,
        
        dataPlantio: formatarDataInput(plantio.dataPlantio),
        
        // Converte a descrição que vem da tabela para o ENUM que o select espera
        tipoPlantio: converterTipoPlantio(plantio.tipoPlantioDescricao || plantio.tipoPlantio),
        
        // Backend envia 'quantidadePlantada'
        quantidadePlantada: plantio.quantidadePlantada || plantio.qntdPlantada || 0,
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
    // 3. Envio Limpo (O Service cuidará da formatação de data)
    const dadosSalvos = {
      id: plantio.id, // ID original
      ...formData,    // Dados com chaves corretas (qtdSemente, quantidadePlantada)
    };

    onSalvar(dadosSalvos);
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handlers do Stepper
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

  if (!isOpen) {
    return null;
  }

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
            name="qtdSemente"
            type="number"
            value={formData.qtdSemente} // Nome corrigido
            onChange={handleChange('qtdSemente')}
            onIncrement={handleIncrement('qtdSemente')}
            onDecrement={handleDecrement('qtdSemente')}
            required={true}
          />

          <Input
            label="Qtd plantada (und)"
            name="quantidadePlantada"
            type="number"
            value={formData.quantidadePlantada} // Nome corrigido
            onChange={handleChange('quantidadePlantada')}
            onIncrement={handleIncrement("quantidadePlantada")}
            onDecrement={handleDecrement("quantidadePlantada")}
            required={true}
          />

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