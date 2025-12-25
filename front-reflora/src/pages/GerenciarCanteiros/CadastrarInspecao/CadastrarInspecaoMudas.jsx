import React, { useState, useEffect } from 'react';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input';
import { plantioService } from '../../../services/plantioService';
import { inspecaoService } from '../../../services/inspecaoMudaService';

const CadastrarInspecaoMudas = () => {

    const [lotesDisponiveis, setLotesDisponiveis] = useState([]);
    const [canteirosDisponiveis, setCanteirosDisponiveis] = useState([]);
    const [loading, setLoading] = useState(false);

    // 3. Atualizar o estado inicial para os campos da imagem
    const [formData, setFormData] = useState({
        lote: '',
        nomePopular: '',
        nomeCanteiro:'',
        dataInspecao: '',
        tratosCulturais: '',
        estadoSaude: '',
        pragasDoencas: '',
        estimativaMudasProntas: 0, // Iniciar como número
        nomeResponsavel: '',
        observacoes: '',
    });

    // 1. Carregar Lotes confirmados ao montar o componente
    useEffect(() => {
        const carregarLotes = async () => {
            const dados = await plantioService.getLotesConfirmados();
            setLotesDisponiveis(dados);
        };
        carregarLotes();
    }, []);

    // 2. Quando o Lote mudar, busca o Nome Popular e os Canteiros vinculados
    const handleLoteChange = async (loteSelecionado) => {
        const infoLote = lotesDisponiveis.find(item => item.loteMuda === loteSelecionado);
        
        setFormData(prev => ({
            ...prev,
            lote: loteSelecionado,
            nomePopular: infoLote ? infoLote.nomePopular : '',
            nomeCanteiro: '' // Reseta o canteiro ao mudar o lote
        }));

        if (loteSelecionado) {
            const canteiros = await inspecaoService.getCanteirosPorLote(loteSelecionado);
            setCanteirosDisponiveis(canteiros.map(c => ({ value: c, label: c })));
        }
    };

    const handleCancel = (confirmar = true) => {
        const resetForm = () => {
            // 4. Atualizar o reset para o novo estado
            setFormData({
                lote: '',
                nomeCanteiro:'',
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
        const value = e.target.value;
        if (field === 'lote') {
            handleLoteChange(value);
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await inspecaoService.create(formData);
            alert('Inspeção salva com sucesso!');
            handleCancel(false);
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar inspeção: ' + (error.response?.data?.message || 'Erro desconhecido'));
        } finally {
            setLoading(false);
        }
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
                isLoading={loading}
            >
                {/* 9. Campos (Inputs) atualizados conforme a imagem */}

                <Input
                    label="Lote"
                    name="lote"
                    type="select"
                    value={formData.lote}
                    onChange={handleChange('lote')}
                    required={true}
                    options={lotesDisponiveis.map(l => ({ value: l.loteMuda, label: l.loteMuda }))}
                    placeholder="Selecione o Lote"
                />

                <Input
                    label="Nome Popular (Espécie)"
                    name="nomePopular"
                    type="text"
                    placeholder="Preenchido automaticamente"
                    value={formData.nomePopular}
                    readOnly={true} // Campo automático
                    disabled={true}
                />

                <Input
                    label="Canteiro Localizado"
                    name="nomeCanteiro"
                    type="select"
                    value={formData.nomeCanteiro}
                    onChange={handleChange('nomeCanteiro')}
                    required={true}
                    options={canteirosDisponiveis}
                    disabled={!formData.lote}
                    placeholder={formData.lote ? "Selecione o canteiro" : "Selecione um lote primeiro"}
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
                    placeholder="Selecione o estado"
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
                    name="pragasDoencas"
                    type="select"
                    value={formData.pragasDoencas}
                    onChange={handleChange('pragasDoencas')}
                    required={true}
                    placeholder="Selecione o estado de saúde"
                    options={[
                        { value: 'Nenhuma', label: 'Nenhuma' },
                        { value: 'Formigas', label: 'Formigas' },
                        { value: 'Fungos', label: 'Fungos' },
                        { value: 'Outros', label: 'Outros' },
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

                {/* Campo de Nome Responsável ocupando 2 colunas */}
                <div className="form-geral__campo--span-2">
                    <Input
                        label="Nome Responsável"
                        name="nomeResponsavel"
                        type="text"
                        value={formData.nomeResponsavel}
                        onChange={handleChange('nomeResponsavel')}
                        required={true}
                        placeholder="Informe o nome do responsável"
                    />
                </div>

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