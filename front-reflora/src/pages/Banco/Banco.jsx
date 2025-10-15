import React from 'react'
import '../Banco/Banco.css'

function Banco() {
    return (
        <div className="container">
            <div className="content">
                <div className="title-content">
                    <h1>Banco de Sementes</h1>
                </div>
                <div className="bottons">
                    <button>Cadastrar Semente</button>
                    <button>Listar Sementes</button>
                </div>
            </div>
        </div>
    )
}

export default Banco
