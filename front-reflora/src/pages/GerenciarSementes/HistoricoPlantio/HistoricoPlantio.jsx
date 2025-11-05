// src/pages/HistoricoPlantio/HistoricoPlantio.jsx
import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import "./HistoricoPlantioStyler.css";

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

  useEffect(() => {
    setSementes(DADOS_SEMENTES_MOCK);
  }, []);

  // 🧩 Definindo as colunas da tabela
  const colunas = [
    { key: "Lote", label: "Lote" },
    { key: "Nomepopular", label: "Nome popular" },
    { key: "Dataplantio", label: "Data de plantio" },
    { key: "QntdSementes", label: "Qtd. Sementes (kg/g/un)" },
    { key: "Qntdplantada", label: "Qtd. Plantada" },
    { key: "TipoPlantio", label: "Tipo de Plantio" },
  ];

  return (
    <div className="historico-container-banco">
      <div className="historico-content-banco">
        <main>
          <TabelaComBuscaPaginacao
            titulo="Histórico de Plantio"
            dados={sementes}
            colunas={colunas}
            chaveBusca="Nomepopular"
            onEditar={(item) => console.log("Editar:", item)}
            onConfirmar={(item) => console.log("Confirmar:", item)}
            onExcluir={(item) => console.log("Excluir:", item)}
          />
        </main>
      </div>
    </div>
  );
};

export default HistoricoPlantio;
