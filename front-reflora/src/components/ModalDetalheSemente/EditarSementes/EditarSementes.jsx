import { useEffect, useState } from "react";
import FormGeral from "../../FormGeral/FormGeral";
import Input from "../../Input/Input";


const EditarSementes = ({ isOpen, onSalvar, onCancelar, semente }) => {
    const [formData, setFormData] = useState({
        nome: '',
        nomeCientifico: '',
        familia: '',
        origem: '',
        dataCadastro: '',
        qtdAtual: '',
        unidadeMedida: 'kg',
        localizacao: '',
        camaraFria: 'nao',
    });

    useEffect(() => {
        if (semente) {
            setFormData({
                nome: semente.nome || '',
                nomeCientifico: semente.nomeCientifico || '',
                familia: semente.familia || '',
                origem: semente.origem || '',
                dataCadastro: semente.dataCadastro ? semente.dataCadastro.split('/').reverse().join('-') : '',
                qtdAtual: semente.qtdAtual || '',
                unidadeMedida: semente.unidadeMedida || 'kg',
                localizacao: semente.localizacao || '',
                camaraFria: semente.camaraFria || 'nao',
            });
        }
    }, [semente]);
    const handleCancel = (confirmar = true) => {
        if (confirmar) {
            if (window.confirm('Deseja cancelar? As alterações não salvas serão perdidas.')) {
                onCancelar(); // Chama a função do 'ModalDetalheSemente.jsx'
            }
        } else {
            onCancelar();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 3. Formata os dados de volta e chama onSalvar
        const dadosSalvos = {
            ...semente, // Mantém dados originais (como 'id')
            ...formData, // Sobrescreve com dados do form
            // Mapeia de volta para os nomes de chave originais (com letra maiúscula)
            nome: formData.nome,
            nomeCientifico: formData.nomeCientifico,
            familia: formData.familia,
            origem: formData.origem,
            dataCadastro: formData.dataCadastro.split('-').reverse().join('/'),
            qtdAtual: formData.qtdAtual,
            unidadeMedida: formData.unidadeMedida,
            localizacao: formData.localizacao,
            camaraFria: formData.camaraFria,
        };
        onSalvar(dadosSalvos);
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

                {/* Botão de fechar (opcional, mas bom para modais) */}
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
                            { value: 'kg', label: 'kg' },
                            { value: 'g', label: 'g' },
                            { value: 'und', label: 'und' },
                        ]}
                    />
                    <Input
                        label="Localização"
                        name="localizacao"
                        value={formData.localizacao}
                        onChange={handleChange('localizacao')}
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
