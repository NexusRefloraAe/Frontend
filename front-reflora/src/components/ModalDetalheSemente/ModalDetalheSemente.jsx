import React, { useState, useEffect } from "react";
import "./ModalDetalheSemente.css";
import Paginacao from "../Paginacao/Paginacao";
import ExportButton from "../ExportButton/ExportButton";
import TabelaResponsiva from "../TabelaResponsiva/TabelaResponsiva";
import { sementesService } from "../../services/sementesService";

import closeIcon from "../../assets/close.svg";
import editIcon from "../../assets/edit.svg";
import deleteIcon from "../../assets/delete.svg";

function ModalDetalheSemente({
  sementeResumo,
  onClose,
  onEditar,
  onSolicitarExclusao,
}) {
  const [sementeDetalhada, setSementeDetalhada] = useState(null);
  const [historicoEntrada, setHistoricoEntrada] = useState([]);
  const [historicoSaida, setHistoricoSaida] = useState([]);
  const [paginaHistorico, setPaginaHistorico] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(true);

  // Colunas (Simplificadas para caber)
  const colunasEntrada = [
    { label: "Data", key: "data" },
    { label: "Lote", key: "lote" },
    { label: "Qtd", key: "quantidade" },
    { label: "Está na Camara fria?", key: "camaraFriaFormatada" },
  ];

  const colunasSaida = [
    { label: "Data", key: "data" },
    { label: "Lote", key: "lote" },
    { label: "Qtd", key: "quantidade" },
    { label: "Está na Camara fria?", key: "camaraFriaFormatada" },
  ];

  const colunasExportar = [
    { label: "Tipo", key: "tipo" },
    { label: "Data", key: "data" },
    { label: "Lote", key: "lote" },
    { label: "Qtd", key: "quantidade" },
  ];

  const formatarData = (data) => {
    if (!data) return "-";

    // Se for array [ano, mes, dia] vindo do Spring Boot
    if (Array.isArray(data)) {
      const [ano, mes, dia] = data;
      return `${String(dia).padStart(2, "0")}/${String(mes).padStart(
        2,
        "0"
      )}/${ano}`;
    }

    // Se for string no formato ISO (YYYY-MM-DD)
    if (typeof data === "string" && data.includes("-")) {
      const partes = data.split("T")[0].split("-");
      if (partes.length === 3) {
        const [ano, mes, dia] = partes;
        return `${dia}/${mes}/${ano}`;
      }
    }

    // Fallback para outros formatos de string
    try {
      const d = new Date(data);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("pt-BR");
      }
    } catch (e) {
      return data;
    }

    return data;
  };

  // Função para processar o download do arquivo vindo do backend
  const baixarArquivo = (response, defaultName) => {
    const disposition = response.headers["content-disposition"];
    let fileName = defaultName;

    if (disposition) {
      const filenameRegex =
        /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/i;
      const matches = filenameRegex.exec(disposition);
      if (matches && matches[1]) {
        fileName = decodeURIComponent(matches[1].replace(/['"]/g, ""));
      }
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  // --- HANDLERS DE EXPORTAÇÃO ---
  const handleDownloadHistoricoPDF = async () => {
    try {
      const id = sementeResumo.id;
      const response = await sementesService.exportarHistoricoPdf(id);
      baixarArquivo(response, `historico_${sementeResumo.lote}.pdf`);
    } catch (error) {
      console.error("Erro ao baixar PDF do histórico:", error);
      alert("Erro ao gerar o PDF do histórico.");
    }
  };

  const handleDownloadHistoricoCSV = async () => {
    try {
      const id = sementeResumo.id;
      const response = await sementesService.exportarHistoricoCsv(id);
      baixarArquivo(response, `historico_${sementeResumo.lote}.csv`);
    } catch (error) {
      console.error("Erro ao baixar CSV do histórico:", error);
      alert("Erro ao gerar o CSV do histórico.");
    }
  };

  useEffect(() => {
    const carregar = async () => {
      if (!sementeResumo?.id) return;
      setLoading(true);
      try {
        // Detalhes
        const det = await sementesService.getById(sementeResumo.id);
        // Tratamento URL Imagem
        if (det.fotoSementeResponseDTO?.url) {
          let url = det.fotoSementeResponseDTO.url;
          url = url
            .replace("reflora-minio", "localhost")
            .replace("minio", "localhost");
          det.fotoUrl = url;
        } else if (sementeResumo.imagem) {
          det.fotoUrl = sementeResumo.imagem;
        }
        setSementeDetalhada(det);

        // Histórico
        const hist = await sementesService.getHistorico(
          sementeResumo.id,
          paginaHistorico - 1,
          5
        );
        const fmt = (i) => ({
          ...i,
          data: formatarData(i.data),
          camaraFriaFormatada:
            i.camaraFria || (i.estahNaCamaraFria ? "Sim" : "Não"),
          quantidade: `${i.quantidade} ${i.unidadeDeMedida || ""}`,
        });

        setHistoricoEntrada(hist?.entradas?.content?.map(fmt) || []);
        setHistoricoSaida(hist?.saidas?.content?.map(fmt) || []);
        const pEnt = hist?.entradas?.page?.totalPages || 0;
        const pSai = hist?.saidas?.page?.totalPages || 0;
        setTotalPaginas(Math.max(pEnt, pSai, 1));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, [sementeResumo, paginaHistorico]);

  const dados = sementeDetalhada || sementeResumo;
  const dadosExp = [
    ...historicoEntrada.map((i) => ({ ...i, tipo: "Entrada" })),
    ...historicoSaida.map((i) => ({ ...i, tipo: "Saída" })),
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content-semente"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Detalhes da Semente</h2>
          <button className="modal-close-button" onClick={onClose}>
            <img src={closeIcon} alt="Fechar" />
          </button>
        </div>

        <div className="modal-body">
          {loading && !sementeDetalhada ? (
            <p style={{ textAlign: "center", padding: 20 }}>Carregando...</p>
          ) : (
            <>
              {/* SEÇÃO TOPO: Grid no Mobile */}
              <div className="semente-top-section">
                {/* 1. Imagem */}
                <div className="semente-imagem-wrapper">
                  {dados.fotoUrl ? (
                    <img
                      src={dados.fotoUrl}
                      alt={dados.nomePopular}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    <div className="placeholder-foto">Sem Foto</div>
                  )}
                </div>

                {/* 2. Dados (Lista compacta no mobile) */}
                <div className="semente-info-grid">
                  <div className="info-item">
                    <label>Lote</label> <span>{dados.lote}</span>
                  </div>
                  <div className="info-item">
                    <label>Data</label>{" "}
                    <span>
                      {dados.dataDeCadastro || formatarData(dados.dataCadastro)}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Nome</label> <span>{dados.nomePopular}</span>
                  </div>
                  <div className="info-item">
                    <label>Científico</label>{" "}
                    <span>{dados.nomeCientifico || "-"}</span>
                  </div>
                  <div className="info-item">
                    <label>Qtd</label>{" "}
                    <span>
                      {dados.quantidade} {dados.unidadeDeMedida}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Armazém</label>{" "}
                    <span>
                      {dados.estahNaCamaraFria ? "Câm. Fria" : "Comum"}
                    </span>
                  </div>
                  {/* ... trecho do Local que você já tem ... */}
                  <div className="info-item">
                    <label>Local</label>{" "}
                    <span>
                      {dados.cidade ? `${dados.cidade}-${dados.estado}` : "-"}
                    </span>
                  </div>

                  {/* --- ADICIONE ISTO ABAIXO --- */}

                  <div className="info-item">
                    <label>Latitude</label>{" "}
                    <span>{dados.latitude ? dados.latitude : "-"}</span>
                  </div>

                  <div className="info-item" style={{ borderBottom: "none" }}>
                    <label>Longitude</label>{" "}
                    <span>{dados.longitude ? dados.longitude : "-"}</span>
                  </div>

                  {/* Link Opcional para o Google Maps (mantendo o estilo limpo) */}
                  {dados.latitude && dados.longitude && (
                    <div
                      className="info-item"
                      style={{ borderBottom: "none", paddingTop: "5px" }}
                    >
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${dados.latitude},${dados.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#28a745",
                          textDecoration: "none",
                          fontWeight: "bold",
                          fontSize: "0.9em",
                        }}
                      >
                        📍 Ver no Mapa
                      </a>
                    </div>
                  )}
                </div>

                {/* 3. Botões (Ficam abaixo da imagem no mobile via Grid CSS) */}
                <div className="semente-acoes">
                  <button
                    className="btn-acao-modal"
                    onClick={() => {
                      onSolicitarExclusao(dados);
                      onClose();
                    }}
                    title="Excluir"
                  >
                    <img src={deleteIcon} alt="Excluir" />
                  </button>
                  <button
                    className="btn-acao-modal"
                    onClick={() => {
                      onEditar(dados);
                      onClose();
                    }}
                    title="Editar"
                  >
                    <img src={editIcon} alt="Editar" />
                  </button>
                </div>
              </div>

              {/* SEÇÃO HISTÓRICO */}
              <div className="historico-container">
                <h3>Histórico de Movimentação</h3>
                <div className="historico-tabelas">
                  {/* Entrada */}
                  <div className="tabela-wrapper-modal">
                    <div className="titulo-tabela bg-entrada">Entradas</div>
                    <TabelaResponsiva
                      colunas={colunasEntrada}
                      dados={historicoEntrada}
                      onPesquisar={null}
                      footerContent={null}
                    />
                  </div>

                  {/* Saída */}
                  <div className="tabela-wrapper-modal wrapper-saida">
                    <div className="titulo-tabela bg-saida">Saídas</div>
                    <TabelaResponsiva
                      colunas={colunasSaida}
                      dados={historicoSaida}
                      onPesquisar={null}
                      footerContent={null}
                    />
                  </div>
                </div>

                <div className="footer-content">
                  <Paginacao
                    paginaAtual={paginaHistorico}
                    totalPaginas={totalPaginas}
                    onPaginaChange={setPaginaHistorico}
                  />
                  <ExportButton
                    data={dadosExp}
                    columns={colunasExportar}
                    fileName={`historico_${dados.id}`}
                    onExportPDF={handleDownloadHistoricoPDF}
                    onExportCSV={handleDownloadHistoricoCSV}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalDetalheSemente;
