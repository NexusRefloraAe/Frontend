import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import "./HistoricoPlantioStyler.css";


import EditarPlantioSementes from "./EditarPlantioSementes/EditarPlantioSementes";
import ModalExcluir from "../../../components/ModalExcluir/ModalExcluir";
import ModalDetalheGenerico from "../../../components/ModalDetalheGenerico/ModalDetalheGenerico";
import DetalhesPlantio from "./DetalhesPlantio/DetalhesPlantio";

const HistoricoPlantio = () => {
  const DADOS_SEMENTES_MOCK = [
    { lote: 'A001', dataPlantio: '10/10/2024', nomePopular: 'Ipê-amarelo', qntdSementes: 2000 , qntdPlantada: 200, tipoPlantio: 'Sementeira' },
    { lote: 'A002', dataPlantio: '12/10/2024', nomePopular: 'Jacarandá', qntdSementes: 1500 , qntdPlantada: 180, tipoPlantio: 'Saquinho' },
    { lote: 'A003', dataPlantio: '15/10/2024', nomePopular: 'Pau-brasil', qntdSementes: 800 , qntdPlantada: 120, tipoPlantio: 'Chão' },
    { lote: 'A004', dataPlantio: '18/10/2024', nomePopular: 'Cedro-rosa', qntdSementes: 2200 , qntdPlantada: 250, tipoPlantio: 'Sementeira' },
    { lote: 'A005', dataPlantio: '20/10/2024', nomePopular: 'Jatobá', qntdSementes: 1900 , qntdPlantada: 210, tipoPlantio: 'Saquinho' },
    { lote: 'A006', dataPlantio: '22/10/2024', nomePopular: 'Ipê-roxo', qntdSementes: 1600 , qntdPlantada: 190, tipoPlantio: 'Chão' },
    { lote: 'A007', dataPlantio: '25/10/2024', nomePopular: 'Angico', qntdSementes: 2400 , qntdPlantada: 260, tipoPlantio: 'Sementeira' },
    { lote: 'A008', dataPlantio: '28/10/2024', nomePopular: 'Sucupira', qntdSementes: 1300 , qntdPlantada: 175, tipoPlantio: 'Saquinho' },
    { lote: 'A009', dataPlantio: '30/10/2024', nomePopular: 'Castanheira', qntdSementes: 3000 , qntdPlantada: 300, tipoPlantio: 'Chão' },
    { lote: 'A010', dataPlantio: '02/11/2024', nomePopular: 'Ipê-branco', qntdSementes: 1700 , qntdPlantada: 195, tipoPlantio: 'Saquinho' },
    { lote: 'A011', dataPlantio: '05/11/2024', nomePopular: 'Sibipiruna', qntdSementes: 2100 , qntdPlantada: 230, tipoPlantio: 'Sementeira' },
    { lote: 'A012', dataPlantio: '08/11/2024', nomePopular: 'Pau-ferro', qntdSementes: 1400 , qntdPlantada: 185, tipoPlantio: 'Chão' },
    { lote: 'A013', dataPlantio: '10/11/2024', nomePopular: 'Jequitibá', qntdSementes: 2600 , qntdPlantada: 280, tipoPlantio: 'Saquinho' },
    { lote: 'A014', dataPlantio: '12/11/2024', nomePopular: 'Caroba', qntdSementes: 1100 , qntdPlantada: 150, tipoPlantio: 'Sementeira' },
    { lote: 'A015', dataPlantio: '15/11/2024', nomePopular: 'Embaúba', qntdSementes: 900 , qntdPlantada: 130, tipoPlantio: 'Chão' },
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
    setSementes((prev) => prev.map((item) =>
      item.id === dadosEditados.id ? dadosEditados : item
    ));
    
    setModalEdicaoAberto(false);
    setItemSelecionado(null);
  }
  const handleCancelarEdicao = () => {
    setModalEdicaoAberto(false);
    setItemSelecionado(null);
  };



  const handleExcluir = (item) => {
    setItemSelecionado(item);
    setModalDetalheAberto(false);
    setModalExclusaoAberto(true);
  };
  const handleCancelarExclusao = () => {
    setModalExclusaoAberto(false);
    setItemSelecionado(null);
  };
  const handleConfirmarExclusao = () => {
    if (plantioExcluindo) {
      setSementes((prev) => prev.filter((item) =>
        item.id !== itemSelecionado.id
      ));
      
    }
    setItemSelecionado(null);
    setModalExclusaoAberto(false);

  }

  // 🧩 Definindo as colunas da tabela
 const colunas = [
  { key: "lote", label: "Lote" },
  { key: "nomePopular", label: "Nome popular" },
  { key: "dataPlantio", label: "Data de plantio" },
  { key: "qntdSementes", label: "Qtd. Sementes (kg/g/un)" },
  { key: "qntdPlantada", label: "Qtd. Plantada" },
  { key: "tipoPlantio", label: "Tipo de Plantio" },
];


  return (
    <div className="historico-container-banco">

      {/* Renderização dos 3 modais */}

      {/* MODAL DE DETALHES (Visualizar) */}
      {modalDetalheAberto && itemSelecionado && (
        <ModalDetalheGenerico
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
          <DetalhesPlantio item={itemSelecionado} />
        </ModalDetalheGenerico>
      )}
      
      <EditarPlantioSementes
        isOpen={modalEdicaoAberto}
        onCancelar={handleCancelarEdicao}
        plantio={itemSelecionado}
        onSalvar={handleSalvarEdicao}

      />
      

      <ModalExcluir
        isOpen={modalExclusaoAberto}
        onClose={handleCancelarExclusao}
        onConfirm={handleConfirmarExclusao}
        nomeItem={itemSelecionado?.nomePopular}
        titulo="Excluir Plantio"
        mensagem={`Você tem certeza que deseja excluir o plantio do lote ${itemSelecionado?.lote}?`}
        textoConfirmar="Excluir"
        textoCancelar="Cancelar"
      />


      <div className="historico-content-banco">
        <main>
          <TabelaComBuscaPaginacao
            titulo="Histórico de Plantio"
            dados={sementes}
            colunas={colunas}
            chaveBusca="nomePopular"
            onEditar={handleEditar}
            onConfirmar={handleVisualizar}
            onExcluir={handleExcluir}
          />
        </main>
      </div>
    </div>
  );
};

export default HistoricoPlantio;
