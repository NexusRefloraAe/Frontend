import React, { useState, useEffect } from "react";
import FormGeral from "../../../components/FormGeral/FormGeral";
import Input from "../../../components/Input/Input";
import { sementesService } from "../../../services/sementesService";
import { canteiroService } from "../../../services/canteiroService";
import { getBackendErrorMessage } from "../../../utils/errorHandler";

// Importando o CSS
import "./CadastrarCanteiro.css";

const CadastrarCanteiro = () => {
  const [opcoesEspecies, setOpcoesEspecies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    data: "",
    quantidade: 0,
    especie: "",
  });

  useEffect(() => {
    const fetchEspecies = async () => {
      try {
        const listaNomes = await sementesService.listarNomesPopulares();
        const options = listaNomes.map((nome) => ({
          value: nome,
          label: nome,
        }));
        setOpcoesEspecies(options);
      } catch (error) {
        console.error("Erro ao carregar espécies:", error);
        alert("Não foi possível carregar a lista de espécies.");
      }
    };
    fetchEspecies();
  }, []);

  const handleCancel = (confirmar = true) => {
    const resetForm = () => {
      setFormData({ nome: "", data: "", quantidade: 0, especie: "" });
    };

    if (confirmar) {
      if (
        window.confirm(
          "Deseja cancelar? As alterações não salvas serão perdidas."
        )
      ) {
        resetForm();
      }
    } else {
      resetForm();
    }
  };

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuantidadeInc = () => {
    setFormData((prev) => ({ ...prev, quantidade: prev.quantidade + 1 }));
  };

  const handleQuantidadeDec = () => {
    setFormData((prev) => ({
      ...prev,
      quantidade: prev.quantidade > 0 ? prev.quantidade - 1 : 0,
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!formData.nome || !formData.data || !formData.especie) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nome: formData.nome,
        data: formData.data,
        quantidade: formData.quantidade,
        especie: formData.especie,
      };

      await canteiroService.create(payload);

      alert("Canteiro cadastrado com sucesso!");
      handleCancel(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      const mensagemErro = getBackendErrorMessage(error);
      alert(`Erro: ${mensagemErro}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-canteiro-container">
      <FormGeral
        title="Cadastrar Canteiro"
        onSubmit={handleSubmit}
        useGrid={false} // Desligamos o grid do FormGeral para usar o nosso
      >
        {/* GRID CUSTOMIZADO PARA COLUNAS */}
        <div className="canteiro-grid">
          <Input
            label="Nome do Canteiro"
            name="nome"
            type="text"
            value={formData.nome}
            onChange={handleChange("nome")}
            required={true}
            placeholder="Ex: Canteiro 1"
          />

          <Input
            label="Data de Criação"
            name="data"
            type="date"
            value={formData.data}
            onChange={handleChange("data")}
            required={true}
            placeholder="xx/xx/xxxx"
          />

          <Input
            label="Qtd Máxima (unid)"
            name="quantidade"
            type="number"
            value={formData.quantidade}
            onChange={handleChange("quantidade")}
            onIncrement={handleQuantidadeInc}
            onDecrement={handleQuantidadeDec}
            onKeyDown={(e) => {
              if (["e", "E", ",", "."].includes(e.key)) {
                e.preventDefault();
              }
            }}
            required={true}
          />

          <Input
            label="Espécie"
            name="especie"
            type="select"
            value={formData.especie}
            onChange={handleChange("especie")}
            required={true}
            placeholder="Selecione a espécie"
            options={opcoesEspecies}
          />
        </div>

        {/* BOTÕES */}
        <div className="canteiro-actions">
          <button
            type="button"
            className="canteiro-btn btn-cancelar"
            onClick={() => handleCancel(true)}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="canteiro-btn btn-salvar"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Cadastro"}
          </button>
        </div>
      </FormGeral>
    </div>
  );
};

export default CadastrarCanteiro;
