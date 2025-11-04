// src/pages/Vistoria/Listar/Listar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Paginacao from '../../../components/Paginacao/Paginacao';
import './Listar.css';

const Listar = () => {
  const dadosVistorias = [
    { lote: 'A001', nomePopular: 'Ipê-amarelo', dataVistoria: '20/07/2025', estadoSaude: 'Boa', nomeResponsavel: 'Antônio Bezerra Santos', localizacaoColeta: 'Araruna' },
    { lote: 'A002', nomePopular: 'Pau-brasil', dataVistoria: '05/11/2025', estadoSaude: 'Excelente', nomeResponsavel: 'Maria Silva', localizacaoColeta: 'Cacimba de Dentro' },
    { lote: 'A003', nomePopular: 'Angico', dataVistoria: '12/10/2025', estadoSaude: 'Regular', nomeResponsavel: 'Carlos Souza', localizacaoColeta: 'Araruna' },
    { lote: 'A004', nomePopular: 'Jatobá', dataVistoria: '30/09/2025', estadoSaude: 'Ruim', nomeResponsavel: 'Ana Oliveira', localizacaoColeta: 'Bananeiras' },
    { lote: 'A005', nomePopular: 'Sibipiruna', dataVistoria: '15/08/2025', estadoSaude: 'Péssima', nomeResponsavel: 'Pedro Almeida', localizacaoColeta: 'Araruna' },
    { lote: 'A006', nomePopular: 'Ipê-branco', dataVistoria: '22/07/2025', estadoSaude: 'Boa', nomeResponsavel: 'Juliana Costa', localizacaoColeta: 'Cacimba de Dentro' },
    { lote: 'A007', nomePopular: 'Jacarandá', dataVistoria: '10/06/2025', estadoSaude: 'Excelente', nomeResponsavel: 'Rafael Lima', localizacaoColeta: 'Araruna' },
    { lote: 'A008', nomePopular: 'Mimosa', dataVistoria: '03/05/2025', estadoSaude: 'Regular', nomeResponsavel: 'Fernanda Rocha', localizacaoColeta: 'Bananeiras' },
    { lote: 'A009', nomePopular: 'Cedro', dataVistoria: '28/04/2025', estadoSaude: 'Boa', nomeResponsavel: 'Lucas Mendes', localizacaoColeta: 'Araruna' },
    { lote: 'A010', nomePopular: 'Aroeira', dataVistoria: '14/03/2025', estadoSaude: 'Excelente', nomeResponsavel: 'Camila Duarte', localizacaoColeta: 'Cacimba de Dentro' },
  ];

  const [termoBusca, setTermoBusca] = useState('');
  const [filtroLote, setFiltroLote] = useState('');
  const [dataInicio, setDataInicio] = useState('2025-01-01');
  const [dataFim, setDataFim] = useState('2025-12-31');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const ITENS_POR_PAGINA = 7;

  const vistoriasFiltradas = dadosVistorias.filter((vistoria) => {
    const matchBusca = !termoBusca || 
      vistoria.nomePopular.toLowerCase().includes(termoBusca.toLowerCase()) ||
      vistoria.lote.toLowerCase().includes(termoBusca.toLowerCase());
    const matchLote = !filtroLote || vistoria.lote === filtroLote;
    const dataVistoria = new Date(vistoria.dataVistoria.split('/').reverse().join('-'));
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const matchData = dataVistoria >= inicio && dataVistoria <= fim;
    return matchBusca && matchLote && matchData;
  });

  const totalPaginas = Math.ceil(vistoriasFiltradas.length / ITENS_POR_PAGINA);
  const indiceUltimoItem = paginaAtual * ITENS_POR_PAGINA;
  const indicePrimeiroItem = indiceUltimoItem - ITENS_POR_PAGINA;
  const vistoriasPaginaAtual = vistoriasFiltradas.slice(indicePrimeiroItem, indiceUltimoItem);

  const handleExport = () => {
    window.print();
  };

  const handlePesquisar = (e) => {
    e.preventDefault();
    setPaginaAtual(1);
  };

  return (
    <div className="listar-vistoria">
      <div className="listar-vistoria__container">
        <h2>Lista de Vistorias</h2>

        {/* Filtros */}
        <form onSubmit={handlePesquisar} className="listar-vistoria__filtros">
          <div className="filtro-item">
            <label>Lote da Muda</label>
            <select value={filtroLote} onChange={(e) => setFiltroLote(e.target.value)}>
              <option value="">Todos</option>
              <option value="A001">A001</option>
              <option value="A002">A002</option>
              <option value="A003">A003</option>
              <option value="A004">A004</option>
              <option value="A005">A005</option>
            </select>
          </div>

          <div className="filtro-item">
            <label>Data início</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>

          <div className="filtro-item">
            <label>Data fim</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>

          <div className="filtro-busca">
            <input
              type="text"
              placeholder="Pesquisar por lote ou nome..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
            <button type="submit">Pesquisar</button>
          </div>
        </form>

        {/* Tabela */}
        <table className="listar-vistoria__tabela">
          <thead>
            <tr>
              <th>Lote</th>
              <th>Nome Popular</th>
              <th>Data da Vistoria</th>
              <th>Status</th>
              <th>Responsável</th>
              <th>Localização da Coleta</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vistoriasPaginaAtual.map((vistoria) => (
              <tr key={vistoria.lote}>
                <td>{vistoria.lote}</td>
                <td>{vistoria.nomePopular}</td>
                <td>{vistoria.dataVistoria}</td>
                <td>{vistoria.estadoSaude}</td>
                <td>{vistoria.nomeResponsavel}</td>
                <td>{vistoria.localizacaoColeta}</td>
                <td className="acoes">
                  <Link to={`/vistoria/editar/${vistoria.lote}`}>Editar</Link>
                  <Link to={`/vistoria/visualizar/${vistoria.lote}`}>Visualizar</Link>
                  <button onClick={() => alert(`Excluir vistoria ${vistoria.lote}`)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="listar-vistoria__paginacao">
            <Paginacao
              paginaAtual={paginaAtual}
              totalPaginas={totalPaginas}
              onPaginaChange={setPaginaAtual}
            />
          </div>
        )}

        {/* Botões */}
        <div className="listar-vistoria__actions">
          <button
            type="button"
            className="listar-vistoria__button listar-vistoria__button--secondary"
            onClick={() => window.history.back()}
          >
            Voltar
          </button>
          <button
            type="button"
            className="listar-vistoria__button listar-vistoria__button--primary"
            onClick={handleExport}
          >
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Listar;