import React from 'react';
import './Paginacao.css';

const gerarPaginasVisiveis = (paginaAtual, totalPaginas, siblings = 1) => {
  // ✅ Caso simples: poucas páginas (não precisa de "...")
  if (totalPaginas <= 5) {
    return Array.from({ length: totalPaginas }, (_, i) => i + 1);
  }

  const paginas = new Set();

  // Adiciona a página atual e vizinhas
  for (let i = -siblings; i <= siblings; i++) {
    const pagina = paginaAtual + i;
    if (pagina > 1 && pagina < totalPaginas) {
      paginas.add(pagina);
    }
  }

  // Garante que a primeira e última página sempre apareçam
  paginas.add(1);
  paginas.add(totalPaginas);
  paginas.add(paginaAtual);

  // Converte para array ordenado
  const paginasArray = Array.from(paginas).sort((a, b) => a - b);

  // Adiciona "..." quando há saltos grandes
  const paginasComElipses = [];
  let ultimoAdicionado = 0;

  for (const pagina of paginasArray) {
    if (ultimoAdicionado !== 0 && pagina - ultimoAdicionado > 1) {
      paginasComElipses.push("...");
    }
    paginasComElipses.push(pagina);
    ultimoAdicionado = pagina;
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
        <nav className="paginacao-container"> {/* 2. Adicione a classe */}
            <ul className="paginacao-list">    {/* 3. Adicione a classe */}
                <li className="paginacao-item">
                    <a href="#" onClick={handlePrevious} className={paginaAtual === 1 ? 'disabled' : ''}>
                        Anterior
                    </a>
                </li>

                {paginas.map((pagina, index) => (
                    <li key={index} className="paginacao-item">
                        {pagina === '...' ? (
                            <span className="paginacao-ellipsis">...</span>
                        ) : (
                            <a 
                                href="#" 
                                onClick={(e) => handlePaginaClick(e, pagina)} 
                                className={paginaAtual === pagina ? 'active' : ''}
                            >
                                {pagina}
                            </a>
                        )}
                    </li>
                ))}

                <li className="paginacao-item">
                    <a href="#" onClick={handleNext} className={paginaAtual === totalPaginas ? 'disabled' : ''}>
                        Próxima
                    </a>
                </li>
            </ul>
        </nav>
    );
}

export default Paginacao;
