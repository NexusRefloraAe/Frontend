import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import "./HistoricoPlantioStyler.css";
import EditarPlantioSementes from "../EditarPlantioSementes/EditarPlantioSementes";
import ModalExcluir from "../../../components/ModalExcluir/ModalExcluir";

const HistoricoPlantio = () => {
  const DADOS_SEMENTES_MOCK = [
    { Lote: 'A001', Dataplantio: '10/10/2024', Nomepopular: 'Ipê-amarelo', QntdSementes: '2000 kg', Qntdplantada: 200, TipoPlantio: 'Sementeira' },
    { Lote: 'A002', Dataplantio: '12/10/2024', Nomepopular: 'Jacarandá', QntdSementes: '1500 kg', Qntdplantada: 180, TipoPlantio: 'Saquinho' },
    { Lote: 'A003', Dataplantio: '15/10/2024', Nomepopular: 'Pau-brasil', QntdSementes: '800 kg', Qntdplantada: 120, TipoPlantio: 'Chão' },
    { Lote: 'A004', Dataplantio: '18/10/2024', Nomepopular: 'Cedro-rosa', QntdSementes: '2200 kg', Qntdplantada: 250, TipoPlantio: 'Sementeira' },
    { Lote: 'A005', Dataplantio: '20/10/2024', Nomepopular: 'Jatobá', QntdSementes: '1900 kg', Qntdplantada: 210, TipoPlantio: 'Saquinho' },
    { Lote: 'A006', Dataplantio: '22/10/2024', Nomepopular: 'Ipê-roxo', QntdSementes: '1600 kg', Qntdplantada: 190, TipoPlantio: 'Chão' },
    { Lote: 'A007', Dataplantio: '25/10/2024', Nomepopular: 'Angico', QntdSementes: '2400 kg', Qntdplantada: 260, TipoPlantio: 'Sementeira' },
    { Lote: 'A008', Dataplantio: '28/10/2024', Nomepopular: 'Sucupira', QntdSementes: '1300 kg', Qntdplantada: 175, TipoPlantio: 'Saquinho' },
    { Lote: 'A009', Dataplantio: '30/10/2024', Nomepopular: 'Castanheira', QntdSementes: '3000 kg', Qntdplantada: 300, TipoPlantio: 'Chão' },
    { Lote: 'A010', Dataplantio: '02/11/2024', Nomepopular: 'Ipê-branco', QntdSementes: '1700 kg', Qntdplantada: 195, TipoPlantio: 'Saquinho' },
    { Lote: 'A011', Dataplantio: '05/11/2024', Nomepopular: 'Sibipiruna', QntdSementes: '2100 kg', Qntdplantada: 230, TipoPlantio: 'Sementeira' },
    { Lote: 'A012', Dataplantio: '08/11/2024', Nomepopular: 'Pau-ferro', QntdSementes: '1400 kg', Qntdplantada: 185, TipoPlantio: 'Chão' },
    { Lote: 'A013', Dataplantio: '10/11/2024', Nomepopular: 'Jequitibá', QntdSementes: '2600 kg', Qntdplantada: 280, TipoPlantio: 'Saquinho' },
    { Lote: 'A014', Dataplantio: '12/11/2024', Nomepopular: 'Caroba', QntdSementes: '1100 kg', Qntdplantada: 150, TipoPlantio: 'Sementeira' },
    { Lote: 'A015', Dataplantio: '15/11/2024', Nomepopular: 'Embaúba', QntdSementes: '900 kg', Qntdplantada: 130, TipoPlantio: 'Chão' }
  ];

  const [sementes, setSementes] = useState([]);

  const [plantioEditando, setPlantioEditando] = useState(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);

  const [plantioExcluindo,setPlantioExcluindo]= useState(null);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);

  useEffect(() => {
    setSementes(DADOS_SEMENTES_MOCK);
  }, []);


  // 3. Handlers para abrir/fechar modais


  const handleEditar = (plantio) => {
    setPlantioEditando(plantio);
    setModalEdicaoAberto(true);
  };
  const handleSalvarEdicao = (dadosEditados) => {
    setSementes((prev) => prev.map((item) => 
      item.Lote === plantioEditando.Lote ? dadosEditados : item
  ));
    console.log("Plantio atualizado:", dadosEditados);
    setModalEdicaoAberto(false);
    setPlantioEditando(null);
  }
   const handleCancelarEdicao = () => {
    setModalEdicaoAberto(false);
    setPlantioEditando(null);
  };


  const handleExcluir = (plantio) => {
    setPlantioExcluindo(plantio);
    setModalExclusaoAberto(true);
  };
  const handleCancelarExclusao = () => {
    setPlantioExcluindo(null);
    setModalExclusaoAberto(false);
  };
  const handleConfirmarExclusao = () => {
    if(plantioExcluindo){
      setSementes((prev) => prev.filter((item) => 
        item.Lote !== plantioExcluindo.Lote
    ));
    console.log("Excluindo plantio:", plantioExcluindo);
    }
    setPlantioExcluindo(null);
    setModalExclusaoAberto(false);
    
  }

  // 🧩 Definindo as colunas da tabela
  const colunas = [
    { key: "lote", label: "Lote" },
    { key: "nomeopular", label: "Nome popular" },
    { key: "dataPlantio", label: "Data de plantio" },
    { key: "qntdSementes", label: "Qtd. Sementes (kg/g/un)" },
    { key: "qntdPlantada", label: "Qtd. Plantada" },
    { key: "tipoPlantio", label: "Tipo de Plantio" },
  ];

  return (
    <div className="historico-container-banco">
      {modalEdicaoAberto && (
        <EditarPlantioSementes
          isOpen={modalEdicaoAberto}
          onCancelar={handleCancelarEdicao}
          plantio={plantioEditando}
          onSalvar={handleSalvarEdicao}
          />
      )}
      

      
        




      <ModalExcluir
        isOpen={modalExclusaoAberto}
        onClose={handleCancelarExclusao}
        onConfirm={handleConfirmarExclusao}
        nomeItem={plantioExcluindo?.Nomepopular}
        titulo="Excluir Plantio"
        mensagem={`Você tem certeza que deseja excluir o plantio do lote ${plantioExcluindo?.Lote}?`}
        textoConfirmar="Excluir"
        textoCancelar="Cancelar"
      />


      <div className="historico-content-banco">
        <main>
          <TabelaComBuscaPaginacao
            titulo="Histórico de Plantio"
            dados={sementes}
            colunas={colunas}
            chaveBusca="Nomepopular"
            onEditar={handleEditar}
            onConfirmar={(item) => console.log("Confirmar:", item)}
            onExcluir={handleExcluir}
          />
        </main>
      </div>
    </div>
  );
};

export default HistoricoPlantio;
