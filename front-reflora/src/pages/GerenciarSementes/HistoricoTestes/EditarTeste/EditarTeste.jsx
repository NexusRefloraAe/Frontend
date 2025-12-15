import { useEffect, useState } from "react";
import FormGeral from "../../../../components/FormGeral/FormGeral";
import Input from "../../../../components/Input/Input";

const EditarTeste = ({ isOpen, onSalvar, onCancelar, teste }) => {
    const [formData, setFormData] = useState({
        lote: '',
        nomePopular: '',
        dataTeste: '',
        quantidade: 0,
        camaraFria: '',
        dataGerminacao: '',
        qntdGerminou: 0,
        taxaGerminou: '',
    });

    useEffect(() => {
        if (teste) {
            // Função auxiliar para datas
            // O backend manda dataPlantio como 'yyyy-MM-dd' (padrão LocalDate)
            // Mas manda dataGerminacao como 'dd/MM/yyyy' (formatado no Controller)
            const formatarDataParaInput = (dataStr) => {
                if (!dataStr || dataStr === '-' || dataStr === null) return '';
                
                // Se vier como dd/MM/yyyy, converte para yyyy-MM-dd (HTML Input)
                if (dataStr.includes('/')) {
                    const [dia, mes, ano] = dataStr.split('/');
                    return `${ano}-${mes}-${dia}`;
                }
                // Se já vier como yyyy-MM-dd, retorna igual
                return dataStr;
            };

            setFormData({
                lote: teste.lote || '',
                // ✅ Mapeia as chaves que vêm da Tabela (DTO do Java)
                nomePopular: teste.nomePopularSemente || '', 
                dataTeste: teste.dataPlantio || '', // Backend usa 'dataPlantio' como data genérica
                quantidade: teste.qtdSemente || 0,
                camaraFria: teste.estahNaCamaraFria || 'Não', // Já vem "Sim" ou "Não"
                dataGerminacao: formatarDataParaInput(teste.dataGerminacao),
                qntdGerminou: teste.qtdGerminou || 0,
                taxaGerminou: teste.taxaGerminacao || '',
            });
        }
    }, [teste]);

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
        // ✅ Simplificado! 
        // Não precisamos formatar datas aqui. O 'testeGerminacaoService.update' 
        // fará a conversão para o formato que o Java espera.
        const dadosParaSalvar = {
            id: teste.id, // Mantém o ID original para a rota PUT
            ...formData   // Envia os dados do formulário
        };
        onSalvar(dadosParaSalvar);
    };

    const handleChange = (field) => (e) => {
        const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
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
                    actions={actions}
                    useGrid={true}
                    onSubmit={handleSubmit}
                    title="Editar Teste de Germinação"
                >
                    <Input
                        label="Lote"
                        name="lote"
                        type="text"
                        value={formData.lote}
                        onChange={handleChange('lote')}
                        required={true}
                    />
                    <Input
                        label="Nome Popular"
                        name="nomePopular"
                        type="text"
                        value={formData.nomePopular}
                        onChange={handleChange('nomePopular')}
                        required={true}
                    />
                    <Input
                        label="Data do Teste"
                        type="date"
                        value={formData.dataTeste}
                        onChange={handleChange('dataTeste')}
                        required={true}
                    />
                    <Input
                        label="Quantidade"
                        type="number" // Mudei para number para funcionar com o state
                        value={formData.quantidade}
                        onChange={handleChange('quantidade')}
                        onIncrement={handleIncrement('quantidade')}
                        onDecrement={handleDecrement('quantidade')}
                        required={true}
                    />
                    <Input
                        label="Câmara Fria"
                        type="select" // Select é melhor aqui
                        value={formData.camaraFria}
                        onChange={handleChange('camaraFria')}
                        required={true}
                        options={[
                            { value: 'Sim', label: 'Sim' },
                            { value: 'Não', label: 'Não' }
                        ]}
                    />
                    <Input
                        label="Data Germinação"
                        type="date"
                        value={formData.dataGerminacao}
                        onChange={handleChange('dataGerminacao')}
                        required={false}
                    />
                    <Input
                        label="Qntd Germinou (und)"
                        type="number"
                        value={formData.qntdGerminou}
                        onChange={handleChange('qntdGerminou')}
                        onIncrement={handleIncrement('qntdGerminou')}
                        onDecrement={handleDecrement('qntdGerminou')}
                        required={false}
                    />
                    <Input
                        label="Taxa Germinou %"
                        type="text"
                        value={formData.taxaGerminou}
                        onChange={handleChange('taxaGerminou')}
                        required={false}
                    />
                </FormGeral>
            </div>
        </div>
    );
};

export default EditarTeste;