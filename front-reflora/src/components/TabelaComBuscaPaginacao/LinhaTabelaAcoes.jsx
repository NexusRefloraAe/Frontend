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
          {onEditar && (
            <button 
              className="btn-icone btn-editar"
              onClick={() => onEditar(item)}
              title="Editar"
            >
              <FaEdit className="icone" />
            </button>
          )}
          {onConfirmar && (
            <button 
              className="btn-icone btn-confirmar"
              onClick={() => onConfirmar(item)}
              title="Visualizar"
            >
              <FaCheck className="icone" />
            </button>
          )}
          {onExcluir && (
            <button 
              className="btn-icone btn-excluir"
              onClick={() => onExcluir(item)}
              title="Excluir"
            >
              <FaTrash className="icone" />
            </button>
          )}
        </td>
      )}
    </tr>
  );
}

export default LinhaTabelaAcoes;