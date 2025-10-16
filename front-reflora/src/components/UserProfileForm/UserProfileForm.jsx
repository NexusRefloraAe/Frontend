import React, { useState } from 'react';
import AuthForm from '../AuthForm/AuthForm';
import Button from '../Button/Button'; // Necessário para o botão Trocar Foto
import perfilusuarioIcon from '../../assets/perfilusuario.svg';
import './UserProfileForm.css';

// Importando ícones
import botaoEditarIcon from '../../assets/botaoeditar.svg';
import botaoSalvarIcon from '../../assets/botaosalvar.svg';
import botaoExcluirIcon from '../../assets/botaoexcluir.svg';
import importarfotoIcon from '../../assets/importarfoto.svg'; // Ícone para Trocar Foto

const UserProfileForm = () => {
    const [userData, setUserData] = useState({
        nomeCompleto: 'Maria Silva',
        email: 'maria.silva@exemplo.com',
        telefone: '(00) 9 0000-0000',
        dataNascimento: '1900-01-01',
        genero: 'Feminino',
        empresa: 'XXXXX',
        endereco: 'Rua X, Nº 00, Bairro, Cidade/Estado'
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (field) => (e) => {
        setUserData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSave = () => {
        console.log("Dados do usuário salvos:", userData);
        setIsEditing(false);
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível.")) {
            console.log("Excluir conta do usuário:", userData.email);
        }
    };

    const handleTrocarFoto = () => {
        alert("Iniciando a importação de nova foto...");
    }

    // Configuração dos campos do formulário: readOnly é controlado por isEditing
    const fieldsConfig = [
        { label: "Nome Completo", name: "nomeCompleto", type: "text", value: userData.nomeCompleto, onChange: handleChange('nomeCompleto'), required: true, readOnly: !isEditing, span: 2 },
        { label: "E-mail", name: "email", type: "email", value: userData.email, onChange: handleChange('email'), required: true, readOnly: !isEditing },
        { label: "Telefone", name: "telefone", type: "tel", placeholder: "(XX) XXXXX-XXXX", value: userData.telefone, onChange: handleChange('telefone'), required: true, readOnly: !isEditing },
        { label: "Data de Nascimento", name: "dataNascimento", type: "date", value: userData.dataNascimento, onChange: handleChange('dataNascimento'), required: true, readOnly: !isEditing },
        { label: "Gênero", name: "genero", type: "text", value: userData.genero, onChange: handleChange('genero'), required: true, readOnly: !isEditing },
        { label: "Empresa", name: "empresa", type: "text", value: userData.empresa, onChange: handleChange('empresa'), readOnly: !isEditing, span: 2 },
        { label: "Endereço", name: "endereco", type: "text", value: userData.endereco, onChange: handleChange('endereco'), required: true, readOnly: !isEditing, span: 2 }
    ];

    // Configuração dos botões de ação
    const actionsConfig = isEditing ? (
        // MODO EDIÇÃO: Salvar (Verde) e Cancelar (Cinza Escuro)
        [
            {
                type: "button",
                variant: "action-secondary", // Cinza Escuro para Cancelar Edição
                children: "Cancelar Edição",
                onClick: () => setIsEditing(false),
                icon: null
            },
            {
                type: "button",
                variant: "primary", // Verde para Salvar Edição
                children: "Salvar Edição",
                onClick: handleSave,
                icon: botaoSalvarIcon
            },
        ]
    ) : (
        // MODO VISUALIZAÇÃO: Editar (Azul) e Excluir (Vermelho)
        [
            {
                type: "button",
                variant: "action-primary", // Azul para Editar Informações
                children: "Editar Informações",
                onClick: () => setIsEditing(true),
                icon: botaoEditarIcon
            },
            {
                type: "button",
                variant: "danger", // Vermelho para Excluir Conta
                children: "Excluir Conta",
                onClick: handleDeleteAccount,
                icon: botaoExcluirIcon
            }
        ]
    );

    const sectionTitle = isEditing ? "Editar Informações do Usuário" : "Informações Pessoais do Usuário";
    const titleClass = isEditing ? "configuracoes-profile-section__title--editing" : "configuracoes-profile-section__title";

    return (
        <div className="user-profile-form__container">
            {/* Título da Seção (Mover para dentro do card, mas fora do AuthForm) */}
            <h2 className={titleClass}>{sectionTitle}</h2>
            
            <div className="user-profile-form__avatar-section">
                <div className="user-profile-form__avatar">
                    <img src={perfilusuarioIcon} alt="Avatar do Usuário" />
                </div>
                {/* Botão de Trocar Foto SÓ VISÍVEL em MODO EDIÇÃO */}
                {isEditing && (
                    <Button
                        variant="primary" 
                        icon={importarfotoIcon}
                        onClick={handleTrocarFoto}
                        className="button-trocar-foto" 
                    >
                        Trocar Foto
                    </Button>
                )}
            </div>

            <AuthForm
                fields={fieldsConfig}
                actions={actionsConfig}
                onSubmit={isEditing ? handleSave : () => setIsEditing(true)}
                useGrid={true}
                layout="dense"
            />
        </div>
    );
};

export default UserProfileForm;