import React, { useState, useEffect } from "react";
import TabelaComBuscaPaginacao from "../../../components/TabelaComBuscaPaginacao/TabelaComBuscaPaginacao";

const GerarRelatorio = () => {
  const DADOS_RELATORIO_MOCK = [
    { Lote: 'A001', Nomepopular: 'Ipê-amarelo', DataTeste: '10/10/2024', Quantidade: '2000 kg', CamaraFria: 'Sim', DataGerminacao: '17/10/2024', QntdGerminou: 200, TaxaGerminou: '10%' },
    { Lote: 'A002', Nomepopular: 'Jacarandá', DataTeste: '12/10/2024', Quantidade: '1500 kg', CamaraFria: 'Não', DataGerminacao: '19/10/2024', QntdGerminou: 180, TaxaGerminou: '12%' },
    { Lote: 'A003', Nomepopular: 'Pau-brasil', DataTeste: '15/10/2024', Quantidade: '800 kg', CamaraFria: 'Sim', DataGerminacao: '22/10/2024', QntdGerminou: 120, TaxaGerminou: '15%' },
    { Lote: 'A004', Nomepopular: 'Cedro-rosa', DataTeste: '18/10/2024', Quantidade: '2200 kg', CamaraFria: 'Não', DataGerminacao: '25/10/2024', QntdGerminou: 250, TaxaGerminou: '11%' },
    { Lote: 'A005', Nomepopular: 'Jatobá', DataTeste: '20/10/2024', Quantidade: '1900 kg', CamaraFria: 'Sim', DataGerminacao: '27/10/2024', QntdGerminou: 210, TaxaGerminou: '11%' },
    { Lote: 'A006', Nomepopular: 'Ipê-roxo', DataTeste: '22/10/2024', Quantidade: '1600 kg', CamaraFria: 'Não', DataGerminacao: '29/10/2024', QntdGerminou: 190, TaxaGerminou: '12%' },
    { Lote: 'A007', Nomepopular: 'Angico', DataTeste: '25/10/2024', Quantidade: '2400 kg', CamaraFria: 'Sim', DataGerminacao: '01/11/2024', QntdGerminou: 260, TaxaGerminou: '11%' },
    { Lote: 'A008', Nomepopular: 'Sucupira', DataTeste: '28/10/2024', Quantidade: '1300 kg', CamaraFria: 'Não', DataGerminacao: '04/11/2024', QntdGerminou: 175, TaxaGerminou: '13%' },
    { Lote: 'A009', Nomepopular: 'Castanheira', DataTeste: '30/10/2024', Quantidade: '3000 kg', CamaraFria: 'Sim', DataGerminacao: '06/11/2024', QntdGerminou: 300, TaxaGerminou: '10%' },
    { Lote: 'A010', Nomepopular: 'Ipê-branco', DataTeste: '02/11/2024', Quantidade: '1700 kg', CamaraFria: 'Não', DataGerminacao: '09/11/2024', QntdGerminou: 195, TaxaGerminou: '11%' }
  ];

  const [relatorios, setRelatorios] = useState([]);

  useEffect(() => {
    setRelatorios(DADOS_RELATORIO_MOCK);
  }, []);

  // 🧩 Definindo as colunas da tabela
  const colunas = [
    { key: "Lote", label: "Lote" },
    { key: "Nomepopular", label: "Nome popular" },
    { key: "DataTeste", label: "Data do Teste" },
    { key: "Quantidade", label: "Quantidade" },
    { key: "CamaraFria", label: "Câmara Fria" },
    { key: "DataGerminacao", label: "Data Germinação" },
    { key: "QntdGerminou", label: "Qntd Germinou(und)" },
    { key: "TaxaGerminou", label: "Taxa Germinou %" },
  ];

  return (
    <div className="historico-container-banco">
      <div className="historico-content-banco">
        <main>
          <TabelaComBuscaPaginacao
            titulo="Relatório de Teste de Germinação"
            dados={relatorios}
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

export default GerarRelatorio;