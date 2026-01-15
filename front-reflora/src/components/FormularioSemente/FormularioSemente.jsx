import React, { useState, useEffect } from 'react';
import FormGeral from '../FormGeral/FormGeral';
import ImageUpload from '../ImageUpload/ImageUpload';
import Input from '../Input/Input';
import { sementesService } from '../../services/sementesService';
import { getBackendErrorMessage } from '../../utils/errorHandler';
import bancoOficial from '../../assets/bancoDeEspecies.json';

// Ícones
import { FaSave, FaMapMarkerAlt, FaSearchLocation } from 'react-icons/fa';

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
    sementeParaEditar = null
}) {

    const [formData, setFormData] = useState({
        nomePopular: '',
        nomeCientifico: '',
        familia: '',
        origem: '',
        dataCadastro: '',
        quantidade: '',
        unidadeMedida: 'KG',
        // OS 4 CAMPOS DE LOCALIZAÇÃO
        latitude: '',
        longitude: '',
        estado: '',
        cidade: '',
        camaraFria: 'nao',
    });

    const [fotoSemente, setFotoSemente] = useState(null);
    const [loading, setLoading] = useState(false);
    const [buscandoEndereco, setBuscandoEndereco] = useState(false); // Loading específico do endereço
    const [listaCompleta, setListaCompleta] = useState([]);

    // --- CARREGAR LISTA DE ESPÉCIES ---
    useEffect(() => {
        let lista = [...bancoOficial];
        const especiesAprendidas = localStorage.getItem('minhas_especies_customizadas');
        if (especiesAprendidas) {
            const novas = JSON.parse(especiesAprendidas);
            lista = [...lista, ...novas];
        }
        lista.sort((a, b) => a.popular.localeCompare(b.popular));
        setListaCompleta(lista);
    }, []);

    // --- CARREGAR DADOS NA EDIÇÃO ---
    useEffect(() => {
        if (sementeParaEditar) {
            let dataInput = '';
            if (sementeParaEditar.dataDeCadastro) {
                if (sementeParaEditar.dataDeCadastro.includes('/')) {
                    const [dia, mes, ano] = sementeParaEditar.dataDeCadastro.split('/');
                    dataInput = `${ano}-${mes}-${dia}`;
                } else {
                    dataInput = sementeParaEditar.dataDeCadastro;
                }
            }

            setFormData({
                nomePopular: sementeParaEditar.nomePopular || '',
                nomeCientifico: sementeParaEditar.nomeCientifico || '',
                familia: sementeParaEditar.familia || '',
                origem: sementeParaEditar.origem || '',
                dataCadastro: dataInput,
                quantidade: sementeParaEditar.quantidade || '',
                unidadeMedida: sementeParaEditar.unidadeDeMedida || 'KG',

                latitude: sementeParaEditar.latitude || '',
                longitude: sementeParaEditar.longitude || '',
                estado: sementeParaEditar.estado || '',
                cidade: sementeParaEditar.cidade || '',

                camaraFria: sementeParaEditar.estahNaCamaraFria ? 'sim' : 'nao'
            });
        }
    }, [sementeParaEditar]);

    // --- LÓGICA DE GEOCODING REVERSO (LAT/LONG -> ENDEREÇO) ---
    const buscarEnderecoPorCoordenadas = async (lat, lon) => {
        if (!lat || !lon) return;

        setBuscandoEndereco(true);
        try {
            // USANDO A API BIG DATA CLOUD (Funciona sem bloqueio de CORS)
            const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Erro ao conectar com o serviço de mapas');
            }

            const data = await response.json();

            // Mapeamento dos dados da BigDataCloud
            if (data) {
                // A BigDataCloud retorna 'city' ou 'locality' e 'principalSubdivision' (Estado)
                const cidadeEncontrada = data.city || data.locality || '';
                const estadoEncontrado = data.principalSubdivision || ''; // Ex: "Paraíba"

                // Só atualiza se encontrou algo útil
                if (cidadeEncontrada || estadoEncontrado) {
                    setFormData(prev => ({
                        ...prev,
                        cidade: cidadeEncontrada,
                        estado: estadoEncontrado
                    }));
                }
            }
        } catch (error) {
            console.error("Erro ao buscar endereço:", error);
            // Falha silenciosa para não travar o fluxo do usuário
        } finally {
            setBuscandoEndereco(false);
        }
    };

    // --- FUNÇÃO DO BOTÃO GPS ---
    const handlePegarLocalizacao = () => {
        if ("geolocation" in navigator) {
            setBuscandoEndereco(true);

            // Opções para forçar o dispositivo a usar o melhor GPS possível
            const options = {
                enableHighAccuracy: true, // Tenta usar GPS real em vez de Wi-Fi
                timeout: 10000,           // Espera até 10s para conseguir precisão
                maximumAge: 0             // Não usa cache de posição antiga
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    setFormData(prev => ({
                        ...prev,
                        latitude: lat,
                        longitude: lon
                    }));

                    // Chama a função para preencher cidade/estado
                    buscarEnderecoPorCoordenadas(lat, lon);
                },
                (error) => {
                    console.error("Erro GPS:", error);
                    alert("Ative o GPS para usar esta função.");
                    setBuscandoEndereco(false);
                },
                options
            );
        } else {
            alert("Navegador não suporta geolocalização.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));

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

    // Quando o usuário termina de digitar a Longitude (sai do campo), busca o endereço
    const handleBlurLongitude = () => {
        if (formData.latitude && formData.longitude) {
            buscarEnderecoPorCoordenadas(formData.latitude, formData.longitude);
        }
    };

    const aprenderNovaEspecie = (dados) => {
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
            const salvosAntigos = localStorage.getItem('minhas_especies_customizadas');
            let arraySalvo = salvosAntigos ? JSON.parse(salvosAntigos) : [];
            arraySalvo.push(novaEspecie);
            localStorage.setItem('minhas_especies_customizadas', JSON.stringify(arraySalvo));
            setListaCompleta(prev => [...prev, novaEspecie].sort((a, b) => a.popular.localeCompare(b.popular)));
        }
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                latitude: formData.latitude ? Number(formData.latitude) : null,
                longitude: formData.longitude ? Number(formData.longitude) : null,
                // Estado e Cidade vão como string normal
                estado: formData.estado,
                cidade: formData.cidade
            };

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

            <div>
                <Input
                    label="Nome Popular"
                    type='text'
                    name='nomePopular'
                    value={formData.nomePopular}
                    onChange={handleInputChange}
                    placeholder="Digite para buscar..."
                    list="lista-sementes-dinamica"
                />
                <datalist id="lista-sementes-dinamica">
                    {listaCompleta.map((especie, index) => (
                        <option key={index} value={especie.popular}>{especie.cientifico}</option>
                    ))}
                </datalist>
            </div>

            <Input label="Nome Científico" type='text' name='nomeCientifico' value={formData.nomeCientifico} onChange={handleInputChange} placeholder="Automático" />
            <Input label="Família" type='text' name='familia' value={formData.familia} onChange={handleInputChange} placeholder="Automático" />
            <Input label="Origem" type='text' name='origem' value={formData.origem} onChange={handleInputChange} placeholder="Automático" />

            <Input label="Data de Cadastro" type='date' name='dataCadastro' value={formData.dataCadastro} onChange={handleInputChange} />

            <div className='campo-linha-combinada'>
                <div className="campo-quantidade">
                    <Input label="Quantidade" type='number' name='quantidade' value={formData.quantidade} onChange={handleInputChange} placeholder="0" />
                </div>
                <div className="campo-unidade">
                    <Input label="Unidade" type='select' name='unidadeMedida' value={formData.unidadeMedida} onChange={handleInputChange} options={optionsUnidade} />
                </div>
            </div>

            {/* --- SEÇÃO DE LOCALIZAÇÃO INTELIGENTE --- */}
            <h4 style={{ gridColumn: '1 / -1', margin: '10px 0 5px 0', color: '#666' }}>Localização da Coleta</h4>

            <div className='campo-linha-combinada' style={{ alignItems: 'flex-end', gap: '10px' }}> {/* Adicionado gap */}
                <div style={{ flex: 1 }}>
                    <Input
                        label="Latitude"
                        type='number'
                        name='latitude'
                        step="any"
                        value={formData.latitude}
                        onChange={handleInputChange}
                        placeholder="-15.79"
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <Input
                        label="Longitude"
                        type='number'
                        name='longitude'
                        step="any"
                        value={formData.longitude}
                        onChange={handleInputChange}
                        onBlur={handleBlurLongitude}
                        placeholder="-47.88"
                    />
                </div>

                {/* Botão GPS Alinhado */}
                <button
                    type="button"
                    onClick={handlePegarLocalizacao}
                    disabled={buscandoEndereco}
                    style={{
                        height: '45px', // Altura fixa para alinhar com o input padrão
                        marginBottom: '2px', // Ajuste fino para alinhar a base
                        padding: '0 20px',
                        backgroundColor: buscandoEndereco ? '#ccc' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        minWidth: '130px'
                    }}
                    title="Preencher coordenadas e endereço automaticamente"
                >
                    {buscandoEndereco ? 'Buscando...' : <><FaMapMarkerAlt /> Usar GPS</>}
                </button>
            </div>

            <div className='campo-linha-combinada'>
                <div style={{ flex: 1 }}>
                    <Input
                        label="Estado"
                        type='text'
                        name='estado'
                        value={formData.estado}
                        onChange={handleInputChange} // Mantemos onChange para evitar warning, mas é readOnly
                        placeholder={buscandoEndereco ? "Carregando..." : "UF"}
                        readOnly={true} // <--- BLOQUEADO PARA SEMPRE
                        style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }} // Estilo visual de bloqueado
                    />
                </div>
                <div style={{ flex: 2 }}>
                    <Input
                        label="Cidade"
                        type='text'
                        name='cidade'
                        value={formData.cidade}
                        onChange={handleInputChange}
                        placeholder={buscandoEndereco ? "Buscando cidade..." : "Nome da Cidade"}
                        readOnly={true} // <--- BLOQUEADO PARA SEMPRE
                        style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }} // Estilo visual de bloqueado
                    />
                </div>
            </div>
            <Input label="Câmara Fria" type='select' name='camaraFria' value={formData.camaraFria} onChange={handleInputChange} options={optionsCamaraFria} />
        </FormGeral>
    );
}

export default FormularioSemente;