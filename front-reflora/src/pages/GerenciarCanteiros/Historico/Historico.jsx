import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";
import "./Historico.css";

const HistoricoCanteiro = () => {
  const DADOS_CANTEIROS_MOCK = [
    { NomeCanteiro: 'Canteiro 1', NomePopular: 'Ipê-amarelo', Quantidade: 5000, QuantidadeSaida: '' },
    { NomeCanteiro: 'Canteiro 2', NomePopular: 'Ipê-rosa', Quantidade: 2000, QuantidadeSaida: '' },
    { NomeCanteiro: 'Canteiro 3', NomePopular: 'Ipê-branco', Quantidade: 6000, QuantidadeSaida: '' },
    { NomeCanteiro: 'Canteiro 3', NomePopular: 'Ipê-branco', Quantidade: 6000, QuantidadeSaida: '' },
    { NomeCanteiro: 'Canteiro 3', NomePopular: 'Ipê-branco', Quantidade: 6000, QuantidadeSaida: '' },
    { NomeCanteiro: 'Canteiro 3', NomePopular: 'Ipê-branco', Quantidade: 6000, QuantidadeSaida: '' },
    { NomeCanteiro: 'Canteiro 3', NomePopular: 'Ipê-branco', Quantidade: 6000, QuantidadeSaida: '' },
  ];

  const [canteiros, setCanteiros] = useState([]);

  useEffect(() => {
    setCanteiros(DADOS_CANTEIROS_MOCK);
  }, []);

  // 🧩 Definindo as colunas da tabela
  const colunas = [
    { key: "NomeCanteiro", label: "Nome dos Canteiros" },
    { key: "NomePopular", label: "Nome Popular" },
    { key: "Quantidade", label: "Quantidade" },
    { key: "QuantidadeSaida", label: "Quantidade Saída" },
  ];

  return (
    <div className="historico-container-canteiro">
      <div className="historico-content-canteiro">
        <main>
          <TabelaComBuscaPaginacao
            titulo="Histórico de Canteiro"
            dados={canteiros}
            colunas={colunas}
            chaveBusca="NomePopular"
            onEditar={(item) => console.log("Editar:", item)}
            onConfirmar={(item) => console.log("Confirmar:", item)}
            onExcluir={(item) => console.log("Excluir:", item)}
          />
        </main>
      </div>
    </div>
  );
};

export default HistoricoCanteiro;