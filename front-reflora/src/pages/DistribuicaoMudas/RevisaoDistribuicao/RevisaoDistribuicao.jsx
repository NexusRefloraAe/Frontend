import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input';
import ResumoMudas from '../../../components/ResumoMudas/ResumoMudas';

// --- AQUI ESTÁ A MÁGICA ---
// Certifique-se de que o nome do arquivo aqui é IDÊNTICO ao que você criou
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
        estadoSede: 'PB',          
        cidadeSede: '',           
        estadoDistribuicao: 'PB',  
        cidadeDistribuicao: '',   
    });

    const [formData, setFormData] = useState(getInitialState());

    // States da API
    const [estados, setEstados] = useState([]);
    const [cidadesSede, setCidadesSede] = useState([]);
    const [cidadesDistribuicao, setCidadesDistribuicao] = useState([]);
    
    // States Loading
    const [loadingEstados, setLoadingEstados] = useState(true);
    const [loadingCidadesSede, setLoadingCidadesSede] = useState(false);
    const [loadingCidadesDistribuicao, setLoadingCidadesDistribuicao] = useState(false);

    // --- (Mantive seus useEffects iguais para economizar espaço, eles estão corretos) ---
    // Buscar Estados
    useEffect(() => {
        setLoadingEstados(true);
        fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
            .then(res => res.json())
            .then(data => setEstados(data.map(e => ({ value: e.sigla, label: e.nome }))))
            .catch(e => console.error(e))
            .finally(() => setLoadingEstados(false));
    }, []);

    // Buscar Cidades Sede
    useEffect(() => {
        if (!formData.estadoSede) { setCidadesSede([]); return; }
        setLoadingCidadesSede(true);
        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.estadoSede}/municipios?orderBy=nome`)
            .then(res => res.json())
            .then(data => setCidadesSede(data.map(c => ({ value: c.nome, label: c.nome }))))
            .catch(e => console.error(e))
            .finally(() => setLoadingCidadesSede(false));
    }, [formData.estadoSede]);

    // Buscar Cidades Distribuicao
    useEffect(() => {
        if (!formData.estadoDistribuicao) { setCidadesDistribuicao([]); return; }
        setLoadingCidadesDistribuicao(true);
        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.estadoDistribuicao}/municipios?orderBy=nome`)
            .then(res => res.json())
            .then(data => setCidadesDistribuicao(data.map(c => ({ value: c.nome, label: c.nome }))))
            .catch(e => console.error(e))
            .finally(() => setLoadingCidadesDistribuicao(false));
    }, [formData.estadoDistribuicao]);

    const mudasDoPedido = [
        { nome: 'Ipê-branco', quantidade: 4000 },
        { nome: 'Ipê-Amarelo', quantidade: 3000 },
        { nome: 'Ipê-Roxo', quantidade: 4000 },
    ];
    const totalMudas = mudasDoPedido.reduce((acc, muda) => acc + muda.quantidade, 0);

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleEstadoChange = (estadoField, cidadeField) => (e) => {
        setFormData(prev => ({
            ...prev,
            [estadoField]: e.target.value,
            [cidadeField]: ''
        }));
    };

    const handleCancel = () => {
        if (window.confirm('Deseja cancelar? As alterações não salvas serão perdidas.')) {
             navigate(-1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/termo-compromisso', {
            state: { dadosRevisao: formData, mudas: mudasDoPedido, totalMudas }
        });
    };

    // Definição das actions
    const actions = [
        { type: 'button', children: 'Cancelar', onClick: handleCancel },
        { type: 'submit', children: 'Gerar Termo' },
    ];

    return (
        // ATENÇÃO: Essa className é fundamental para o CSS funcionar
        <div className="revisao-distribuicao-pagina">
            <FormGeral
                title="Revisão da Distribuição de Mudas"
                actions={actions}
                onSubmit={handleSubmit}
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
                />

                <Input
                    label="Instituição"
                    name="instituicao"
                    type="select"
                    value={formData.instituicao}
                    onChange={handleChange('instituicao')}
                    options={optionsInstituicoes}
                />

                <Input
                    label="Estado da Sede"
                    name="estadoSede"
                    type="select"
                    value={formData.estadoSede}
                    onChange={handleEstadoChange('estadoSede', 'cidadeSede')}
                    options={estados}
                    loading={loadingEstados}
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
                />

                <Input
                    label="Estado de Distribuição"
                    name="estadoDistribuicao"
                    type="select"
                    value={formData.estadoDistribuicao}
                    onChange={handleEstadoChange('estadoDistribuicao', 'cidadeDistribuicao')}
                    options={estados}
                    loading={loadingEstados}
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
                />
            </FormGeral>
        </div>
    );
};

export default RevisaoDistribuicao;