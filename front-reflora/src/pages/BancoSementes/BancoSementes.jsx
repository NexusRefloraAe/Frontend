import React, { useState, useEffect } from 'react'
import ListaSementes from '../../components/ListaSementes/ListaSementes'
import './BancoSementes.css'
import cadastrar from '../../assets/cadastrar.png'
import listar from '../../assets/listar.png'
import BotaoSubmenus from '../../components/BotaoSubmenus/BotaoSubmenus'
import bell from '../../assets/bell.svg'

const DADOS_SEMENTES_MOCK = [
    { id: 'A001', dataCadastro: '10/10/2024', nome: 'Ipê-amarelo', qtdAtual: '2000 kg', qtdSaida: 200, finalidade: 'germinacao' },
    { id: 'A002', dataCadastro: '11/10/2024', nome: 'Quaresmeira', qtdAtual: '1500 kg', qtdSaida: 0, finalidade: 'plantio' },
    { id: 'B001', dataCadastro: '12/10/2024', nome: 'Pau-Brasil', qtdAtual: '500 kg', qtdSaida: 0, finalidade: 'germinacao' },
    { id: 'C003', dataCadastro: '13/10/2024', nome: 'Manacá-da-serra', qtdAtual: '800 kg', qtdSaida: 0, finalidade: 'plantio' },
    { id: 'D004', dataCadastro: '14/10/2024', nome: 'Jatobá', qtdAtual: '1200 kg', qtdSaida: 0, finalidade: 'colheita' },
    { id: 'E005', dataCadastro: '15/10/2024', nome: 'Canafístula', qtdAtual: '600 kg', qtdSaida: 0, finalidade: 'outro' },
    { id: 'F006', dataCadastro: '16/10/2024', nome: 'Aroeira', qtdAtual: '700 kg', qtdSaida: 0, finalidade: 'germinacao' },
    { id: 'G007', dataCadastro: '17/10/2024', nome: 'Copaíba', qtdAtual: '900 kg', qtdSaida: 0, finalidade: 'plantio' },
    { id: 'H008', dataCadastro: '18/10/2024', nome: 'Barbatimão', qtdAtual: '400 kg', qtdSaida: 0, finalidade: 'colheita' },
    { id: 'I009', dataCadastro: '19/10/2024', nome: 'Embaúba', qtdAtual: '1100 kg', qtdSaida: 0, finalidade: 'outro' },
    // ... adicione mais 10 ou 20 para testar a paginação
];

const menusNavegacao = [
    { id: 'cadastrar', label: 'Cadastrar Semente', icon: cadastrar },
    { id: 'listar', label: 'Listar Sementes', icon: listar },
];

function Banco() {

    const [abaAtiva, setAbaAtiva] = useState('listar');
    const [sementes, setSementes] = useState([]);

    useEffect(() => {
        // Simula a busca dos dados
        setSementes(DADOS_SEMENTES_MOCK);
    }, []);

    const handleMenuClick = (menuId) => {
        setAbaAtiva(menuId);
    }

    return (
        <div className="container-banco">
            <div className="content-banco">
                <div>
                    <BotaoSubmenus
                        menus={menusNavegacao}
                        activeMenuId={abaAtiva}
                        onMenuClick={handleMenuClick} />
                </div>
                <main>
                    {abaAtiva === 'listar' ? (
                        <ListaSementes sementes={sementes} />
                    ) : (
                        <FormularioCadastro />
                    )}
                </main>
            </div>
        </div>
    )
}

export default Banco
