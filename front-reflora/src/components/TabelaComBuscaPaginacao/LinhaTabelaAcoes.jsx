import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

function LinhaTabelaAcoes({ item, colunas, onEditar, onVisualizar, onExcluir }) {
  const mostrarAcoes = onEditar || onVisualizar || onExcluir;

  return (
    <tr>
      {colunas.map((coluna) => (
        <td
          key={coluna.key}
          data-label={coluna.label} // 👈 AQUI ESTÁ O SEGREDO
        >
          {item[coluna.key]}
        </td>
      ))}

      {mostrarAcoes && (
        <td
          className="acoes"
          data-label="Ações" // 👈 IMPORTANTE PARA O MOBILE
        >
          {onEditar && (
            <button
              className="btn-icone btn-editar"
              onClick={() => onEditar(item)}
              title="Editar"
            >
              <FaEdit className="icone" />
            </button>
          )}

          {onVisualizar && (
            <button
              type="button"
              className="btn-icone btn-confirmar"
              onClick={() => onVisualizar(item)}
              title="Visualizar"
            >
              <FaEye className="icone" />
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
