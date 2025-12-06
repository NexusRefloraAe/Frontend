function LinhaSemente({ semente, onVerDetalhes }) {
    // Esses campos vem do DTO: SementesListagemResponseDTO
    // { lote, dataDeCadastro, nomePopular, quantidadeAtualFormatada, quantidadeSaidaFormatada, finalidadeAtual }

    const handleNomeClick = (e) => {
        e.preventDefault();
        onVerDetalhes(semente);
    };

    return (
        <tr>
            {/* Campo LOTE */}
            <td>{semente.lote}</td>
            
            {/* Campo Data */}
            <td>{semente.dataDeCadastro}</td>
            
            {/* Campo Nome (Link) */}
            <td><a href="#" onClick={handleNomeClick}>{semente.nomePopular}</a></td>
            
            {/* Campo Qtd Atual */}
            <td>{semente.quantidadeAtualFormatada}</td>
            
            {/* Campo Qtd Saída (Apenas visualização, vindo do backend) */}
            <td>{semente.quantidadeSaidaFormatada}</td>
            
            {/* Campo Finalidade (Apenas visualização) */}
            <td>{semente.finalidadeAtual}</td>
        </tr>
    );
}

export default LinhaSemente;