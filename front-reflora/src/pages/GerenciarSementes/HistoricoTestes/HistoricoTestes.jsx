import React, { useState, useEffect } from "react";

import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";

import ModalDetalheGenerico from "../../../components/ModalDetalheGenerico/ModalDetalheGenerico";
import ModalExcluir from "../../../components/ModalExcluir/ModalExcluir";
import EditarTeste from "./EditarTeste/EditarTeste";
import DetalhesTestes from "./DetalhesTestes/DetalhesTestes";


const HistoricoTestes = () => {
  const DADOS_SEMENTES_MOCK = [

    { id: 1, lote: 'A001', nomePopular: 'Ipê-amarelo', dataTeste: '10/10/2024', quantidade: '2000 kg', camaraFria: 'Sim', dataGerminacao: '17/10/2024', qntdGerminou: 200, taxaGerminou: '10%' },
    { id: 2, lote: 'A002', nomePopular: 'Jacarandá', dataTeste: '12/10/2024', quantidade: '1500 kg', camaraFria: 'Não', dataGerminacao: '19/10/2024', qntdGerminou: 180, taxaGerminou: '12%' },
    { id: 3, lote: 'A003', nomePopular: 'Pau-brasil', dataTeste: '15/10/2024', quantidade: '800 kg', camaraFria: 'Sim', dataGerminacao: '22/10/2024', qntdGerminou: 120, taxaGerminou: '15%' },
    { id: 4, lote: 'A004', nomePopular: 'Cedro-rosa', dataTeste: '18/10/2024', quantidade: '2200 kg', camaraFria: 'Não', dataGerminacao: '25/10/2024', qntdGerminou: 250, taxaGerminou: '11%' },
    { id: 5, lote: 'A005', nomePopular: 'Jatobá', dataTeste: '20/10/2024', quantidade: '1900 kg', camaraFria: 'Sim', dataGerminacao: '27/10/2024', qntdGerminou: 210, taxaGerminou: '11%' },
    { id: 6, lote: 'A006', nomePopular: 'Ipê-roxo', dataTeste: '22/10/2024', quantidade: '1600 kg', camaraFria: 'Não', dataGerminacao: '29/10/2024', qntdGerminou: 190, taxaGerminou: '12%' },
    { id: 7, lote: 'A007', nomePopular: 'Angico', dataTeste: '25/10/2024', quantidade: '2400 kg', camaraFria: 'Sim', dataGerminacao: '01/11/2024', qntdGerminou: 260, taxaGerminou: '11%' },
    { id: 8, lote: 'A008', nomePopular: 'Sucupira', dataTeste: '28/10/2024', quantidade: '1300 kg', camaraFria: 'Não', dataGerminacao: '04/11/2024', qntdGerminou: 175, taxaGerminou: '13%' },
    { id: 9, lote: 'A009', nomePopular: 'Castanheira', dataTeste: '30/10/2024', quantidade: '3000 kg', camaraFria: 'Sim', dataGerminacao: '06/11/2024', qntdGerminou: 300, taxaGerminou: '10%' },
    { id: 10, lote: 'A010', nomePopular: 'Ipê-branco', dataTeste: '02/11/2024', quantidade: '1700 kg', camaraFria: 'Não', dataGerminacao: '09/11/2024', qntdGerminou: 195, taxaGerminou: '11%' },
    { id: 11, lote: 'A011', nomePopular: 'Sibipiruna', dataTeste: '05/11/2024', quantidade: '2100 kg', camaraFria: 'Sim', dataGerminacao: '12/11/2024', qntdGerminou: 230, taxaGerminou: '11%' },
    { id: 12, lote: 'A012', nomePopular: 'Pau-ferro', dataTeste: '08/11/2024', quantidade: '1400 kg', camaraFria: 'Não', dataGerminacao: '15/11/2024', qntdGerminou: 185, taxaGerminou: '13%' },
    { id: 13, lote: 'A013', nomePopular: 'Jequitibá', dataTeste: '10/11/2024', quantidade: '2600 kg', camaraFria: 'Sim', dataGerminacao: '17/11/2024', qntdGerminou: 280, taxaGerminou: '11%' },
    { id: 14, lote: 'A014', nomePopular: 'Caroba', dataTeste: '12/11/2024', quantidade: '1100 kg', camaraFria: 'Não', dataGerminacao: '19/11/2024', qntdGerminou: 150, taxaGerminou: '14%' },
    { id: 15, lote: 'A015', nomePopular: 'Embaúba', dataTeste: '15/11/2024', quantidade: '900 kg', camaraFria: 'Sim', dataGerminacao: '22/11/2024', qntdGerminou: 130, taxaGerminou: '14%' }
  ];

  const [sementes, setSementes] = useState([]);

  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);

  const [modalDetalheAberto, setModalDetalheAberto] = useState(false);


  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);

  useEffect(() => {
    setSementes(DADOS_SEMENTES_MOCK);
  }, []);


  // Handlers unificados para abrir os modais
  const handleVisualizar = (item) => {
    setItemSelecionado(item);
    setModalDetalheAberto(true);
  };

  const handleFecharModalDetalhe = () => {
    setModalDetalheAberto(false);
    setItemSelecionado(null);
  };


  
  const handleEditar = (item) => {
    setItemSelecionado(item);
    setModalDetalheAberto(false);
    setModalEdicaoAberto(true);
  };

  const handleSalvarEdicao = (dadosEditados) => {
    setSementes(prev => prev.map(item =>
      item.id === dadosEditados.id ? dadosEditados : item
    ));

    setModalEdicaoAberto(false);
    setItemSelecionado(null);
  }

  const handleCancelarEdicao = () => {
    setModalEdicaoAberto(false);
    setItemSelecionado(null);
  }




  const handleExcluirTeste = (item) => {
    setItemSelecionado(item);
    setModalDetalheAberto(false);
    setModalExclusaoAberto(true);
  };
  const handleCancelarExclusao = () => {
    setModalExclusaoAberto(false);
    setItemSelecionado(null);
  };
  const handleConfirmarExclusao = () => {
    setSementes((prev) => prev.filter((item) =>
      item.id !== itemSelecionado.id
    ));

    setModalExclusaoAberto(false);
    setItemSelecionado(null);
  }


  // 🧩 Definindo as colunas da tabela
  const colunas = [
    { key: "lote", label: "Lote" },
    { key: "nomePopular", label: "Nome popular" },
    { key: "dataTeste", label: "Data do Teste" },
    { key: "quantidade", label: "Quantidade" },
    { key: "camaraFria", label: "Câmara Fria" },
    { key: "dataGerminacao", label: "Data Germinação" },
    { key: "qntdGerminou", label: "Qntd Germinou(und)" },
    { key: "taxaGerminou", label: "Taxa Germinou %" },
  ];

  return (
    <div className="historico-container-banco">

      {/* Renderização dos 3 modais */}

      {/* MODAL DE DETALHES (Visualizar) */}
      
        <ModalDetalheGenerico
          isOpen={modalDetalheAberto}
          item={itemSelecionado} // Passa o item (para pegar a 'item.imagem')
          titulo="Detalhes da Vistoria"

          camposDetalhes={[]} // Deixamos vazio para usar o 'children'

          onClose={handleFecharModalDetalhe}
          onEditar={() => handleEditar(itemSelecionado)}
          onExcluir={() => handleExcluir(itemSelecionado)}

          // Configurado como na imagem
          mostrarHistorico={false}
          mostrarExportar={false}
          mostrarAcoes={true}
        >
          {/* Passa o componente customizado como 'children' */}
          <DetalhesTestes item={itemSelecionado} />
        </ModalDetalheGenerico>
    
      <EditarTeste
        isOpen={modalEdicaoAberto}
        onCancelar={handleCancelarEdicao}
        onSalvar={handleSalvarEdicao}
        teste={itemSelecionado}

      />
      <ModalExcluir
        isOpen={modalExclusaoAberto}
        onClose={handleCancelarExclusao}
        onConfirm={handleConfirmarExclusao}
        nomeItem={itemSelecionado?.nomePopular}
        titulo="Excluir Teste"
        mensagem={`Você tem certeza que deseja excluir o teste do lote ${itemSelecionado?.lote}?`}
        textoConfirmar="Excluir"
        textoCancelar="Cancelar"

      />
      <div className="historico-content-banco">
        <main>
          <TabelaComBuscaPaginacao
            titulo="Histórico de Teste de Germinação"
            dados={sementes}
            colunas={colunas}
            chaveBusca="nomePopular"
            onEditar={handleEditar}
            onConfirmar={handleVisualizar}
            onExcluir={handleExcluirTeste}
          />
        </main>
      </div>
    </div>
  );
};

export default HistoricoTestes;
