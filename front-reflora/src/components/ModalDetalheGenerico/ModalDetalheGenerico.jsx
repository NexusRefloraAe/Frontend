import React, { useState, useEffect } from "react";
import "./ModalDetalheGenerico.css";
import Paginacao from "../Paginacao/Paginacao";
import ExportButton from "../ExportButton/ExportButton";
import TabelaResponsiva from "../TabelaResponsiva/TabelaResponsiva";
import ModalExcluir from "../ModalExcluir/ModalExcluir";
import closeIcon from "../../assets/close.svg";
import editIcon from "../../assets/edit.svg";
import deleteIcon from "../../assets/delete.svg";

function ModalDetalheGenerico({
  isOpen = false,
  item = {},
  titulo = "Detalhes",
  camposDetalhes = [],
  colunasEntrada = [],
  colunasSaida = [],
  dadosEntrada = [],
  dadosSaida = [],
  onCarregarHistorico,
  onClose,
  onEditar,
  onExcluir,
  mostrarAcoes = true,
  mostrarHistorico = true,
  mostrarExportar = true,
  mostrarImagem = true, // <--- NOVA PROP (Padrão true para manter compatibilidade)
  textoExclusao = "este item",
  children,
  onExportarPdf,
  onExportarCsv
}) {
  // 1. Estados de página separados para cada tabela
  const [paginaEntrada, setPaginaEntrada] = useState(1);
  const [paginaSaida, setPaginaSaida] = useState(1);

  const [historicoEntrada, setHistoricoEntrada] = useState(dadosEntrada);
  const [historicoSaida, setHistoricoSaida] = useState(dadosSaida);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

  const ITENS_PAGINA = 5; // Quantidade de linhas por página no modal

  useEffect(() => {
    if (isOpen) {
      if (onCarregarHistorico && (item?.id || item?._id)) {
        const carregar = async () => {
          try {
            const dados = await onCarregarHistorico(item.id || item._id);
            if (dados) {
              setHistoricoEntrada(dados.entradas || []);
              setHistoricoSaida(dados.saidas || []);
            }
          } catch (error) {
            console.error("Erro ao carregar histórico:", error);
          }
        };
        carregar();
      } else {
        if (historicoEntrada !== dadosEntrada)
          setHistoricoEntrada(dadosEntrada);
        if (historicoSaida !== dadosSaida) setHistoricoSaida(dadosSaida);
      }
    } else {
      setPaginaHistorico(1);
    }
  }, [isOpen, item?.id, item?._id, onCarregarHistorico]);

  if (!isOpen || !item) return null;

  const ITENS_PAGINA = 5;
  const totalItens = Math.max(historicoEntrada.length, historicoSaida.length);
  const totalPaginas = Math.ceil(totalItens / ITENS_PAGINA) || 1;
  const idxInicio = (paginaHistorico - 1) * ITENS_PAGINA;
  const idxFim = idxInicio + ITENS_PAGINA;

  // 3. Lógica de fatiamento (Slice) para SAÍDAS
  const totalPaginasSaida =
    Math.ceil(historicoSaida.length / ITENS_PAGINA) || 1;
  const saidasPaginadas = historicoSaida.slice(
    (paginaSaida - 1) * ITENS_PAGINA,
    paginaSaida * ITENS_PAGINA
  );

  const obterValor = (campo) => {
    const val = item[campo.chave];
    if (campo.formatar && typeof campo.formatar === "function")
      return campo.formatar(val, item);
    return val !== null && val !== undefined && val !== "" ? val : "-";
  };

  const imagemUrl = item.imagem || item.fotoUrl || item.foto || null;
  const nomeItem = item.nome || item.nomePopular || "Item";

  return (
    <>
      <div className="modal-overlay-generico" onClick={onClose}>
        <div
          className="modal-content-generico"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header-generico">
            <h2>{titulo}</h2>
            <button className="close-btn-generico" onClick={onClose}>
              <img src={closeIcon} alt="Fechar" />
            </button>
          </div>

          <div className="modal-body-generico">
            {/* SEÇÃO TOPO: FOTO + DADOS (Mantido) */}
            <div className="detalhe-top-generico">
              
              {/* --- AQUI ESTÁ A MUDANÇA: Verifica se deve mostrar a imagem --- */}
              {mostrarImagem && (
                <div className="img-wrapper-generico">
                  {imagemUrl ? (
                    <img
                      src={imagemUrl}
                      alt="Item"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    <span style={{ color: "#ccc", fontWeight: "bold" }}>
                      Sem Foto
                    </span>
                  )}
                </div>
              )}

              <div className="dados-acoes-wrapper">
                <div className="info-grid-generico">
                  {camposDetalhes.map((campo, idx) => (
                    <div className="info-item-generico" key={idx}>
                      <label>{campo.label}</label>
                      <span>{obterValor(campo)}</span>
                    </div>
                  ))}
                  {children}
                </div>
                {mostrarAcoes && (
                  <div className="acoes-generico">
                    <button
                      className="btn-generico"
                      onClick={() => onEditar && onEditar(item)}
                      title="Editar"
                    >
                      <img src={editIcon} alt="Editar" />
                    </button>
                    <button
                      className="btn-generico"
                      onClick={() => setModalExcluirAberto(true)}
                      title="Excluir"
                    >
                      <img src={deleteIcon} alt="Excluir" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* SEÇÃO INFERIOR: HISTÓRICO COM PAGINAÇÃO INDEPENDENTE */}
            {mostrarHistorico && (
              <div className="hist-container-generico">
                <h3>Histórico de Movimentação</h3>
                <div className="hist-tabelas-generico">
                  {/* Tabela de Entradas */}
                  <div className="wrapper-tab-generico">
                    <div className="titulo-tab-generico bg-ent-gen">
                      Entradas
                    </div>
                    <TabelaResponsiva
                      colunas={colunasEntrada}
                      dados={entradasPaginadas}
                      onPesquisar={null}
                      footerContent={
                        totalPaginasEntrada > 1 && (
                          <Paginacao
                            paginaAtual={paginaEntrada}
                            totalPaginas={totalPaginasEntrada}
                            onPaginaChange={setPaginaEntrada}
                          />
                        )
                      }
                    />
                  </div>

                  {/* Tabela de Saídas */}
                  <div className="wrapper-tab-generico">
                    <div className="titulo-tab-generico bg-sai-gen">Saídas</div>
                    <TabelaResponsiva
                      colunas={colunasSaida}
                      dados={saidasPaginadas}
                      onPesquisar={null}
                      footerContent={
                        totalPaginasSaida > 1 && (
                          <Paginacao
                            paginaAtual={paginaSaida}
                            totalPaginas={totalPaginasSaida}
                            onPaginaChange={setPaginaSaida}
                          />
                        )
                      }
                    />
                  </div>
                </div>

                {/* Botão de Exportar no rodapé geral do histórico */}
                {mostrarExportar && (
                  <div className="footer-exportar-modal">
                    <ExportButton
                      onExportPDF={onExportarPdf}
                      onExportCSV={onExportarCsv}
                      fileName={`Historico_${nomeItem}`}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ModalExcluir
        isOpen={modalExcluirAberto}
        onClose={() => setModalExcluirAberto(false)}
        onConfirm={() => {
          onExcluir && onExcluir(item);
          setModalExcluirAberto(false);
          onClose();
        }}
        titulo="Confirmar Exclusão"
        mensagem={`Deseja excluir "${nomeItem}"?`}
        nomeItem={nomeItem}
      />
    </>
  );
}

export default ModalDetalheGenerico;