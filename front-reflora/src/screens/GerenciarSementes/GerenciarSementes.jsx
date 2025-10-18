import React from "react";
import "./GerenciarSementesStyler.css";

const GerenciaSementes = () => {
  return (
    <div className="seed-page">
      {/* Barra de navegação superior */}
      <nav className="seed-nav">
        <button className="nav-btn">Cadastrar Plantio</button>
        <button className="nav-btn">Histórico Plantio</button>
        <button className="nav-btn">Cadastrar Teste</button>
        <button className="nav-btn">Histórico Testes</button>
        <button className="nav-btn">Gerar Relatório</button>
      </nav>

      {/* Título (você já tem o seu, então este é só ilustrativo) */}
      <h2 className="seed-title">Cadastro Teste de Germinação</h2>

      {/* Formulário */}
      <form className="seed-form">
        <div className="form-group">
          <label>Lote</label>
          <input type="text" placeholder="A001" />
        </div>

        <div className="form-group">
          <label>Nome Popular</label>
          <input type="text" placeholder="Ipê" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Data do plantio</label>
            <input type="date" />
          </div>
          <div className="form-group">
            <label>Qtd sementes (kg/g/und)</label>
            <input type="number" placeholder="30" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Tipo de plantio</label>
            <select>
              <option>Sementeira/saquinho/chão</option>
              <option>Sementeira</option>
              <option>Saquinho</option>
              <option>Chão</option>
            </select>
          </div>

          <div className="form-group">
            <label>Qtd plantada (und)</label>
            <input type="number" placeholder="30" />
          </div>
        </div>

        <div className="form-group">
          <label>Câmara fria</label>
          <select>
            <option>Sim</option>
            <option>Não</option>
          </select>
        </div>

        <div className="button-row">
          <button type="button" className="cancel-btn">Cancelar</button>
          <button type="submit" className="save-btn">Salvar Rascunho</button>
        </div>
      </form>
    </div>
  );
};

export default GerenciaSementes;
