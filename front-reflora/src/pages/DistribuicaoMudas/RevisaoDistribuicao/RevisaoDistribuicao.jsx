import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input';
import ResumoMudas from '../../../components/ResumoMudas/ResumoMudas';
import './RevisaoDistribuicao.css';

const optionsResponsaveis = [
    { value: 'MARCELO', label: 'Marcelo' },
    { value: 'THAIGO FARIAS', label: 'Thaigo Farias' },
];
const optionsInstituicoes = [
    { value: 'SEMAS', label: 'SEMAS' },
    { value: 'OUTRA', label: 'Outra' },
];


const RevisaoDistribuicao = () => {
    const navigate = useNavigate();

    const getInitialState = () => ({
        responsavelDistribuicao: 'MARCELO',
        dataEntrega: '',
        responsavelRecebimento: 'THAIGO FARIAS',
        instituicao: 'SEMAS',
        estadoSede: 'PB',          // Mantém o estado pré-selecionado
        cidadeSede: '',            // Começa vazio
        estadoDistribuicao: 'PB',  // Mantém o estado pré-selecionado
        cidadeDistribuicao: '',    // Começa vazio
    });

    const [formData, setFormData] = useState(getInitialState());

    // States da API
    const [estados, setEstados] = useState([]);
    const [cidadesSede, setCidadesSede] = useState([]);
    const [cidadesDistribuicao, setCidadesDistribuicao] = useState([]);

    // States de Loading
    const [loadingEstados, setLoadingEstados] = useState(true);
    const [loadingCidadesSede, setLoadingCidadesSede] = useState(false);
    const [loadingCidadesDistribuicao, setLoadingCidadesDistribuicao] = useState(false);

    // Efeito 1: Buscar Estados (UFs)
    useEffect(() => {
        setLoadingEstados(true);
        fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
            .then(res => res.json())
            .then(data => {
                const estadosFormatados = data.map(estado => ({
                    value: estado.sigla,
                    label: estado.nome
                }));
                setEstados(estadosFormatados);
            })
            .catch(error => {
                console.error("FALHA AO BUSCAR ESTADOS (API IBGE):", error);
            })
            .finally(() => setLoadingEstados(false));
    }, []);

    // Efeito 2: Buscar Cidades da Sede
    useEffect(() => {
        if (!formData.estadoSede) {
            setCidadesSede([]);
            return;
        }
        
        setLoadingCidadesSede(true);
        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.estadoSede}/municipios?orderBy=nome`)
            .then(res => res.json())
            .then(data => {
                const cidadesFormatadas = data.map(cidade => ({
                    value: cidade.nome,
                    label: cidade.nome
                }));
                setCidadesSede(cidadesFormatadas);
            })
            .catch(error => {
                console.error("FALHA AO BUSCAR CIDADES DA SEDE:", error);
            })
            .finally(() => setLoadingCidadesSede(false));

    }, [formData.estadoSede]);

    // Efeito 3: Buscar Cidades de Distribuição
    useEffect(() => {
        if (!formData.estadoDistribuicao) {
            setCidadesDistribuicao([]);
            return;
        }

        setLoadingCidadesDistribuicao(true);
        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.estadoDistribuicao}/municipios?orderBy=nome`)
            .then(res => res.json())
            .then(data => {
                const cidadesFormatadas = data.map(cidade => ({
                    value: cidade.nome,
                    label: cidade.nome
                }));
                setCidadesDistribuicao(cidadesFormatadas);
            })
            .catch(error => {
                console.error("FALHA AO BUSCAR CIDADES DE DISTRIBUIÇÃO:", error);
            })
            .finally(() => setLoadingCidadesDistribuicao(false));

    }, [formData.estadoDistribuicao]);

    // Dados das mudas (exemplo)
    const mudasDoPedido = [
        { nome: 'Ipê-branco', quantidade: 4000 },
        { nome: 'Ipê-Amarelo', quantidade: 3000 },
        { nome: 'Ipê-Roxo', quantidade: 4000 },
    ];
    const totalMudas = mudasDoPedido.reduce((acc, muda) => acc + muda.quantidade, 0);

    // Handlers
    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleEstadoChange = (estadoField, cidadeField) => (e) => {
        const novoEstado = e.target.value;
        setFormData(prev => ({
            ...prev,
            [estadoField]: novoEstado,
            [cidadeField]: ''
        }));
    };

    const handleCancel = (confirmar = true) => {
        if (confirmar) {
            if (window.confirm('Deseja cancelar? As alterações não salvas serão perdidas.')) {
                 navigate(-1);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Botão "Gerar Termo" clicado. Navegando para /termo-compromisso');
        
        navigate('/termo-compromisso', {
            state: {
                dadosRevisao: formData,
                mudas: mudasDoPedido,
                totalMudas: totalMudas
            }
        });
    };

    const actions = [
        { type: 'button', variant: 'action-secondary', children: 'Cancelar', onClick: () => handleCancel(true) },
        { type: 'submit', variant: 'primary', children: 'Gerar Termo' },
    ];

    return (
        <div className="revisao-distribuicao-pagina">
            <FormGeral
                title="Revisao da Distribuição de Mudas"
                actions={actions}
                onSubmit={handleSubmit} // Chama a função handleSubmit acima
                useGrid={true}
            >
                
                <p className="form-geral__campo--span-2 revisao-distribuicao__description">
                    Confira as mudas do pedido e preencha as informações da distribuição.
                </p>
                <div className="form-geral__campo--span-2">
                    <ResumoMudas mudas={mudasDoPedido} total={totalMudas} />
                </div>

                <Input
                    label="Responsável pela Distribuição"
                    name="responsavelDistribuicao"
                    type="select"
                    value={formData.responsavelDistribuicao}
                    onChange={handleChange('responsavelDistribuicao')}
                    options={optionsResponsaveis}
                />

                <Input
                    label="Data de Entrega"
                    name="dataEntrega"
                    type="date"
                    value={formData.dataEntrega}
                    onChange={handleChange('dataEntrega')}
                />

                <Input
                    label="Responsável pelo recebimento"
                    name="responsavelRecebimento"
                    type="select"
                    value={formData.responsavelRecebimento}
                    onChange={handleChange('responsavelRecebimento')}
                    options={optionsResponsaveis}
                    placeholder="Selecione o responsável"
                />

                <Input
                    label="Instituição"
                    name="instituicao"
                    type="select"
                    value={formData.instituicao}
                    onChange={handleChange('instituicao')}
                    options={optionsInstituicoes}
                    placeholder="Selecione a instituição"
                />

                {/* --- Localização da Sede (API IBGE) --- */}
                <Input
                    label="Estado da Sede"
                    name="estadoSede"
                    type="select"
                    value={formData.estadoSede}
                    onChange={handleEstadoChange('estadoSede', 'cidadeSede')}
                    options={estados}
                    loading={loadingEstados}
                    placeholder="Selecione o estado..."
                    // required={true} REMOVIDO
                />

                <Input
                    label="Município da Sede"
                    name="cidadeSede"
                    type="select"
                    value={formData.cidadeSede}
                    onChange={handleChange('cidadeSede')}
                    options={cidadesSede}
                    loading={loadingCidadesSede}
                    disabled={!formData.estadoSede}
                    placeholder="Selecione a cidade..."
                />

                {/* --- Localização da Distribuição (API IBGE) --- */}
                <Input
                    label="Estado de Distribuição"
                    name="estadoDistribuicao"
                    type="select"
                    value={formData.estadoDistribuicao}
                    onChange={handleEstadoChange('estadoDistribuicao', 'cidadeDistribuicao')}
                    options={estados}
                    loading={loadingEstados}
                    placeholder="Selecione o estado..."
                />

                <Input
                    label="Município de Distribuição"
                    name="cidadeDistribuicao"
                    type="select"
                    value={formData.cidadeDistribuicao}
                    onChange={handleChange('cidadeDistribuicao')}
                    options={cidadesDistribuicao}
                    loading={loadingCidadesDistribuicao}
                    disabled={!formData.estadoDistribuicao}
                    placeholder="Selecione a cidade..."
                />
                
            </FormGeral>
        </div>
    );
};

export default RevisaoDistribuicao;