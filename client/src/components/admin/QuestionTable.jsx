import { useState } from 'react';

export default function QuestionTable({ questions, loading, editingId, onEdit, onDelete }) {
  const [confirmId, setConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  if (loading && questions.length === 0) return <p className="muted">Cargando...</p>;
  if (questions.length === 0) return <p className="muted">No hay preguntas registradas todavía.</p>;

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>N.º</th>
            <th>Pregunta</th>
            <th>Respuesta</th>
            <th>Estado</th>
            <th aria-label="Acciones" />
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q.id} className={q.id === editingId ? 'is-editing' : undefined}>
              <td><span className="badge">{q.optionNumber}</span></td>
              <td className="cell-question">{q.question}</td>
              <td className="cell-answer" title={q.answer}><span>{q.answer}</span></td>
              <td>
                <span className={`status ${q.isActive ? 'status--on' : 'status--off'}`}>
                  {q.isActive ? 'Activa' : 'Oculta'}
                </span>
              </td>
              <td>
                <div className="cell-actions">
                {confirmId === q.id ? (
                  <>
                    <span className="muted">¿Eliminar?</span>
                    <button type="button" className="btn btn--danger btn--sm" onClick={() => handleDelete(q.id)} disabled={deletingId === q.id}>
                      Sí
                    </button>
                    <button type="button" className="btn btn--sm" onClick={() => setConfirmId(null)} disabled={deletingId === q.id}>
                      No
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className="btn btn--sm" onClick={() => onEdit(q)}>
                      Editar
                    </button>
                    <button type="button" className="btn btn--danger btn--sm" onClick={() => setConfirmId(q.id)}>
                      Eliminar
                    </button>
                  </>
                )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
