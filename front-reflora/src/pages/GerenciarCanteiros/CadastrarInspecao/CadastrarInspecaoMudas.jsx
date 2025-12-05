import React, { useState } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input';

const CadastrarInspecaoMudas = () => {
    // 3. Atualizar o estado inicial para os campos da imagem
    const [formData, setFormData] = useState({
        lote: '',
        nomePopular: '',
        dataInspecao: '',
        tratosCulturais: '',
        estadoSaude: '',
        pragasDoencas: '',
        estimativaMudasProntas: 0, // Iniciar como número
        nomeResponsavel: '',
        observacoes: '',
    });

    const handleCancel = (confirmar = true) => {
        const resetForm = () => {
            // 4. Atualizar o reset para o novo estado
            setFormData({
                lote: '',
                nomePopular: '',
                dataInspecao: '',
                tratosCulturais: '',
                estadoSaude: '',
                pragasDoencas: '',
                estimativaMudasProntas: 0,
                nomeResponsavel: '',
                observacoes: '',
            });
        };

        if (confirmar) {
            if (window.confirm('Deseja cancelar? As alterações não salvas serão perdidas.')) {
                resetForm();
            }
        } else {
            resetForm();
        }
    };

    // Handler 'onChange' genérico (reutilizado)
    const handleChange = (field) => (e) => {
        const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        // e.preventDefault() já é tratado no FormGeral
        console.log('Dados da Inspeção de Mudas:', formData);
        alert('Inspeção salva com sucesso!'); // 5. Mensagem atualizada
        handleCancel(false);
    };

    // Handlers do Stepper (reutilizados)
    const handleIncrement = (field) => () => {
        setFormData((prev) => ({ ...prev, [field]: prev[field] + 1 }));
    };

    const handleDecrement = (field) => () => {
        setFormData((prev) => ({
            ...prev,
            [field]: Math.max(0, prev[field] - 1), // Garante que não seja negativo
        }));
    };

    // 6. Atualizar os botões
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
            children: 'Salvar Inspeção', // Texto do botão da imagem
        },
    ];

    return (
        // 7. Atualizar classe CSS
        <div className="inspecao-mudas-pagina">
            <FormGeral
                title="Cadastrar Inspeção" // 8. Título da imagem
                actions={actions}
                onSubmit={handleSubmit}
                useGrid={true} // Mantido para layout lado a lado
            >
                {/* 9. Campos (Inputs) atualizados conforme a imagem */}

                <Input
                    label="Lote"
                    name="lote"
                    type="select"
                    value={formData.lote}
                    onChange={handleChange('lote')}
                    required={true}
                    placeholder="Selecione o Lote"
                    options={[
                        { value: 'A001', label: 'A001' },
                        { value: 'A002', label: 'A002' },
                        { value: 'B001', label: 'B001' },
                    ]}
                />

                <Input
                    label="Nome Popular"
                    name="nomePopular"
                    type="select"
                    value={formData.nomePopular}
                    onChange={handleChange('nomePopular')}
                    required={true}
                    placeholder="Selecione a espécie"
                    options={[
                        { value: 'ipe_amarelo', label: 'Ipê-amarelo' },
                        { value: 'pau_brasil', label: 'Pau-brasil' },
                        { value: 'sibipiruna', label: 'Sibipiruna' },
                    ]}
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
                    placeholder="Selecione os tratos"
                    options={[
                        { value: 'adubacao_regacao', label: 'Adubação, Regação' },
                        { value: 'adubacao', label: 'Apenas Adubação' },
                        { value: 'regacao', label: 'Apenas Regação' },
                        { value: 'nenhum', label: 'Nenhum' },
                    ]}
                />

                <Input
                    label="Estado de Saúde"
                    name="estadoSaude"
                    type="select"
                    value={formData.estadoSaude}
                    onChange={handleChange('estadoSaude')}
                    required={true}
                    placeholder="Selecione o estado"
                    options={[
                        { value: 'boa', label: 'Boa' },
                        { value: 'regular', label: 'Regular' },
                        { value: 'ruim', label: 'Ruim' },
                    ]}
                />

                <Input
                    label="Pragas/Doenças"
                    name="pragasDoencas"
                    type="select"
                    value={formData.pragasDoencas}
                    onChange={handleChange('pragasDoencas')}
                    required={true}
                    placeholder="Selecione"
                    options={[
                        { value: 'nenhuma', label: 'Nenhuma' },
                        { value: 'formigas', label: 'Formigas' },
                        { value: 'fungos', label: 'Fungos' },
                        { value: 'outros', label: 'Outros' },
                    ]}
                />

                <Input
                    label="Estimativa de Mudas Prontas"
                    name="estimativaMudasProntas"
                    type="number"
                    value={formData.estimativaMudasProntas}
                    onChange={handleChange('estimativaMudasProntas')}
                    required={true}
                    // Apontar os handlers para o campo correto
                    onIncrement={handleIncrement('estimativaMudasProntas')}
                    onDecrement={handleDecrement('estimativaMudasProntas')}
                />

                <Input
                    label="Nome Responsável"
                    name="nomeResponsavel"
                    type="select"
                    value={formData.nomeResponsavel}
                    onChange={handleChange('nomeResponsavel')}
                    required={true}
                    placeholder="Selecione o responsável"
                    options={[
                        { value: 'resp_1', label: 'Responsável 1 (XXXX)' },
                        { value: 'resp_2', label: 'Responsável 2 (YYYY)' },
                    ]}
                />

                {/* Campo de Observações ocupando 2 colunas */}
                <div className="form-geral__campo--span-2">
                    <Input
                        label="Observações"
                        name="observacoes"
                        type="textarea" // Usar 'textarea' para campo de texto longo
                        value={formData.observacoes}
                        onChange={handleChange('observacoes')}
                        placeholder="Insira observações adicionais..."
                    />
                </div>

            </FormGeral>
        </div>
    );
};

export default CadastrarInspecaoMudas;