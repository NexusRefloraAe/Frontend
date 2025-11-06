import React, { useState, useEffect } from "react";
import TabelaSelecionar from "../../../components/TabelaSelecionar/TabelaSelecionar";

const Historico = () => {
  const DADOS_CANTEIROS_MOCK = [
    { id: 1, NomeCanteiro: 'Canteiro 1', NomePopular: 'Ipê-amarelo', Quantidade: 5000 },
    { id: 2, NomeCanteiro: 'Canteiro 2', NomePopular: 'Ipê-rosa', Quantidade: 2000 },
    { id: 3, NomeCanteiro: 'Canteiro 3', NomePopular: 'Ipê-branco', Quantidade: 6000 },
    { id: 4, NomeCanteiro: 'Canteiro 4', NomePopular: 'Ipê-branco', Quantidade: 6000 },
    { id: 5, NomeCanteiro: 'Canteiro 5', NomePopular: 'Ipê-branco', Quantidade: 6000 },
    { id: 6, NomeCanteiro: 'Canteiro 6', NomePopular: 'Ipê-branco', Quantidade: 6000 },
    { id: 7, NomeCanteiro: 'Canteiro 7', NomePopular: 'Ipê-branco', Quantidade: 6000 },
    { id: 8, NomeCanteiro: 'Canteiro 8', NomePopular: 'Ipê-roxo', Quantidade: 3000 },
    { id: 9, NomeCanteiro: 'Canteiro 9', NomePopular: 'Ipê-verde', Quantidade: 4000 },
    { id: 10, NomeCanteiro: 'Canteiro 10', NomePopular: 'Ipê-amarelo', Quantidade: 2500 },
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
  ];

  // Função para lidar com a seleção de itens
  const handleSelecionarItens = (itensSelecionados) => {
    console.log("Itens selecionados para saída:", itensSelecionados);
    
    if (itensSelecionados.length === 0) {
      alert("Nenhum item selecionado!");
      return;
    }

    // Exemplo de processamento - atualizar o estado local
    const canteirosAtualizados = [...canteiros];
    
    itensSelecionados.forEach(({ item, quantidade }) => {
      console.log(`Processando saída: ${item.NomeCanteiro} - ${quantidade} unidades`);
      
      // Encontrar o índice do canteiro no array
      const index = canteirosAtualizados.findIndex(c => c.id === item.id);
      if (index !== -1) {
        // Atualizar a quantidade (subtraindo a saída)
        canteirosAtualizados[index].Quantidade = Math.max(
          0, 
          canteirosAtualizados[index].Quantidade - quantidade
        );
      }
    });

    // Atualizar o estado com as quantidades reduzidas
    setCanteiros(canteirosAtualizados);
    
    alert(`Saída confirmada para ${itensSelecionados.length} item(ns)!`);
  };

  // Função para lidar com mudanças individuais de quantidade
  const handleQuantidadeChange = (item, quantidade) => {
    console.log(`Quantidade alterada para ${item.NomeCanteiro}: ${quantidade}`);
    // Aqui você pode fazer validações adicionais se necessário
  };

  return (
    <div className="historico-page-container">
      <div className="historico-content-wrapper">
        <TabelaSelecionar
          titulo="Histórico de Canteiro"
          dados={canteiros}
          colunas={colunas}
          chaveBusca="NomePopular"
          onSelecionar={handleSelecionarItens}
          onQuantidadeChange={handleQuantidadeChange}
          chaveQuantidade="Quantidade"
          textoBotaoConfirmar="Confirmar Saída"
          itensPorPagina={7}
          habilitarBusca={true}
          modoBusca="auto"
        />
      </div>
    </div>
  );
};

export default Historico;