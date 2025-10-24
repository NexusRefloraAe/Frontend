import { useState } from "react";

function LinhaSemente({ semente }) {
    const [quantidadeSaida, setQuantidadeSaida] = useState(semente.qtdSaida || 0);
    const [finalidade, setFinalidade] = useState(semente.finalidade);

    const handleQuantidadeChange = (e) => {
        setQuantidadeSaida(e.target.value);
    };

    return (
        <tr>
            <td>{semente.id}</td>
            <td>{semente.dataCadastro}</td>
            <td><a href="">{semente.nome}</a></td>
            <td>{semente.qtdAtual}</td>
            <td>
                <input
                    type="number"
                    value={quantidadeSaida}
                    onChange={handleQuantidadeChange}
                />
            </td>
            <td>
                <select value={finalidade} onChange={(e) => setFinalidade(e.target.value)}>
                <option value="germinacao">Teste de germinação</option>
                <option value="plantio">Teste de plantio</option>
                <option value="colheita">Teste de colheita</option>
                <option value="outro">Outro</option>
            </select>
            </td>
        </tr>
    );
}

export default LinhaSemente;