import { useEffect, useState } from "react";
import FormGeral from "../../FormGeral/FormGeral";
import Input from "../../Input/Input";


const EditarSementes = ({ isOpen, onSalvar, onCancelar, semente }) => {
    
    // --- Novos Estados para o IBGE ---
    const [estados, setEstados] = useState([]);
    const [cidades, setCidades] = useState([]);

    const [formData, setFormData] = useState({
        nome: '',
        nomeCientifico: '',
        familia: '',
        origem: '',
        dataCadastro: '',
        qtdAtual: '',
        unidadeMedida: 'kg',
        // localizacao: '', // Removido
        uf: '',          // Adicionado
        cidade: '',      // Adicionado
        camaraFria: 'nao',
    });

    // 1. Carregar Estados ao montar
    useEffect(() => {
        const fetchEstados = async () => {
            try {
                const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
                const data = await response.json();
                setEstados(data);
            } catch (error) {
                console.error("Erro ao buscar estados:", error);
            }
        };
        if (isOpen) {
            fetchEstados();
        }
    }, [isOpen]);

    // 2. Carregar dados da semente na edição
    useEffect(() => {
        if (semente) {
            setFormData({
                nome: semente.nome || semente.nomePopular || '',
                nomeCientifico: semente.nomeCientifico || '',
                familia: semente.familia || '',
                origem: semente.origem || '',
                dataCadastro: semente.dataCadastro ? semente.dataCadastro.split('/').reverse().join('-') : 
                              (semente.dataDeCadastro ? semente.dataDeCadastro.split('/').reverse().join('-') : ''),
                qtdAtual: semente.qtdAtual || semente.quantidade || '',
                unidadeMedida: semente.unidadeMedida || semente.unidadeDeMedida || 'kg',
                
                // Mapeamento dos novos campos
                uf: semente.uf || '',
                cidade: semente.cidade || '',
                
                camaraFria: semente.camaraFria || (semente.estahNaCamaraFria ? 'sim' : 'nao') || 'nao',
            });
        }
    }, [semente]);

    // 3. Carregar Cidades quando a UF muda (seja pelo usuário ou ao carregar dados iniciais)
    useEffect(() => {
        const fetchCidades = async () => {
            if (formData.uf) {
                try {
                    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.uf}/municipios`);
                    const data = await response.json();
                    setCidades(data);
                } catch (error) {
                    console.error("Erro ao buscar cidades:", error);
                }
            } else {
                setCidades([]);
            }
        };
        fetchCidades();
    }, [formData.uf]);


    const handleCancel = (confirmar = true) => {
        if (confirmar) {
            if (window.confirm('Deseja cancelar? As alterações não salvas serão perdidas.')) {
                onCancelar(); 
            }
        } else {
            onCancelar();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const dadosSalvos = {
            ...semente, 
            ...formData, 
            // Mapeia para o formato esperado pelo serviço/backend
            nomePopular: formData.nome, // Assegurando consistência de nomes
            nome: formData.nome,
            nomeCientifico: formData.nomeCientifico,
            familia: formData.familia,
            origem: formData.origem,
            dataCadastro: formData.dataCadastro.split('-').reverse().join('/'),
            qtdAtual: formData.qtdAtual,
            unidadeMedida: formData.unidadeMedida,
            
            uf: formData.uf,
            cidade: formData.cidade,
            // localizacaoDaColeta: `${formData.cidade} - ${formData.uf}`, // Opcional se o back precisar concatenado
            
            camaraFria: formData.camaraFria,
            estahNaCamaraFria: formData.camaraFria === 'sim'
        };
        onSalvar(dadosSalvos);
    };

    const handleChange = (field) => (e) => {
        const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
        
        setFormData((prev) => {
            const newState = { ...prev, [field]: value };
            // Se mudou UF, limpa a cidade
            if (field === 'uf') {
                newState.cidade = ''; 
            }
            return newState;
        });
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

    // Opções formatadas para o Select
    const optionsEstados = estados.map(e => ({ value: e.sigla, label: e.nome }));
    const optionsCidades = cidades.map(c => ({ value: c.nome, label: c.nome }));

    const formActions = [
        {
            children: 'Cancelar',
            variant: 'action-secondary',
            type: 'button',
            onClick: (e) =>{
                e.preventDefault();
                handleCancel(true);
            } 
        },
        {
            children: 'Salvar alterações',
            variant: 'primary',
            type: 'submit',
        }
    ];

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={() => handleCancel(true)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                <button type="button" className="modal-close-button" onClick={() => handleCancel(true)}>
                    &times;
                </button>

                <FormGeral
                    title="Editar sementes"
                    actions={formActions}
                    onSubmit={handleSubmit}
                    useGrid={true}
                >
                    <Input
                        label="Nome Popular"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange('nome')}
                        required={true}
                    />
                    <Input
                        label="Nome Científico"
                        name="nomeCientifico"
                        value={formData.nomeCientifico}
                        onChange={handleChange('nomeCientifico')}
                    />
                    <Input
                        label="Família"
                        name="familia"
                        value={formData.familia}
                        onChange={handleChange('familia')}
                    />
                    <Input
                        label="Origem"
                        name="origem"
                        value={formData.origem}
                        onChange={handleChange('origem')}
                    />
                    <Input
                        label="Data de Cadastro"
                        name="dataCadastro"
                        type="date"
                        value={formData.dataCadastro}
                        onChange={handleChange('dataCadastro')}
                    />
                    <Input
                        label="Quantidade"
                        name="qtdAtual"
                        type="number"
                        value={formData.qtdAtual}
                        required={true}
                        onChange={handleChange('qtdAtual')}
                        onIncrement={handleIncrement('qtdAtual')}
                        onDecrement={handleDecrement('qtdAtual')}
                    />
                    <Input
                        label="Unidade de Medida"
                        name="unidadeMedida"
                        type="select"
                        value={formData.unidadeMedida}
                        onChange={handleChange('unidadeMedida')}
                        options={[
                            { value: 'KG', label: 'kg' },
                            { value: 'G', label: 'g' },
                            { value: 'UNIDADE', label: 'und' },
                        ]}
                    />

                    {/* --- SUBSTITUIÇÃO DA LOCALIZAÇÃO PELOS SELECTS --- */}
                    <Input
                        label="Estado (UF)"
                        name="uf"
                        type="select"
                        value={formData.uf}
                        onChange={handleChange('uf')}
                        options={optionsEstados}
                        placeholder="Selecione UF"
                    />
                    
                    <Input
                        label="Cidade"
                        name="cidade"
                        type="select"
                        value={formData.cidade}
                        onChange={handleChange('cidade')}
                        options={optionsCidades}
                        placeholder="Selecione Cidade"
                        disabled={!formData.uf}
                    />

                    <Input
                        label="Câmara Fria"
                        name="camaraFria"
                        type="select"
                        value={formData.camaraFria}
                        onChange={handleChange('camaraFria')}
                        options={[
                            { value: 'sim', label: 'Sim' },
                            { value: 'nao', label: 'Não' },
                        ]}
                    />
                </FormGeral>
            </div>
        </div>
    );
}

export default EditarSementes;