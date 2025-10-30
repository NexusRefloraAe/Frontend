// src/components/Tabela/LinhaTabelaAcoes.jsx
import { FaEdit, FaCheck, FaTrash } from "react-icons/fa";

function LinhaTabelaAcoes({ item, colunas, onEditar, onConfirmar, onExcluir }) {
  return (
    <tr>
      {colunas.map((coluna) => (
        <td key={coluna.key}>{item[coluna.key]}</td>
      ))}
      <td className="acoes">
        <FaEdit className="icone editar" onClick={() => onEditar(item)} />
        <FaCheck className="icone confirmar" onClick={() => onConfirmar(item)} />
        <FaTrash className="icone excluir" onClick={() => onExcluir(item)} />
      </td>
    </tr>
  );
}

export default LinhaTabelaAcoes;
