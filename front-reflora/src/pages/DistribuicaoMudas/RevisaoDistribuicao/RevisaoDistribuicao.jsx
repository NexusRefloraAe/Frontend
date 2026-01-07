import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormGeral from '../../../components/FormGeral/FormGeral';
import Input from '../../../components/Input/Input';
import ResumoMudas from '../../../components/ResumoMudas/ResumoMudas';
import './RevisaoDistribuicao.css'; 

const RevisaoDistribuicao = () => {
    const navigate = useNavigate();

    const getInitialState = () => ({
        responsavelDistribuicao: '', 
        dataEntrega: '',
        responsavelRecebimento: '',  
        instituicao: '',             
        estadoSede: 'PB',           
        cidadeSede: '',           
        estadoDistribuicao: 'PB',  
        cidadeDistribuicao: '',   
    });

    const [formData, setFormData] = useState(getInitialState());

    // States da API IBGE
    const [estados, setEstados] = useState([]);
    const [cidadesSede, setCidadesSede] = useState([]);
    const [cidadesDistribuicao, setCidadesDistribuicao] = useState([]);
    const [loadingEstados, setLoadingEstados] = useState(true);
    const [loadingCidadesSede, setLoadingCidadesSede] = useState(false);
    const [loadingCidadesDistribuicao, setLoadingCidadesDistribuicao] = useState(false);

    // --- Buscas na API do IBGE ---
    useEffect(() => {
        setLoadingEstados(true);
        fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
            .then(res => res.json())
            .then(data => setEstados(data.map(e => ({ value: e.sigla, label: e.nome }))))
            .catch(e => console.error(e))
            .finally(() => setLoadingEstados(false));
    }, []);

    useEffect(() => {
        if (!formData.estadoSede) { setCidadesSede([]); return; }
        setLoadingCidadesSede(true);
        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.estadoSede}/municipios?orderBy=nome`)
            .then(res => res.json())
            .then(data => setCidadesSede(data.map(c => ({ value: c.nome, label: c.nome }))))
            .catch(e => console.error(e))
            .finally(() => setLoadingCidadesSede(false));
    }, [formData.estadoSede]);

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

    // Botões manuais para ter controle total do layout
    const actions = [];

    return (
        <div className="revisao-distribuicao-pagina">
            
            <div className="content-revisao">
                <FormGeral
                    title="Revisão da Distribuição de Mudas"
                    actions={actions}
                    onSubmit={handleSubmit}
                    useGrid={true}
                >
                    <p className="form-geral__campo--span-2 revisao-distribuicao__description">
                        Confira as mudas do pedido e preencha as informações da distribuição.
                    </p>
                    
                    {/* Resumo ocupa largura total */}
                    <div className="form-geral__campo--span-2">
                        <ResumoMudas mudas={mudasDoPedido} total={totalMudas} />
                    </div>

                    {/* --- PAR 1: Responsável e Data --- */}
                    <Input
                        label="Responsável pela Distribuição"
                        name="responsavelDistribuicao"
                        type="text" 
                        value={formData.responsavelDistribuicao}
                        onChange={handleChange('responsavelDistribuicao')}
                        placeholder="Digite o nome do responsável"
                    />

                    <Input
                        label="Data de Entrega"
                        name="dataEntrega"
                        type="date"
                        value={formData.dataEntrega}
                        onChange={handleChange('dataEntrega')}
                    />

                    {/* --- PAR 2: Recebimento e Instituição --- */}
                    <Input
                        label="Responsável pelo recebimento"
                        name="responsavelRecebimento"
                        type="text"
                        value={formData.responsavelRecebimento}
                        onChange={handleChange('responsavelRecebimento')}
                        placeholder="Digite quem irá receber"
                    />

                    <Input
                        label="Instituição"
                        name="instituicao"
                        type="text"
                        value={formData.instituicao}
                        onChange={handleChange('instituicao')}
                        placeholder="Nome da instituição"
                    />

                    {/* --- LOCALIZAÇÃO (Ocupa largura total, dividido internamente) --- */}
                    <div className="grupo-selects-grid-2">
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
                    </div>

                    {/* Botões manuais para garantir alinhamento */}
                    <div className="form-geral__campo--span-2 revisao-actions-container">
                        <button type="button" onClick={handleCancel}>Cancelar</button>
                        <button type="submit">Gerar Termo</button>
                    </div>

                </FormGeral>
            </div>
        </div>
    );
};

export default RevisaoDistribuicao;