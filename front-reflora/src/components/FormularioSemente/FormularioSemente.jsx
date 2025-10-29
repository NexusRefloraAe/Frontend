import React, { useState } from 'react'
import FormGeral from '../FormGeral/FormGeral'
import ImageUpload from '../ImageUpload/ImageUpload'
import Input from '../Input/Input'

import saveIcon from '../../assets/botaosalvar.svg'
import calendarIcon from '../../assets/calendaricon.svg'
import locationIcon from '../../assets/locationicon.svg'

const optionsNomePopular = [
    { value: 'ipe-amarelo', label: 'Ipê-amarelo' },
    { value: 'pau-brasil', label: 'Pau-Brasil' },
];
const optionsNomeCientifico = [
    { value: 'Handroanthus chrysotrichus', label: 'Handroanthus chrysotrichus' },
    { value: 'Paubrasilia echinata', label: 'Paubrasilia echinata' },
];
const optionsFamilia = [{ value: 'Bignoniaceae', label: 'Bignoniaceae' }];
const optionsOrigem = [{ value: 'Bignoniaceae', label: 'Bignoniaceae' }];
const optionsUnidade = [
    { value: 'kg', label: 'Kg' },
    { value: 'g', label: 'g' },
    { value: 'und', label: 'Und' },
];
const optionsCamaraFria = [
    { value: 'sim', label: 'Sim' },
    { value: 'nao', label: 'Não' },
];

function FormularioSemente() {
    const [formData, setFormData] = useState({
        nomePopular: '',
        nomeCientifico: '',
        familia: '',
        origem: '',
        dataCadastro: '',
        quantidade: '',
        unidadeMedida: 'kg',
        localizacao: '',
        camaraFria: 'nao',
    });

    const [fotoSemente, setFotoSemente] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        console.log('Dados do formulário:', { ...formData, foto: fotoSemente });
    };

    const formActions = [
        {
            children: 'Cancelar',
            variant: 'action-secondary',
            type: 'button',
            onClick: () => console.log('Cancelado')
        },
        {
            children: 'Salvar cadastro',
            variant: 'primary',
            type: 'submit',
            icon: saveIcon
        }
    ];

    return (
        <FormGeral
            title="Cadastrar/editar sementes"
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
                type='select'
                name='nomePopular'
                value={formData.nomePopular}
                onChange={handleInputChange}
                options={optionsNomePopular}
                placeholder="Selecione o nome popular"
            />

            <Input
                label="Nome Científico"
                type='select'
                name='nomeCientifico'
                value={formData.nomeCientifico}
                onChange={handleInputChange}
                options={optionsNomeCientifico}
                placeholder="Selecione o nome científico"
            />

            <Input
                label="Família"
                type='select'
                name='familia'
                value={formData.familia}
                onChange={handleInputChange}
                options={optionsFamilia}
            />

            <Input
                label="Origem"
                type='select'
                name='origem'
                value={formData.origem}
                onChange={handleInputChange}
                options={optionsOrigem}
            />

            <Input
                label="Data de Cadastro"
                type='date'
                name='dataCadastro'
                value={formData.dataCadastro}
                onChange={handleInputChange}
                placeholder="dd/mm/aaaa"
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

export default FormularioSemente
