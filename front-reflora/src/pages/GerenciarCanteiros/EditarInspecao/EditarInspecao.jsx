import React, { useState, useEffect } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input';
import './EditarInspecao.css'; // Vamos criar este CSS para o modal

const formatarDataParaInput = (dataDDMMYYYY) => {
    if (!dataDDMMYYYY) return '';
    const parts = dataDDMMYYYY.split('/');
    if (parts.length === 3) {
        // [DD, MM, YYYY] -> YYYY-MM-DD
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return ''; 
};

const EditarInspecao = ({ isOpen, onClose, onSalvar, inspecao }) => {
    const [formData, setFormData] = useState({
        id: '',
        loteMuda: '',
        nomePopular: '',
        nomeCanteiro: '',
        dataInspecao: '',
        tratosCulturais: '',
        estadoSaude: '',
        doencasPragas: '',
        estimativaMudasProntas: 0,
        nomeResponsavel: '',
        observacao: '',
    });

    useEffect(() => {
        if (inspecao) {
            setFormData({
                id: inspecao.id,
                loteMuda: inspecao.loteMuda || '',
                nomePopular: inspecao.nomePopular || '',
                nomeCanteiro: inspecao.nomeCanteiro || '',
                dataInspecao: formatarDataParaInput(inspecao.dataInspecao),
                tratosCulturais: inspecao.tratosCulturais || '',
                estadoSaude: inspecao.estadoSaude || '',
                doencasPragas: inspecao.doencasPragas || '',
                estimativaMudasProntas: inspecao.estimativaMudasProntas || 0,
                nomeResponsavel: inspecao.nomeResponsavel || '',
                observacao: inspecao.observacao || '',
            });
        }
    }, [inspecao]);

    if (!isOpen) {
        return null;
    }

    const handleChange = (field) => (e) => {
        const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        // Envia o formData completo para o componente pai salvar na API
        onSalvar(formData);
    }

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
            onClick: onClose, // Apenas fecha o modal
        },
        {
            type: 'submit',
            variant: 'primary',
            children: 'Salvar Edições', // Novo texto
        },
    ];

    return (
        // 5. Estrutura do Modal
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                
                {/* Botão de fechar (opcional, mas bom para modais) */}
                <button type="button" className="modal-close-button" onClick={onClose}>
                    &times; 
                </button>

                <FormGeral
                    title="Editar Inspeção" // Título do Modal
                    actions={actions}
                    onSubmit={handleSubmit}
                    useGrid={true}
                >
                    {/* Campos do Formulário */}
                    {/* Os 'options' dos selects devem ser os mesmos do cadastro */}

                    <Input
                        label="Lote"
                        value={formData.loteMuda}
                        disabled={true}
                        
                    />

                    <Input
                        label="Nome Popular"
                        value={formData.nomePopular}
                        disabled={true} 
                    />

                    <Input 
                        label="Canteiro" 
                        value={formData.nomeCanteiro} 
                        disabled={true} 
                    />

                    <Input
                        label="Data da Inspeção"
                        name="dataInspecao"
                        type="date"
                        value={formData.dataInspecao}
                        onChange={handleChange('dataInspecao')}
                        required={true}
                    />

                    <Input
                        label="Tratos Culturais"
                        name="tratosCulturais"
                        type="select"
                        value={formData.tratosCulturais}
                        onChange={handleChange('tratosCulturais')}
                        required={true}  
                        options={[
                            { value: 'Adubação e Regação', label: 'Adubação, Regação' },
                            { value: 'Adubação', label: 'Apenas Adubação' },
                            { value: 'Regação', label: 'Apenas Regação' },
                            { value: 'Nenhum', label: 'Nenhum' },
                        ]}
                    />

                    <Input
                        label="Estado de Saúde"
                        name="estadoSaude"
                        type="select"
                        value={formData.estadoSaude}
                        onChange={handleChange('estadoSaude')}
                        required={true}
                        options={[
                            { value: 'Ótima', label: 'Ótima' },
                            { value: 'Boa', label: 'Boa' },
                            { value: 'Regular', label: 'Regular' },
                            { value: 'Ruim', label: 'Ruim' },
                            { value: 'Péssima', label: 'Péssima' },
                            { value: 'Em tratamento', label: 'Em tratamento' },
                        ]}
                    />

                    <Input
                        label="Pragas/Doenças"
                        name="doencasPragas"
                        type="select"
                        value={formData.doencasPragas}
                        onChange={handleChange('doencasPragas')}
                        required={true}
                        options={[
                            { value: 'Nenhuma', label: 'Nenhuma' },
                            { value: 'Formigas', label: 'Formigas' },
                            { value: 'Fungos', label: 'Fungos' },
                            { value: 'Outros', label: 'Outros' },
                        ]}
                    />

                    {/* Campo 'Qntd' (baseado no 'estimativaMudasProntas') */}
                    <Input
                        label="Quantidade"
                        name="estimativaMudasProntas"
                        type="number"
                        value={formData.estimativaMudasProntas}
                        onChange={handleChange('estimativaMudasProntas')}
                        required={true}
                        onIncrement={handleIncrement('estimativaMudasProntas')}
                        onDecrement={handleDecrement('estimativaMudasProntas')}
                    />

                    {/* Campo de Observações (ocupa 2 colunas) */}
                    <div className="form-geral__campo--span-2">
                        <Input
                            label="Observações"
                            name="observacao"
                            type="textarea"
                            value={formData.observacao}
                            onChange={handleChange('observacao')}
                            placeholder="Insira observações adicionais..."
                        />
                    </div>

                </FormGeral>
            </div>
        </div>
    );
};

export default EditarInspecao;