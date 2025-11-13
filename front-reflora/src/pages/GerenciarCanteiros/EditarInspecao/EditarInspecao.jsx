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

const formatarDataParaSalvar = (dataYYYYMMDD) => {
    if (!dataYYYYMMDD) return '';
    const parts = dataYYYYMMDD.split('-');
    if (parts.length === 3) {
        // [YYYY, MM, DD] -> DD/MM/YYYY
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return '';
};

const EditarInspecao = ({ isOpen, onClose, onSalvar, inspecao }) => {
    const [formData, setFormData] = useState({
        lote: '',
        nomePopular: '',
        dataInspecao: '',
        tratosCulturais: '',
        estadoSaude: '',
        pragasDoencas: '',
        qntd: 0, // Campo da tabela é 'Qntd'
        observacoes: '',
    });

    useEffect(() => {
        if (inspecao) {
            setFormData({
                id: inspecao.id, // Manter o ID para a lógica de salvar
                lote: inspecao.Lote || '',
                nomePopular: inspecao.NomePopular || '',
                dataInspecao: formatarDataParaInput(inspecao.DataInspecao), // Formatar data
                tratosCulturais: inspecao.TratosCulturais || '',
                estadoSaude: inspecao.EstadoSaude || '',
                pragasDoencas: inspecao.PragasDoencas || '',
                qntd: inspecao.Qntd || 0, // Usar 'Qntd'
                observacoes: inspecao.Observacoes || '',
            });
        }
    }, [inspecao]); // Dependência: 'inspecao'

    if (!isOpen) {
        return null;
    }

    const handleChange = (field) => (e) => {
        const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        // 3. Formata os dados de volta e chama onSalvar
        const dadosSalvos = {
            ...inspecao, // Mantém dados originais (como 'id')
            ...formData, // Sobrescreve com dados do form
            // Mapeia de volta para os nomes de chave originais (com letra maiúscula)
            Lote: formData.lote,
            NomePopular: formData.nomePopular,
            DataInspecao: formatarDataParaSalvar(formData.dataInspecao), // Formata data
            TratosCulturais: formData.tratosCulturais,
            EstadoSaude: formData.estadoSaude,
            PragasDoencas: formData.pragasDoencas,
            Qntd: formData.qntd,
            Observacoes: formData.observacoes,
        };
        
        onSalvar(dadosSalvos);
        onClose(); // Fecha o modal após salvar
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
                        name="lote"
                        type="text"
                        value={formData.lote}
                        onChange={handleChange('lote')}
                        required={true}
                        options={[ { value: 'A001', label: 'A001' }, /* ...outros... */ ]}
                        
                    />

                    <Input
                        label="Nome Popular"
                        name="nomePopular"
                        type="text"
                        value={formData.nomePopular}
                        onChange={handleChange('nomePopular')}
                        required={true}
                        options={[ { value: 'Ipê-amarelo', label: 'Ipê-amarelo' }, /* ...outros... */ ]}
                        
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
                            { value: 'Regação', label: 'Regação' },
                            { value: 'Adubação', label: 'Adubação' },
                            { value: 'Poda', label: 'Poda' },
                            /* ...outros... */
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
                            { value: 'Boa', label: 'Boa' },
                            { value: 'Em tratamento', label: 'Em tratamento' },
                            { value: 'Ruim', label: 'Ruim' },
                        ]}
                    />

                    <Input
                        label="Pragas/Doenças"
                        name="pragasDoencas"
                        type="select"
                        value={formData.pragasDoencas}
                        onChange={handleChange('pragasDoencas')}
                        required={true}
                        options={[
                            { value: 'Nenhuma', label: 'Nenhuma' },
                            { value: 'Cochonilha', label: 'Cochonilha' },
                            { value: 'Pulgões', label: 'Pulgões' },
                            /* ...outros... */
                        ]}
                    />

                    {/* Campo 'Qntd' (baseado no 'estimativaMudasProntas') */}
                    <Input
                        label="Quantidade"
                        name="qntd"
                        type="number"
                        value={formData.qntd}
                        onChange={handleChange('qntd')}
                        required={true}
                        onIncrement={handleIncrement('qntd')}
                        onDecrement={handleDecrement('qntd')}
                    />

                    {/* Campo de Observações (ocupa 2 colunas) */}
                    <div className="form-geral__campo--span-2">
                        <Input
                            label="Observações"
                            name="observacoes"
                            type="textarea"
                            value={formData.observacoes}
                            onChange={handleChange('observacoes')}
                            placeholder="Insira observações adicionais..."
                        />
                    </div>

                </FormGeral>
            </div>
        </div>
    );
};

export default EditarInspecao;