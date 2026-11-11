import { useEffect, useState } from 'react';

const EMPTY = { optionNumber: '', question: '', answer: '', isActive: true };

function validate(values) {
  const errors = {};
  const n = Number(values.optionNumber);
  if (!values.optionNumber) errors.optionNumber = 'El número es obligatorio';
  else if (!Number.isInteger(n) || n < 1) errors.optionNumber = 'Debe ser un entero mayor a 0';
  if (values.question.trim().length < 3) errors.question = 'Mínimo 3 caracteres';
  if (!values.answer.trim()) errors.answer = 'La respuesta es obligatoria';
  return errors;
}

/**
 * Formulario para crear o editar una pregunta.
 * `initial` = pregunta a editar (o null para crear). `suggestedNumber` se usa al crear.
 */
export default function QuestionForm({ initial, suggestedNumber, onSubmit, onCancel }) {
  const isEdit = Boolean(initial);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setValues(
      initial
        ? { optionNumber: String(initial.optionNumber), question: initial.question, answer: initial.answer, isActive: initial.isActive }
        : { ...EMPTY, optionNumber: suggestedNumber ? String(suggestedNumber) : '' },
    );
    setErrors({});
    setServerError('');
  }, [initial, suggestedNumber]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
    setErrors((err) => ({ ...err, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate(values);
    setErrors(validation);
    if (Object.keys(validation).length) return;

    setSubmitting(true);
    setServerError('');
    try {
      await onSubmit({
        optionNumber: Number(values.optionNumber),
        question: values.question.trim(),
        answer: values.answer.trim(),
        isActive: values.isActive,
      });
      if (!isEdit) setValues({ ...EMPTY });
    } catch (err) {
      if (err.details) {
        setErrors(Object.fromEntries(err.details.map((d) => [d.field, d.message])));
      }
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h2>{isEdit ? `Editar pregunta #${initial.optionNumber}` : 'Nueva pregunta'}</h2>

      <label className="field field--small">
        <span>Número a teclear</span>
        <input name="optionNumber" type="number" min="1" step="1" value={values.optionNumber} onChange={handleChange} aria-invalid={!!errors.optionNumber} />
        {errors.optionNumber && <small className="field__error">{errors.optionNumber}</small>}
      </label>

      <label className="field">
        <span>Pregunta</span>
        <input name="question" type="text" maxLength={255} value={values.question} onChange={handleChange} placeholder="¿Cuál es el horario de atención?" aria-invalid={!!errors.question} />
        {errors.question && <small className="field__error">{errors.question}</small>}
      </label>

      <label className="field">
        <span>Respuesta</span>
        <textarea name="answer" rows={5} maxLength={5000} value={values.answer} onChange={handleChange} placeholder="Atendemos de lunes a viernes..." aria-invalid={!!errors.answer} />
        {errors.answer && <small className="field__error">{errors.answer}</small>}
      </label>

      <label className="checkbox">
        <input name="isActive" type="checkbox" checked={values.isActive} onChange={handleChange} />
        <span>Visible en el chatbot</span>
      </label>

      {serverError && <p className="alert alert--error">{serverError}</p>}

      <div className="actions">
        {isEdit && (
          <button type="button" className="btn" onClick={onCancel} disabled={submitting}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Agregar pregunta'}
        </button>
      </div>
    </form>
  );
}
