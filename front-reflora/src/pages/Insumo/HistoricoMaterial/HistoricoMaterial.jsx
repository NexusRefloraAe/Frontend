import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import EditarMaterial from "../EditarMaterial/EditarMaterial";
import ModalExcluir from "../../../components/ModalExcluir/ModalExcluir";
import './HistoricoMaterial.css';

const HistoricoMaterial = () => {
  const DADOS_HISTORICO_MATERIAL_MOCK = [
    { NomeInsumo: 'Adubo', Data: '11/09/2025', Status: 'Entrada', Quantidade: 500, UnidadeMedida: 'Kg', ResponsavelEntrega: 'Arthur', ResponsavelRecebe: 'Ramil' },
    { NomeInsumo: 'Terra', Data: '11/09/2025', Status: 'Saída', Quantidade: 100, UnidadeMedida: 'Kg', ResponsavelEntrega: 'Ramil', ResponsavelRecebe: 'Arthur' },
    { NomeInsumo: 'Adubo', Data: '11/09/2025', Status: 'Saída', Quantidade: 100, UnidadeMedida: 'Kg', ResponsavelEntrega: 'Arthur', ResponsavelRecebe: 'Ramil' },
    { NomeInsumo: 'Substrato', Data: '11/09/2025', Status: 'Saída', Quantidade: 750, UnidadeMedida: 'Kg', ResponsavelEntrega: 'Ramil', ResponsavelRecebe: 'Arthur' },
    { NomeInsumo: 'Terra', Data: '11/09/2025', Status: 'Entrada', Quantidade: 500, UnidadeMedida: 'Kg', ResponsavelEntrega: 'Arthur', ResponsavelRecebe: 'Ramil' },
    { NomeInsumo: 'Sementes', Data: '12/09/2025', Status: 'Entrada', Quantidade: 2000, UnidadeMedida: 'und', ResponsavelEntrega: 'Maria', ResponsavelRecebe: 'João' },
    { NomeInsumo: 'Fertilizante', Data: '13/09/2025', Status: 'Saída', Quantidade: 300, UnidadeMedida: 'L', ResponsavelEntrega: 'João', ResponsavelRecebe: 'Maria' },
    { NomeInsumo: 'Adubo Orgânico', Data: '14/09/2025', Status: 'Entrada', Quantidade: 1000, UnidadeMedida: 'Kg', ResponsavelEntrega: 'Carlos', ResponsavelRecebe: 'Ana' },
    { NomeInsumo: 'Plástico para Estufa', Data: '15/09/2025', Status: 'Saída', Quantidade: 50, UnidadeMedida: 'm²', ResponsavelEntrega: 'Ana', ResponsavelRecebe: 'Carlos' },
    { NomeInsumo: 'Água', Data: '16/09/2025', Status: 'Entrada', Quantidade: 10000, UnidadeMedida: 'L', ResponsavelEntrega: 'Pedro', ResponsavelRecebe: 'Lucas' },
  ];

  const [dados, setDados] = useState([]);
  const [materialEditando, setMaterialEditando] = useState(null);
  const [materialExcluindo, setMaterialExcluindo] = useState(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  
  // Estados para paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(5);
  const [termoBusca, setTermoBusca] = useState('');

  useEffect(() => {
    setDados(DADOS_HISTORICO_MATERIAL_MOCK);
  }, []);

  const handleEditar = (material) => {
    setMaterialEditando(material);
    setModalEdicaoAberto(true);
  };

  const handleExcluir = (material) => {
    setMaterialExcluindo(material);
    setModalExclusaoAberto(true);
  };

  const handleSalvarEdicao = (dadosEditados) => {
    setDados(prev => prev.map(item => 
      item.NomeInsumo === materialEditando.NomeInsumo && 
      item.Data === materialEditando.Data ? 
      { 
        ...item, 
        NomeInsumo: dadosEditados.nomeInsumo,
        Status: dadosEditados.status,
        Quantidade: dadosEditados.quantidade,
        UnidadeMedida: dadosEditados.unidadeMedida,
        Data: dadosEditados.dataRegistro,
        ResponsavelEntrega: dadosEditados.responsavelEntrega,
        ResponsavelRecebe: dadosEditados.responsavelReceber
      } : item
    ));
    
    console.log("Material atualizado:", dadosEditados);
    setModalEdicaoAberto(false);
    setMaterialEditando(null);
  };

  const handleConfirmarExclusao = () => {
    if (materialExcluindo) {
      setDados(prev => prev.filter(item => 
        !(item.NomeInsumo === materialExcluindo.NomeInsumo && 
          item.Data === materialExcluindo.Data)
      ));
      console.log("Material excluído:", materialExcluindo);
    }
    setModalExclusaoAberto(false);
    setMaterialExcluindo(null);
  };

  const handleCancelarEdicao = () => {
    setModalEdicaoAberto(false);
    setMaterialEditando(null);
  };

  const handleCancelarExclusao = () => {
    setModalExclusaoAberto(false);
    setMaterialExcluindo(null);
  };

  // Função para lidar com a busca
  const handleBuscaChange = (termo) => {
    setTermoBusca(termo);
    setPaginaAtual(1);
  };

  const colunas = [
    { key: "NomeInsumo", label: "Nome do Insumo" },
    { key: "Data", label: "Data" },
    { key: "Status", label: "Status" },
    { key: "Quantidade", label: "Quantidade" },
    { key: "UnidadeMedida", label: "Unidade de Medida" },
    { key: "ResponsavelEntrega", label: "Responsável pela Entrega" },
    { key: "ResponsavelRecebe", label: "Responsável por Receber" },
  ];

  return (
    <div className="historico-material-container">
      {/* MODAL DE EDIÇÃO DE MATERIAL */}
      <EditarMaterial
        isOpen={modalEdicaoAberto}
        onClose={handleCancelarEdicao}
        material={materialEditando}
        onSalvar={handleSalvarEdicao}
      />

      {/* MODAL DE EXCLUSÃO */}
      <ModalExcluir
        isOpen={modalExclusaoAberto}
        onClose={handleCancelarExclusao}
        onConfirm={handleConfirmarExclusao}
        nomeItem={materialExcluindo?.NomeInsumo}
        titulo="Excluir Material"
        mensagem={`Tem certeza que deseja excluir "${materialExcluindo?.NomeInsumo}" do histórico? Esta ação não pode ser desfeita.`}
        textoConfirmar="Excluir"
        textoCancelar="Cancelar"
      />

      <div className="tabela-wrapper">
        <TabelaComBuscaPaginacao
          titulo="Histórico de Movimentação de Materiais"
          dados={dados}
          colunas={colunas}
          chaveBusca="NomeInsumo"
          mostrarBusca={true}
          mostrarAcoes={true}
          onEditar={handleEditar}
          onConfirmar={(item) => console.log("Visualizar:", item)}
          onExcluir={handleExcluir}
          // Props de paginação ADICIONADAS
          paginaAtual={paginaAtual}
          itensPorPagina={itensPorPagina}
          onPaginaChange={setPaginaAtual}
          onItensPorPaginaChange={setItensPorPagina}
          onBuscaChange={handleBuscaChange}
          termoBusca={termoBusca}
        />
      </div>
    </div>
  );
};

export default HistoricoMaterial;