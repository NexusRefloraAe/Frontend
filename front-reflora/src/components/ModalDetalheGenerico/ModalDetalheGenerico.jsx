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
  textoExclusao = "este item",
  children,
}) {
  const [paginaHistorico, setPaginaHistorico] = useState(1);
  const [historicoEntrada, setHistoricoEntrada] = useState(dadosEntrada);
  const [historicoSaida, setHistoricoSaida] = useState(dadosSaida);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

  useEffect(() => {
    // Só tentamos carregar ou resetar se o Modal estiver aberto
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
            console.error("Erro ao carregar histórico no modal:", error);
          }
        };
        carregar();
      } else {
        // Só atualiza se o estado atual for diferente das props para evitar o loop
        if (historicoEntrada !== dadosEntrada)
          setHistoricoEntrada(dadosEntrada);
        if (historicoSaida !== dadosSaida) setHistoricoSaida(dadosSaida);
      }
    } else {
      // Quando o modal fecha, resetamos a página para 1
      setPaginaHistorico(1);
    }
    // Remova dadosEntrada e dadosSaida das dependências se eles forem literais []
  }, [isOpen, item?.id, item?._id, onCarregarHistorico]);

  if (!isOpen || !item) return null;

  // Paginação
  const ITENS_PAGINA = 5;
  const totalItens = Math.max(historicoEntrada.length, historicoSaida.length);
  const totalPaginas = Math.ceil(totalItens / ITENS_PAGINA) || 1;
  const idxInicio = (paginaHistorico - 1) * ITENS_PAGINA;
  const idxFim = idxInicio + ITENS_PAGINA;

  const entradasPagina = historicoEntrada.slice(idxInicio, idxFim);
  const saidasPagina = historicoSaida.slice(idxInicio, idxFim);

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
            {/* SEÇÃO TOPO: FOTO + DADOS */}
            <div className="detalhe-top-generico">
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
                      onClick={() => setModalExcluirAberto(true)}
                      title="Excluir"
                    >
                      <img src={deleteIcon} alt="Excluir" />
                    </button>
                    <button
                      className="btn-generico"
                      onClick={() => onEditar && onEditar(item)}
                      title="Editar"
                    >
                      <img src={editIcon} alt="Editar" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* SEÇÃO INFERIOR: HISTÓRICO */}
            {mostrarHistorico && (
              <div className="hist-container-generico">
                <h3>Histórico de Movimentação</h3>
                <div className="hist-tabelas-generico">
                  <div className="wrapper-tab-generico">
                    <div className="titulo-tab-generico bg-ent-gen">
                      Entradas
                    </div>
                    <TabelaResponsiva
                      colunas={colunasEntrada}
                      dados={entradasPagina}
                      onPesquisar={null}
                    />
                  </div>
                  <div className="wrapper-tab-generico">
                    <div className="titulo-tab-generico bg-sai-gen">Saídas</div>
                    <TabelaResponsiva
                      colunas={colunasSaida}
                      dados={saidasPagina}
                      onPesquisar={null}
                    />
                  </div>
                </div>

                <div className="footer-generico">
                  <Paginacao
                    paginaAtual={paginaHistorico}
                    totalPaginas={totalPaginas}
                    onPaginaChange={setPaginaHistorico}
                  />
                  {mostrarExportar && (
                    <ExportButton data={[]} columns={[]} fileName="historico" />
                  )}
                </div>
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
