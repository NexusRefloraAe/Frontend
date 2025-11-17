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
            setFormData({
                lote: teste.lote || '',
                nomePopular: teste.nomePopular || '',
                dataTeste: teste.dataTeste ? teste.dataTeste.split('/').reverse().join('-') : '',
                quantidade: teste.quantidade || 0,
                camaraFria: teste.camaraFria || '',
                dataGerminacao: teste.dataGerminacao ? teste.dataGerminacao.split('/').reverse().join('-') : '',
                qntdGerminou: teste.qntdGerminou || 0,
                taxaGerminou: teste.taxaGerminou || '',
            });
        }
    }, [teste]);

    const handleCancel = (confirmar = true) => {
        if (confirmar) {
            if (window.confirm('Deseja cancelar? As alterações não salvas serão perdidas.')) {
                onCancelar(); // Chama a função do 'Historico.jsx'
            }
        } else {
            onCancelar();
        }
    };

    const handleSubmit = () => {
        // 3. Formata os dados de volta e chama onSalvar
        const dadosSalvos = {
            ...teste, // Mantém dados originais (como 'id')
            ...formData, // Sobrescreve com dados do form
            // Mapeia de volta para os nomes de chave originais (com letra maiúscula)   
            lote: formData.lote,
            nomePopular: formData.nomePopular,
            dataTeste: formData.dataTeste.split('-').reverse().join('/'),
            quantidade: formData.quantidade,
            camaraFria: formData.camaraFria,
            dataGerminacao: formData.dataGerminacao.split('-').reverse().join('/'),
            qntdGerminou: formData.qntdGerminou,
            taxaGerminou: formData.taxaGerminou,
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


    // 4. Ações do formulário ajustadas para o modal
    const actions = [
        {
            type: 'button',
            variant: 'action-secondary',
            children: 'Cancelar',
            onClick: () => handleCancel(true), // Apenas fecha o modal
        },
        {
            type: 'submit',
            variant: 'primary',
            children: 'Salvar Edições', // Novo texto
        },

    ];

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={() => handleCancel(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                {/* Botão de fechar (opcional, mas bom para modais) */}
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
                        type="text"
                        value={formData.lote}
                        onChange={handleChange('lote')}
                        required = {true }
                    />
                    <Input
                        label="Nome Popular"
                        type="text"
                        value={formData.nomePopular}
                        onChange={handleChange('nomePopular')}
                        required = {true }
                    />
                    <Input
                        label="Data do Teste"
                        type="date"
                        value={formData.dataTeste}
                        onChange={handleChange('dataTeste')}
                        required = {true }
                    />
                    <Input
                        label="Quantidade"
                        type="text"
                        value={formData.quantidade}
                        onChange={handleChange('quantidade')}
                        required = {true}
                    />
                    <Input
                        label="Câmara Fria"
                        type="text"
                        value={formData.camaraFria}
                        onChange={handleChange('camaraFria')}
                        required = {true }
                    />
                    <Input
                        label="Data Germinação"
                        type="date"
                        value={formData.dataGerminacao}
                        onChange={handleChange('dataGerminacao')}
                        required = {true }
                    />
                    <Input
                        label="Qntd Germinou (und)"
                        type="number"
                        value={formData.qntdGerminou}
                        onChange={handleChange('qntdGerminou')}
                        onIncrement={handleIncrement('qntdGerminou')}
                        onDecrement={handleDecrement('qntdGerminou')}
                        required = {true }
                    />
                    <Input
                        label="Taxa Germinou %"
                        type="text"
                        value={formData.taxaGerminou}
                        onChange={handleChange('taxaGerminou')}
                        required = {true }
                    />
                </FormGeral>
            </div>
        </div>

    );
};
export default EditarTeste;

