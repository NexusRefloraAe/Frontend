import React, { useState, useEffect } from "react";
import FormGeral from "../../../components/FormGeral/FormGeral";
import Input from "../../../components/Input/Input";
import insumoService from "../../../services/insumoService";
import "./EditarMaterial.css";
import { getBackendErrorMessage } from "../../../utils/errorHandler";

const EditarMaterial = ({ isOpen, onClose, itemParaEditar, onSalvar }) => {
  const [formData, setFormData] = useState({
    nomeInsumo: "",
    quantidade: "",
    unidadeMedida: "",
    dataRegistro: "",
    responsavelEntrega: "",
    responsavelReceber: "",
    estoqueMinimo: "",
    status: "",
  });

  const formatarParaBackend = (dataISO) => {
    if (!dataISO) return null;
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  useEffect(() => {
    if (itemParaEditar) {
      setFormData({
        nomeInsumo: itemParaEditar.NomeInsumo || "",
        quantidade: itemParaEditar.Quantidade || "",
        unidadeMedida: itemParaEditar.UnidadeMedida || "UNIDADE",
        dataRegistro: formatarDataParaInput(itemParaEditar.Data),
        responsavelEntrega: itemParaEditar.ResponsavelEntrega || "",
        responsavelReceber: itemParaEditar.ResponsavelRecebe || "",
        estoqueMinimo: itemParaEditar.EstoqueMinimo || "",
        status: itemParaEditar.Status || "ENTRADA",
      });
    }
  }, [itemParaEditar]);

  const formatarDataParaInput = (dataBR) => {
    if (!dataBR || dataBR.includes("-")) return dataBR;
    const [dia, mes, ano] = dataBR.split("/");
    return `${ano}-${mes}-${dia}`;
  };

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuantidadeInc = () =>
    setFormData((p) => ({ ...p, quantidade: Number(p.quantidade) + 1 }));
  const handleQuantidadeDec = () =>
    setFormData((p) => ({
      ...p,
      quantidade: Math.max(0, Number(p.quantidade) - 1),
    }));
  const handleEstoqueMinimoInc = () =>
    setFormData((p) => ({ ...p, estoqueMinimo: Number(p.estoqueMinimo) + 1 }));
  const handleEstoqueMinimoDec = () =>
    setFormData((p) => ({
      ...p,
      estoqueMinimo: Math.max(0, Number(p.estoqueMinimo) - 1),
    }));

  const getUnidadesMedida = () => {
    return [
      { value: "KG", label: "Kg" },
      { value: "LITRO", label: "Litro" },
      { value: "METRO", label: "Metro" },
      { value: "UNIDADE", label: "Unidade" },
      { value: "SACO", label: "Saco" },
      { value: "CAIXA", label: "Caixa" },
    ];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemParaEditar?.id) return alert("Erro: ID não encontrado.");

    let sucessoApi = false;

    try {
      const payload = {
        insumoId: itemParaEditar.id,
        nomeInsumo: formData.nomeInsumo,
        status: formData.status ? formData.status.toUpperCase() : "ENTRADA",
        quantidade: Number(formData.quantidade),
        dataRegistro: formatarParaBackend(formData.dataRegistro),
        responsavelEntrega: formData.responsavelEntrega,
        responsavelReceber: formData.responsavelReceber,
        unidadeMedida: formData.unidadeMedida,
      };

      // 1. Atualiza no Banco
      await insumoService.atualizarMovimentacao(itemParaEditar.id, payload);
      sucessoApi = true;

      alert("Material atualizado com sucesso!");

      // 2. Atualiza a Tela (Sem Refresh)
      if (onSalvar) {
        onSalvar({
          id: itemParaEditar.id,
          NomeInsumo: formData.nomeInsumo,
          Data: formData.dataRegistro.split("-").reverse().join("/"),
          Status: formData.status,
          Quantidade: Number(formData.quantidade),
          UnidadeMedida: formData.unidadeMedida,
          ResponsavelEntrega: formData.responsavelEntrega,
          ResponsavelRecebe: formData.responsavelReceber,
          EstoqueMinimo: Number(formData.estoqueMinimo),
          imagem: itemParaEditar.imagem,
        });
      }

      // 3. Fecha Modal
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      // Só mostra erro se não tiver passado da fase de API
      if (!sucessoApi) alert(getBackendErrorMessage(error));
    }
  };

  const actions = [
    {
      type: "button",
      variant: "action-secondary",
      children: "Cancelar",
      onClick: () => onClose(),
    },
    { type: "submit", variant: "primary", children: "Salvar Edições" },
  ];

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn-fechar-modal" onClick={onClose}>
          ×
        </button>
        <FormGeral
          title={`Editar Material - ${itemParaEditar?.NomeInsumo || ""}`}
          actions={actions}
          onSubmit={handleSubmit}
          useGrid={false}
        >
          <div className="input-row">
            <Input
              label="Nome"
              name="nomeInsumo"
              type="text"
              value={formData.nomeInsumo}
              onChange={handleChange("nomeInsumo")}
              required
            />
            <Input
              label="Qtd"
              name="quantidade"
              type="number"
              value={formData.quantidade}
              onChange={handleChange("quantidade")}
              onIncrement={handleQuantidadeInc}
              onDecrement={handleQuantidadeDec}
            />
          </div>
          <div className="input-row">
            <Input
              label="Unidade"
              name="unidadeMedida"
              type="select"
              value={formData.unidadeMedida}
              onChange={handleChange("unidadeMedida")}
              options={getUnidadesMedida()}
              required
            />
            <Input
              label="Mínimo"
              name="estoqueMinimo"
              type="number"
              value={formData.estoqueMinimo}
              onChange={handleChange("estoqueMinimo")}
              onIncrement={handleEstoqueMinimoInc}
              onDecrement={handleEstoqueMinimoDec}
            />
          </div>
          <div className="input-row">
            <Input
              label="Data"
              name="dataRegistro"
              type="date"
              value={formData.dataRegistro}
              onChange={handleChange("dataRegistro")}
              required
            />
            <Input
              label="Status"
              name="status"
              type="select"
              value={formData.status}
              onChange={handleChange("status")}
              required
              options={[
                { value: "ENTRADA", label: "Entrada" },
                { value: "SAIDA", label: "Saída" },
              ]}
            />
          </div>
          <div className="input-row">
            <Input
              label="Resp. Entrega"
              name="responsavelEntrega"
              type="text"
              value={formData.responsavelEntrega}
              onChange={handleChange("responsavelEntrega")}
              required
            />
            <Input
              label="Resp. Recebe"
              name="responsavelReceber"
              type="text"
              value={formData.responsavelReceber}
              onChange={handleChange("responsavelReceber")}
              required
            />
          </div>
        </FormGeral>
      </div>
    </div>
  );
};

export default EditarMaterial;
