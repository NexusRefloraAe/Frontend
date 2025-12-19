import React, { useState, useEffect } from 'react'
import FormGeral from '../FormGeral/FormGeral'
import ImageUpload from '../ImageUpload/ImageUpload'
import Input from '../Input/Input'
import { sementesService } from '../../services/sementesService'
import { getBackendErrorMessage } from '../../utils/errorHandler'

import { FaSave } from 'react-icons/fa'
import locationIcon from '../../assets/locationicon.svg'

const optionsUnidade = [
    { value: 'KG', label: 'Kg' },
    { value: 'G', label: 'g' },
    { value: 'UNIDADE', label: 'Und' },
];
const optionsCamaraFria = [
    { value: 'sim', label: 'Sim' },
    { value: 'nao', label: 'Não' },
];

// --- ADICIONADO: Props do IBGE recebidas do pai ---
function FormularioSemente({ 
    onSuccess, 
    onCancel, 
    sementeParaEditar = null, 
    listaEstados = [],   // Nova prop
    listaCidades = [],   // Nova prop
    onEstadoChange       // Nova prop (função)
}) {
    
    const [formData, setFormData] = useState({
        nomePopular: '',
        nomeCientifico: '',
        familia: '',
        origem: '',
        dataCadastro: '', 
        quantidade: '',
        unidadeMedida: 'KG',
        // localizacao: '', // Removi o campo texto livre antigo (ou mantenha se quiser concatenar)
        uf: '',          // Novo campo
        cidade: '',      // Novo campo
        camaraFria: 'nao',
    });

    const [fotoSemente, setFotoSemente] = useState(null);
    const [loading, setLoading] = useState(false);

    // --- 3. Efeito para Carregar Dados na Edição ---
    useEffect(() => {
        if (sementeParaEditar) {
            let dataInput = '';
            if(sementeParaEditar.dataDeCadastro) {
                const [dia, mes, ano] = sementeParaEditar.dataDeCadastro.split('/');
                dataInput = `${ano}-${mes}-${dia}`;
            }

            setFormData({
                nomePopular: sementeParaEditar.nomePopular || '',
                nomeCientifico: sementeParaEditar.nomeCientifico || '',
                familia: sementeParaEditar.familia || '',
                origem: sementeParaEditar.origem || '',
                dataCadastro: dataInput,
                quantidade: sementeParaEditar.quantidade || '',
                unidadeMedida: sementeParaEditar.unidadeDeMedida || 'KG',
                
                // Mapeando UF e Cidade vindos do backend
                uf: sementeParaEditar.uf || '', 
                cidade: sementeParaEditar.cidade || '',
                
                camaraFria: sementeParaEditar.estahNaCamaraFria ? 'sim' : 'nao'
            });
            // O componente pai (BancoSementes) já chamou o handleEstadoChange se houver UF, 
            // então a listaCidades deve chegar preenchida.
        }
    }, [sementeParaEditar]);

    // --- Transformar dados do IBGE para o formato do Select (value/label) ---
    const optionsEstados = listaEstados.map(estado => ({
        value: estado.sigla,
        label: estado.nome
    }));

    const optionsCidades = listaCidades.map(cidade => ({
        value: cidade.nome,
        label: cidade.nome
    }));

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));

        // --- LÓGICA ESPECIAL PARA UF ---
        if (name === 'uf') {
            // 1. Limpa a cidade pois mudou o estado
            setFormData(prev => ({ ...prev, cidade: '' }));
            // 2. Chama a função do pai para buscar as novas cidades na API
            if (onEstadoChange) {
                onEstadoChange(value);
            }
        }
    };

    // --- 4. Envio dos Dados ---
    const handleSubmit = async (e) => {
        if(e && e.preventDefault) e.preventDefault();
        
        setLoading(true);

        try {
            // Preparar o payload (objeto que vai pro backend)
            // Se o backend ainda esperar "localizacaoDaColeta" como string única:
            // const payload = { ...formData, localizacaoDaColeta: `${formData.cidade} - ${formData.uf}` };
            
            // Se o backend já aceita uf e cidade separados:
            const payload = { ...formData };

            if (sementeParaEditar && sementeParaEditar.id) {
                await sementesService.update(sementeParaEditar.id, payload, fotoSemente);
                alert("Semente atualizada com sucesso!");
            } else {
                await sementesService.create(payload, fotoSemente);
                alert("Semente cadastrada com sucesso!");
            }

            if (onSuccess) onSuccess();

        } catch (error) {
            const msg = getBackendErrorMessage(error);
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    const formActions = [
        {
            children: 'Cancelar',
            variant: 'action-secondary',
            type: 'button',
            onClick: onCancel,
            disabled: loading
        },
        {
            children: loading ? 'Salvando...' : (sementeParaEditar ? 'Salvar Alterações' : 'Salvar Cadastro'),
            variant: 'primary',
            type: 'submit',
            icon: loading ? null : <FaSave />,
            disabled: loading
        }
    ];

    return (
        
        <FormGeral
            title={sementeParaEditar ? "Editar Semente" : "Cadastrar Semente"}
            actions={formActions}
            onSubmit={handleSubmit}
            useGrid={true}
        >
            <ImageUpload
                label="Foto da Semente"
                className='form-span-2'
                onFileChange={(file) => setFotoSemente(file)}
            />

            <Input
                label="Nome Popular"
                type='text' 
                name='nomePopular'
                value={formData.nomePopular}
                onChange={handleInputChange}
                placeholder="Digite o nome popular"
            />

            <Input
                label="Nome Científico"
                type='text'
                name='nomeCientifico'
                value={formData.nomeCientifico}
                onChange={handleInputChange}
                placeholder="Digite o nome científico"
            />

            <Input
                label="Família"
                type='text'
                name='familia'
                value={formData.familia}
                onChange={handleInputChange}
                placeholder="Família da planta"
            />

            <Input
                label="Origem"
                type='text'
                name='origem'
                value={formData.origem}
                onChange={handleInputChange}
                placeholder="Origem"
            />

            <Input
                label="Data de Cadastro"
                type='date'
                name='dataCadastro'
                value={formData.dataCadastro}
                onChange={handleInputChange}
            />

            <div className='campo-linha-combinada'>
                <div className="campo-quantidade">
                    <Input
                        label="Quantidade"
                        type='number'
                        name='quantidade'
                        value={formData.quantidade}
                        onChange={handleInputChange}
                        placeholder="0"
                    />
                </div>
                <div className="campo-unidade">
                    <Input
                        label="Unidade de Medida"
                        type='select'
                        name='unidadeMedida'
                        value={formData.unidadeMedida}
                        onChange={handleInputChange}
                        options={optionsUnidade}
                    />
                </div>
            </div>

            {/* --- NOVOS CAMPOS DE LOCALIZAÇÃO (IBGE) --- */}
            <div className='campo-linha-combinada'>
                <div style={{ flex: 1 }}> {/* Ajuste de layout simples */}
                    <Input
                        label="Estado (UF)"
                        type='select'
                        name='uf'
                        value={formData.uf}
                        onChange={handleInputChange}
                        options={optionsEstados}
                        placeholder="Selecione o Estado"
                    />
                </div>
                <div style={{ flex: 2 }}>
                    <Input
                        label="Cidade"
                        type='select'
                        name='cidade'
                        value={formData.cidade}
                        onChange={handleInputChange}
                        options={optionsCidades}
                        placeholder="Selecione a Cidade"
                        disabled={!formData.uf} // Desabilita se não tiver UF selecionada
                        icon={locationIcon}
                    />
                </div>
            </div>

            <Input
                label="Câmara Fria"
                type='select'
                name='camaraFria'
                value={formData.camaraFria}
                onChange={handleInputChange}
                options={optionsCamaraFria}
            />
        </FormGeral>
        
    );
}

export default FormularioSemente;