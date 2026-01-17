import React, { useState } from "react";
import FormGeral from "../../../components/FormGeral/FormGeral";
import Input from "../../../components/Input/Input";
import insumoService from "../../../services/insumoService";
import "./Cadastrar.css";
import { getBackendErrorMessage } from "../../../utils/errorHandler";

const Cadastrar = () => {
  const hoje = new Date().toISOString().split("T")[0];

  const [tipoInsumo, setTipoInsumo] = useState("");
  const [loading, setLoading] = useState(false); // <--- NOVO ESTADO PARA O BOTÃO
  const [formData, setFormData] = useState({
    nomeInsumo: "",
    quantidade: "",
    unidadeMedida: "",
    dataRegistro: "",
    responsavelEntrega: "",
    responsavelReceber: "",
    estoqueMinimo: "",
  });

  const formatarDataParaBackend = (dataISO) => {
    if (!dataISO) return null;
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const handleCancel = (confirmar = true) => {
    const resetForm = () => {
      setTipoInsumo("");
      setFormData({
        nomeInsumo: "",
        quantidade: "",
        unidadeMedida: "",
        dataRegistro: "",
        responsavelEntrega: "",
        responsavelReceber: "",
        estoqueMinimo: "",
      });
    };
    if (
      confirmar &&
      window.confirm(
        "Deseja cancelar? As alterações não salvas serão perdidas."
      )
    ) {
      resetForm();
    } else if (!confirmar) {
      resetForm();
    }
  };

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTipoInsumoChange = (e) => {
    setTipoInsumo(e.target.value);
    setFormData((prev) => ({
      ...prev,
      estoqueMinimo: "",
      unidadeMedida: "",
    }));
  };

  const handleQuantidadeInc = () => {
    setFormData((prev) => ({
      ...prev,
      quantidade: Math.max(0, (prev.quantidade || 0) + 1),
    }));
  };

  const handleQuantidadeDec = () => {
    setFormData((prev) => ({
      ...prev,
      quantidade: Math.max(0, (prev.quantidade || 0) - 1),
    }));
  };

  const handleEstoqueMinimoInc = () => {
    setFormData((prev) => ({
      ...prev,
      estoqueMinimo: Math.max(0, (prev.estoqueMinimo || 0) + 1),
    }));
  };

  const handleEstoqueMinimoDec = () => {
    setFormData((prev) => ({
      ...prev,
      estoqueMinimo: Math.max(0, (prev.estoqueMinimo || 0) - 1),
    }));
  };

  const getUnidadesMedida = () => {
    const opcoesComuns = [{ value: "", label: "Selecione a medida..." }];

    if (tipoInsumo === "Ferramenta") {
      return [
        ...opcoesComuns,
        { value: "UNIDADE", label: "Unidade" },
        { value: "PECA", label: "Peça" },
        { value: "JOGO", label: "Jogo" },
        { value: "CONJUNTO", label: "Conjunto" },
      ];
    } else if (tipoInsumo === "Material") {
      return [
        ...opcoesComuns,
        { value: "KG", label: "Kg" },
        { value: "LITRO", label: "Litro" },
        { value: "METRO", label: "Metro" },
        { value: "UNIDADE", label: "Unidade" },
        { value: "SACO", label: "Saco" },
        { value: "CAIXA", label: "Caixa" },
      ];
    }
    return [];
  };

  const getTitulo = () => {
    return tipoInsumo === "Ferramenta"
      ? "Registrar Ferramenta"
      : tipoInsumo === "Material"
      ? "Registrar Material"
      : "Cadastrar Insumo";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tipoInsumo) {
      alert("Por favor, selecione o tipo de insumo.");
      return;
    }

    if (!formData.unidadeMedida) {
      alert("Por favor, selecione a unidade de medida.");
      return;
    }

    setLoading(true); // <--- ATIVA O LOADING AO INICIAR

    try {
      const payload = {
        tipoInsumo: tipoInsumo.toUpperCase(),
        nomeInsumo: formData.nomeInsumo,
        unidadeMedida: formData.unidadeMedida,
        dataRegistro: formatarDataParaBackend(formData.dataRegistro),
        responsavelEntrega: formData.responsavelEntrega,
        responsavelReceber: formData.responsavelReceber,
        quantidade:
          formData.quantidade === "" ? 0 : Number(formData.quantidade),
        estoqueMinimo:
          formData.estoqueMinimo === "" ? 0 : Number(formData.estoqueMinimo),
      };

      await insumoService.cadastrar(payload);

      alert(`${tipoInsumo} cadastrado com sucesso!`);
      handleCancel(false);
    } catch (error) {
      const msg = getBackendErrorMessage(error);
      alert(msg);
    } finally {
      setLoading(false); // <--- DESATIVA O LOADING AO TERMINAR (SUCESSO OU ERRO)
    }
  };

  return (
    <div className="cadastro-insumo-container">
      <FormGeral
        title={getTitulo()}
        actions={[]}
        onSubmit={handleSubmit}
        useGrid={false}
      >
        <div className="insumo-grid">
          <div className="grid-span-2">
            <Input
              label="Tipo de insumo"
              name="tipoInsumo"
              type="select"
              value={tipoInsumo}
              onChange={handleTipoInsumoChange}
              required={true}
              options={[
                { value: "", label: "Selecione o tipo..." },
                { value: "Ferramenta", label: "Ferramenta" },
                { value: "Material", label: "Material" },
              ]}
            />
          </div>

          {tipoInsumo && (
            <>
              <Input
                label="Nome do insumo"
                name="nomeInsumo"
                type="text"
                value={formData.nomeInsumo}
                onChange={handleChange("nomeInsumo")}
                placeholder={
                  tipoInsumo === "Ferramenta" ? "Ex: Pá Grande" : "Ex: Adubo"
                }
                required={true}
              />
              <Input
                label="Unidade de medida"
                name="unidadeMedida"
                type="select"
                value={formData.unidadeMedida}
                onChange={handleChange("unidadeMedida")}
                required={true}
                options={getUnidadesMedida()}
              />

              <Input
                label="Quantidade"
                name="quantidade"
                type="number"
                value={formData.quantidade}
                onChange={handleChange("quantidade")}
                onIncrement={handleQuantidadeInc}
                onDecrement={handleQuantidadeDec}
                placeholder="Ex: 300"
                required={true}
                min="0"
              />

              {tipoInsumo === "Material" ? (
                <Input
                  label="Estoque Mínimo"
                  name="estoqueMinimo"
                  type="number"
                  value={formData.estoqueMinimo}
                  onChange={handleChange("estoqueMinimo")}
                  onIncrement={handleEstoqueMinimoInc}
                  onDecrement={handleEstoqueMinimoDec}
                  placeholder="Ex: 100"
                  required={true}
                  min="0"
                />
              ) : (
                <Input
                  label="Data de Registro"
                  name="dataRegistro"
                  type="date"
                  value={formData.dataRegistro}
                  onChange={handleChange("dataRegistro")}
                  required={true}
                />
              )}

              {tipoInsumo === "Material" && (
                <Input
                  label="Data de Registro"
                  name="dataRegistro"
                  type="date"
                  value={formData.dataRegistro}
                  onChange={handleChange("dataRegistro")}
                  required={true}
                />
              )}

              <Input
                label="Responsável pela Entrega"
                name="responsavelEntrega"
                type="text"
                value={formData.responsavelEntrega}
                onChange={handleChange("responsavelEntrega")}
                placeholder="Responsável pela entrega"
                required={true}
              />
              <Input
                label="Responsável por Receber"
                name="responsavelReceber"
                type="text"
                value={formData.responsavelReceber}
                onChange={handleChange("responsavelReceber")}
                placeholder="Responsável por receber"
                required={true}
              />
            </>
          )}

          <div className="grid-span-2 insumo-actions">
            <button
              type="button"
              className="insumo-btn btn-cancelar"
              onClick={() => handleCancel(true)}
              disabled={loading} // <--- DESABILITA SE ESTIVER SALVANDO
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="insumo-btn btn-salvar"
              disabled={loading} // <--- DESABILITA SE ESTIVER SALVANDO
            >
              {loading ? "Salvando..." : "Salvar Registro"}{" "}
              {/* <--- MENSAGEM DINÂMICA */}
            </button>
          </div>
        </div>
      </FormGeral>
    </div>
  );
};

export default Cadastrar;
