import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import EditarInspecao from "../EditarInspecao/EditarInspecao"; 
import ModalExcluir from "../../../components/ModalExcluir/ModalExcluir"; 



const HistoricoInspecao = () => {
  
  const DADOS_INSPECAO_MOCK = [
    // Adicionei 'id' para facilitar a edição/exclusão
    { id: 1, Lote: 'A001', NomePopular: 'Ipê-amarelo', DataInspecao: '20/05/2025', TratosCulturais: 'Regação', PragasDoencas: 'Nenhuma', EstadoSaude: 'Boa', Qntd: 700, Observacoes: 'Lorem ipsum' },
    { id: 2, Lote: 'A002', NomePopular: 'Jacarandá-mimoso', DataInspecao: '20/05/2025', TratosCulturais: 'Regação', PragasDoencas: 'Nenhuma', EstadoSaude: 'Ruim', Qntd: 300, Observacoes: 'Boa' },
    { id: 3, Lote: 'A005', NomePopular: 'Aroeira', DataInspecao: '20/05/2025', TratosCulturais: 'Regação', PragasDoencas: 'Nenhuma', EstadoSaude: 'Em tratamento', Qntd: 700, Observacoes: 'Boa' },
    { id: 4, Lote: 'A007', NomePopular: 'Pau-brasil', DataInspecao: '20/05/2025', TratosCulturais: 'Adubação', PragasDoencas: 'Nenhuma', EstadoSaude: 'Boa', Qntd: 700, Observacoes: 'Lorem ipsum' },
    { id: 5, Lote: 'A007', NomePopular: 'Ipê-amarelo', DataInspecao: '20/05/2025', TratosCulturais: 'Adubação', PragasDoencas: 'Nenhuma', EstadoSaude: 'Boa', Qntd: 300, Observacoes: 'Lorem ipsum' },
    { id: 6, Lote: 'A008', NomePopular: 'Cedro-rosa', DataInspecao: '21/05/2025', TratosCulturais: 'Poda', PragasDoencas: 'Cochonilha', EstadoSaude: 'Em tratamento', Qntd: 150, Observacoes: 'Aplicado inseticida' },
    { id: 7, Lote: 'A009', NomePopular: 'Jatobá', DataInspecao: '21/05/2025', TratosCulturais: 'Regação', PragasDoencas: 'Nenhuma', EstadoSaude: 'Boa', Qntd: 500, Observacoes: '' },
    { id: 8, Lote: 'A010', NomePopular: 'Sibipiruna', DataInspecao: '22/05/2025', TratosCulturais: 'Regação', PragasDoencas: 'Nenhuma', EstadoSaude: 'Boa', Qntd: 600, Observacoes: 'Tudo OK' },
    { id: 9, Lote: 'A011', NomePopular: 'Angico', DataInspecao: '22/05/2025', TratosCulturais: 'Adubação', PragasDoencas: 'Pulgões', EstadoSaude: 'Em tratamento', Qntd: 250, Observacoes: 'Tratamento iniciado' },
    { id: 10, Lote: 'A012', NomePopular: 'Pau-ferro', DataInspecao: '23/05/2025', TratosCulturais: 'Regação', PragasDoencas: 'Nenhuma', EstadoSaude: 'Boa', Qntd: 800, Observacoes: '' },
  ];

  // 2. Estados para modais e dados
  const [dados, setDados] = useState([]);
  const [inspecaoEditando, setInspecaoEditando] = useState(null);
  const [inspecaoExcluindo, setInspecaoExcluindo] = useState(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  
  // Estados para paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(5); 
  const [termoBusca, setTermoBusca] = useState('');

  useEffect(() => {
    setDados(DADOS_INSPECAO_MOCK);
  }, []);

  // 3. Handlers para abrir/fechar modais
  
  const handleEditar = (inspecao) => {
    setInspecaoEditando(inspecao);
    setModalEdicaoAberto(true);
  };

  const handleExcluir = (inspecao) => {
    setInspecaoExcluindo(inspecao);
    setModalExclusaoAberto(true);
  };

  const handleSalvarEdicao = (dadosEditados) => {
    setDados(prev => prev.map(item => 
      item.id === inspecaoEditando.id ? dadosEditados : item
    ));
    
    console.log("Inspeção atualizada:", dadosEditados);
    setModalEdicaoAberto(false);
    setInspecaoEditando(null);
  };

  const handleConfirmarExclusao = () => {
    if (inspecaoExcluindo) {
      setDados(prev => prev.filter(item => 
        item.id !== inspecaoExcluindo.id
      ));
      console.log("Inspeção excluída:", inspecaoExcluindo);
    }
    setModalExclusaoAberto(false);
    setInspecaoExcluindo(null);
  };

  const handleCancelarEdicao = () => {
    setModalEdicaoAberto(false);
    setInspecaoEditando(null);
  };

  const handleCancelarExclusao = () => {
    setModalExclusaoAberto(false);
    setInspecaoExcluindo(null);
  };

  const handleBuscaChange = (termo) => {
    setTermoBusca(termo);
    setPaginaAtual(1);
  };

  // Colunas da tabela
  const colunas = [
    { key: "Lote", label: "Lote" },
    { key: "NomePopular", label: "Nome Popular" },
    { key: "DataInspecao", label: "Data da Inspeção" },
    { key: "TratosCulturais", label: "Tratos Culturais" },
    { key: "PragasDoencas", label: "Pragas/Doenças" },
    { key: "EstadoSaude", label: "Estado de Saúde" },
    { key: "Qntd", label: "Qntd" },
    { key: "Observacoes", label: "Observações" },
  ];

  return (
    <div className="historico-container-banco"> 

      {/* 4. MODAL DE EDIÇÃO */}
      {/* (Renderização condicional curta evita carregar o form desnecessariamente) */}
      {modalEdicaoAberto && (
          <EditarInspecao
            isOpen={modalEdicaoAberto}
            onClose={handleCancelarEdicao}
            inspecao={inspecaoEditando}
            onSalvar={handleSalvarEdicao}
          />
      )}

      {/* 5. MODAL DE EXCLUSÃO */}
      <ModalExcluir
        isOpen={modalExclusaoAberto}
        onClose={handleCancelarExclusao}
        onConfirm={handleConfirmarExclusao}
        nomeItem={inspecaoExcluindo?.NomePopular}
        titulo="Excluir Inspeção"
        mensagem={`Tem certeza que deseja excluir a inspeção do lote "${inspecaoExcluindo?.Lote} - ${inspecaoExcluindo?.NomePopular}"? Esta ação não pode ser desfeita.`}
        textoConfirmar="Excluir"
        textoCancelar="Cancelar"
      />

      <div className="">
        <main>
          {/* 6. TABELA COM PROPS DE AÇÃO E PAGINAÇÃO */}
          <TabelaComBuscaPaginacao
            titulo="Histórico de Inspeção"
            dados={dados}
            colunas={colunas}
            chaveBusca="NomePopular"
            
            mostrarBusca={true}
            mostrarAcoes={true}

            onEditar={handleEditar} // Passa a função
            onExcluir={handleExcluir} // Passa a função

            paginaAtual={paginaAtual}
            itensPorPagina={itensPorPagina}
            onPaginaChange={setPaginaAtual}
            onItensPorPaginaChange={setItensPorPagina}
            onBuscaChange={handleBuscaChange}
            termoBusca={termoBusca}

            footerContent={
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button 
                  className="btn-exportar"
                  onClick={() => alert('Relatório exportado com sucesso!')}
                >
                  Exportar ↑
                </button>
              </div>
            }
          />
        </main>
      </div>
    </div>
  );
};

export default HistoricoInspecao;