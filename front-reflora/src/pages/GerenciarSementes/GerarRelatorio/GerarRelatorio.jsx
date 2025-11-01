import React, { useState } from "react";
import FormGeral from "../../../components/FormGeral/FormGeral";
import TabelaComBuscaPaginacao from "../../../components/ListaGerenciarSementes/TabelaComBuscaPaginacao";
import "./GerarRelatorioStyler.css";
import Input from "../../../components/Input/Input";

const GerarRelatorio = () => {
  const [formData, setFormData] = useState({
      NomePopular: '',
      DataInicio: '',
      DataFinal: '',
    });
  
  const [dados, setDados] = useState([
    { Lote: "A001", Nomepopular: "Ipê-amarelo", Data: "01/11/2025", TipoMovimento: "Entrada", Quantidade: 350 },
    { Lote: "A001", Nomepopular: "Ipê-amarelo", Data: "01/11/2025", TipoMovimento: "Saída", Quantidade: 100 },
    { Lote: "A001", Nomepopular: "Ipê-amarelo", Data: "01/11/2025", TipoMovimento: "Saída", Quantidade: 200 },
    { Lote: "A001", Nomepopular: "Ipê-amarelo", Data: "01/11/2025", TipoMovimento: "Entrada", Quantidade: 900 },
    { Lote: "A001", Nomepopular: "Ipê-amarelo", Data: "01/11/2025", TipoMovimento: "Entrada", Quantidade: 1000 },
  ]);

  // Totais simulados
  const totalEntrada = 1000;
  const totalSaida = 500;
  const totalAtual = 10000;

  const colunas = [
    { key: "Lote", label: "Lote" },
    { key: "Nomepopular ", label: "Nome Popular" },
    { key: "Data", label: "Data" },
    { key: "TipoMovimento ", label: "Tipo de Movimento" },
    { key: "Quantidade", label: "Quantidade" },
  ];

  return (
    <div className="relatorio-container">
      {/* Filtros */}
      <div className="relatorio-filtros">
        <FormGeral
        title="Cadastro/Editar Plantio"
        // 5. A prop 'fields' foi removida
        actions={actions}
        onSubmit={handleSubmit}
        useGrid={true}
      >
        <Input/>
        </FormGeral>
    
      
      </div>

      <h3 className="mov-titulo">Movimentações da Semente</h3>

      {/* Cards Totais */}
      <div className="cards-totais">
        <div className="card-total verde">
          <h4>Total Entrada (kg)</h4>
          <p>{totalEntrada}</p>
        </div>
        <div className="card-total vermelho">
          <h4>Total Saída (und)</h4>
          <p>{totalSaida}</p>
        </div>
        <div className="card-total azul">
          <h4>Total Atual (kg)</h4>
          <p>{totalAtual}</p>
        </div>
      </div>

      {/* Tabela */}
      <TabelaComBuscaPaginacao
        titulo=""
        dados={dados}
        habilitarBusca = {false}
        colunas={colunas}
        chaveBusca="Nomepopular"
      />
    </div>
  );
};

export default GerarRelatorio;
