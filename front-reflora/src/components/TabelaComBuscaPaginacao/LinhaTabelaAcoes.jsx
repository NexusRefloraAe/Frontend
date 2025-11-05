import { FaEdit, FaCheck, FaTrash } from "react-icons/fa";

function LinhaTabelaAcoes({ item, colunas, onEditar, onConfirmar, onExcluir }) {
  const mostrarAcoes = onEditar || onConfirmar || onExcluir;

  return (
    <tr>
      {colunas.map((coluna) => (
        <td key={coluna.key}>{item[coluna.key]}</td>
      ))}

      {mostrarAcoes && (
        <td className="acoes">
          {onEditar && <FaEdit className="icone editar" onClick={() => onEditar(item)} />}
          {onConfirmar && <FaCheck className="icone confirmar" onClick={() => onConfirmar(item)} />}
          {onExcluir && <FaTrash className="icone excluir" onClick={() => onExcluir(item)} />}
        </td>
      )}
    </tr>
  );
}

export default LinhaTabelaAcoes;
