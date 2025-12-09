import React, { useState, useEffect } from 'react'
import FormGeral from '../FormGeral/FormGeral'
import ImageUpload from '../ImageUpload/ImageUpload'
import Input from '../Input/Input'
import { sementesService } from '../../services/sementesService' // 1. Importar Serviço
import { getBackendErrorMessage } from '../../utils/errorHandler' // 2. Importar Tratamento de Erro
import calendarIcon from '../../assets/calendaricon.svg';
import { FaSave } from 'react-icons/fa'
import locationIcon from '../../assets/locationicon.svg'

// --- Opções (Mantidas iguais) ---
// const optionsNomePopular = [
//     { value: 'ipe-amarelo', label: 'Ipê-amarelo' },
//     { value: 'pau-brasil', label: 'Pau-Brasil' },
// ];
// ... (pode manter todas as outras constantes de options aqui) ...
const optionsUnidade = [
    { value: 'KG', label: 'Kg' },
    { value: 'G', label: 'g' },
    { value: 'UNIDADE', label: 'Und' },
];
const optionsCamaraFria = [
    { value: 'sim', label: 'Sim' },
    { value: 'nao', label: 'Não' },
];

function FormularioSemente({ onSuccess, onCancel, sementeParaEditar = null }) {
    
    // Estado inicial vazio
    const [formData, setFormData] = useState({
        nomePopular: '',
        nomeCientifico: '',
        familia: '',
        origem: '',
        dataCadastro: '', 
        quantidade: '',
        unidadeMedida: 'KG',
        localizacao: '',
        camaraFria: 'nao',
    });

    const [fotoSemente, setFotoSemente] = useState(null);
    const [loading, setLoading] = useState(false);

    // --- 3. Efeito para Carregar Dados na Edição ---
    useEffect(() => {
        if (sementeParaEditar) {
            // Conversão de Data: dd/MM/yyyy (Backend) -> yyyy-MM-dd (Input HTML)
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
                // O backend manda "KG", "G" ou "UNIDADE", que agora batem com nossas options.
                unidadeMedida: sementeParaEditar.unidadeDeMedida || 'KG',
                localizacao: sementeParaEditar.localizacaoDaColeta || '',
                // Backend manda Boolean, Input espera string 'sim'/'nao'
                camaraFria: sementeParaEditar.estahNaCamaraFria ? 'sim' : 'nao'
            });
            // Nota: Não conseguimos pré-carregar o arquivo de foto no input type="file" por segurança do browser,
            // mas o backend mantém a foto antiga se não enviarmos uma nova.
        }
    }, [sementeParaEditar]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // --- 4. Envio dos Dados Conectado ao Service ---
    const handleSubmit = async (e) => {
        if(e && e.preventDefault) e.preventDefault();
        
        setLoading(true);

        try {
            if (sementeParaEditar && sementeParaEditar.id) {
                // MODO EDIÇÃO
                await sementesService.update(sementeParaEditar.id, formData, fotoSemente);
                alert("Semente atualizada com sucesso!");
            } else {
                // MODO CADASTRO
                await sementesService.create(formData, fotoSemente);
                alert("Semente cadastrada com sucesso!");
            }

            // Notifica o pai (Banco.jsx) para fechar o form e atualizar a lista
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
            onClick: onCancel, // Usa a prop recebida do pai
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
                // Se quiser mostrar a foto atual na edição, precisaria passar a URL para o componente ImageUpload
                // previewUrl={sementeParaEditar?.fotoSementeResponseDTO?.url} 
            />

            {/* Mudei type='text' para permitir digitação livre ou select se preferir manter restrito */}
            <Input
                label="Nome Popular"
                type='text' 
                name='nomePopular'
                value={formData.nomePopular}
                onChange={handleInputChange}
                placeholder="Digite o nome popular"
                // Se quiser manter como select, use: type='select' e passe options={optionsNomePopular}
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

            <Input
                label="Localização da Coleta"
                type='text'
                name='localizacao'
                value={formData.localizacao}
                onChange={handleInputChange}
                placeholder="Digite a localização"
                icon={locationIcon}
            />

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