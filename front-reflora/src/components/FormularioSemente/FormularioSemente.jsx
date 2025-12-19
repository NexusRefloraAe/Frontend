import React, { useState, useEffect } from 'react'
import FormGeral from '../FormGeral/FormGeral'
import ImageUpload from '../ImageUpload/ImageUpload'
import Input from '../Input/Input'
import { sementesService } from '../../services/sementesService'
import { getBackendErrorMessage } from '../../utils/errorHandler'
// 1. Importa a lista base (oficial)
import bancoOficial from '../../assets/bancoDeEspecies.json'

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

function FormularioSemente({
    onSuccess,
    onCancel,
    sementeParaEditar = null,
    listaEstados = [],
    listaCidades = [],
    onEstadoChange
}) {

    const [formData, setFormData] = useState({
        nomePopular: '',
        nomeCientifico: '',
        familia: '',
        origem: '',
        dataCadastro: '',
        quantidade: '',
        unidadeMedida: 'KG',
        uf: '',
        cidade: '',
        camaraFria: 'nao',
    });

    const [fotoSemente, setFotoSemente] = useState(null);
    const [loading, setLoading] = useState(false);

    // ESTADO PARA A LISTA COMBINADA (Oficial + Aprendida)
    const [listaCompleta, setListaCompleta] = useState([]);

    // --- 1. CARREGAR LISTA AO INICIAR ---
    useEffect(() => {
        // Pega o que já tem no arquivo JSON
        let lista = [...bancoOficial];

        // Verifica se o navegador tem "memória" de sementes novas criadas pelo produtor
        const especiesAprendidas = localStorage.getItem('minhas_especies_customizadas');
        if (especiesAprendidas) {
            const novas = JSON.parse(especiesAprendidas);
            // Junta as listas
            lista = [...lista, ...novas];
        }

        // Ordena alfabeticamente para ficar bonito
        lista.sort((a, b) => a.popular.localeCompare(b.popular));

        setListaCompleta(lista);
    }, []);

    useEffect(() => {
        if (sementeParaEditar) {
            let dataInput = '';
            if (sementeParaEditar.dataDeCadastro) {
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
                uf: sementeParaEditar.uf || '',
                cidade: sementeParaEditar.cidade || '',
                camaraFria: sementeParaEditar.estahNaCamaraFria ? 'sim' : 'nao'
            });
        }
    }, [sementeParaEditar]);

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
        setFormData(prevData => ({ ...prevData, [name]: value }));

        if (name === 'uf') {
            setFormData(prev => ({ ...prev, cidade: '' }));
            if (onEstadoChange) onEstadoChange(value);
        }

        // --- AUTOCOMPLETE USANDO A LISTA COMPLETA ---
        if (name === 'nomePopular') {
            const especieEncontrada = listaCompleta.find(item =>
                item.popular.toLowerCase() === value.toLowerCase()
            );

            if (especieEncontrada) {
                setFormData(prev => ({
                    ...prev,
                    [name]: especieEncontrada.popular,
                    nomeCientifico: especieEncontrada.cientifico,
                    familia: especieEncontrada.familia,
                    origem: especieEncontrada.origem
                }));
            }
        }
    };

    // --- FUNÇÃO PARA "APRENDER" NOVA ESPÉCIE ---
    const aprenderNovaEspecie = (dados) => {
        // Verifica se essa espécie já existe na lista atual
        const jaExiste = listaCompleta.some(item =>
            item.popular.toLowerCase() === dados.nomePopular.toLowerCase()
        );

        if (!jaExiste && dados.nomePopular) {
            const novaEspecie = {
                popular: dados.nomePopular,
                cientifico: dados.nomeCientifico,
                familia: dados.familia,
                origem: dados.origem
            };

            // 1. Salva no LocalStorage (Navegador)
            const salvosAntigos = localStorage.getItem('minhas_especies_customizadas');
            let arraySalvo = salvosAntigos ? JSON.parse(salvosAntigos) : [];
            arraySalvo.push(novaEspecie);
            localStorage.setItem('minhas_especies_customizadas', JSON.stringify(arraySalvo));

            // 2. Atualiza a lista em tempo real na tela
            setListaCompleta(prev => [...prev, novaEspecie].sort((a, b) => a.popular.localeCompare(b.popular)));
        }
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setLoading(true);

        try {
            // --- CORREÇÃO AQUI ---
            // O backend espera 'localizacaoDaColeta', então criamos esse campo juntando Cidade e UF
            const payload = {
                ...formData,
                localizacaoDaColeta: `${formData.cidade} - ${formData.uf}`
            };

            // Salva na memória local para o autocomplete aprender
            aprenderNovaEspecie(formData);

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

            {/* --- CAMPO COM SUGESTÕES ATUALIZADAS --- */}
            <div>
                <Input
                    label="Nome Popular"
                    type='text'
                    name='nomePopular'
                    value={formData.nomePopular}
                    onChange={handleInputChange}
                    placeholder="Digite para buscar ou cadastrar nova..."
                    list="lista-sementes-dinamica"
                />

                <datalist id="lista-sementes-dinamica">
                    {listaCompleta.map((especie, index) => (
                        <option key={index} value={especie.popular}>
                            {especie.cientifico}
                        </option>
                    ))}
                </datalist>
            </div>

            <Input
                label="Nome Científico"
                type='text'
                name='nomeCientifico'
                value={formData.nomeCientifico}
                onChange={handleInputChange}
                placeholder="Preenchido automaticamente"
            />

            <Input
                label="Família"
                type='text'
                name='familia'
                value={formData.familia}
                onChange={handleInputChange}
                placeholder="Preenchido automaticamente"
            />

            <Input
                label="Origem"
                type='text'
                name='origem'
                value={formData.origem}
                onChange={handleInputChange}
                placeholder="Preenchido automaticamente"
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

            <div className='campo-linha-combinada'>
                <div style={{ flex: 1 }}>
                    <Input
                        label="Estado (UF)"
                        type='select'
                        name='uf'
                        value={formData.uf}
                        onChange={handleInputChange}
                        options={optionsEstados}
                        placeholder="UF"
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
                        placeholder="Cidade"
                        disabled={!formData.uf}
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