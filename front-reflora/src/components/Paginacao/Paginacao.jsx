import React from 'react'

const gerarPaginasVisiveis = (paginaAtual, totalPaginas, siblings = 1) => {
    const paginas = new Set();

    for (let i = -siblings; i <= siblings; i++) {
        const pagina = paginaAtual + i;
        if (pagina > 1 && pagina < totalPaginas) {
            paginas.add(pagina);
        }
    }

    paginas.add(1);
    paginas.add(totalPaginas);

    paginas.add(paginaAtual);

    const paginasArray = Array.from(paginas).sort((a, b) => a - b);
    const paginasComElipses = [];

    let ultimoAdicionado = 0;
    for (const pagina of paginasArray) {
        if (ultimoAdicionado != 0 && pagina - ultimoAdicionado > 1) {
            paginasComElipses.push('...');
        }
        paginasComElipses.push(pagina);
        ultimoAdicionado = pagina;
    }

    if (totalPaginas <= 5) {
        return Array.from({ length: totalPaginas }, (_, i) => i + 1);
    }

    return paginasComElipses;
};

/**
* @param {object} props
* @param {number} props.paginaAtual - Página atualmente ativa
* @param {number} props.totalPaginas - Total de páginas disponíveis
* @param {function(number): void} props.onPaginaChange - Função chamada quando a página é clicada
*/
function Paginacao({ paginaAtual, totalPaginas, onPaginaChange }) {
    const paginas = gerarPaginasVisiveis(paginaAtual, totalPaginas);

    const handlePrevious = (e) => {
        e.preventDefault();
        if (paginaAtual > 1) {
            onPaginaChange(paginaAtual - 1);
        }
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (paginaAtual < totalPaginas) {
            onPaginaChange(paginaAtual + 1);
        }
    };

    const handlePaginaClick = (e, pagina) => {
        e.preventDefault();
        if (typeof pagina === 'number') {
            onPaginaChange(pagina);
        }
    };

    if (totalPaginas <= 1) {
        return null;
    }

    return (
        <nav>
            <ul>
                <li><a href="#" onClick={handlePrevious} className={paginaAtual === 1 ? 'disabled' : ''}>Anterior</a></li>
                {paginas.map((pagina, index) => (
                    <li key={index}>
                        {pagina === '...' ? (
                            <span>...</span>
                        ) : (
                            <a href="#" onClick={(e) => handlePaginaClick(e, pagina)} className={paginaAtual === pagina ? 'active' : ''}>
                                {pagina}
                            </a>
                        )}
                    </li>
                ))}
                <li><a href="#" onClick={handleNext} className={paginaAtual === totalPaginas ? 'disabled' : ''}>Próxima</a></li>
            </ul>
        </nav>
    );
}

export default Paginacao;
