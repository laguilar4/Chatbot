import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/admin/LoginForm';
import QuestionForm from '../components/admin/QuestionForm';
import QuestionTable from '../components/admin/QuestionTable';
import { useAdminQuestions } from '../hooks/useAdminQuestions';
import { questionsApi } from '../api/questionsApi';

const STORAGE_KEY = 'chatbot_admin_key';

const readKey = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
};

export default function AdminPage() {
  const [apiKey, setApiKey] = useState(readKey);
  const [loginError, setLoginError] = useState('');
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState('');

  const logout = useCallback((message = '') => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch { /* noop */ }
    setApiKey('');
    setEditing(null);
    setLoginError(message);
  }, []);

  const onUnauthorized = useCallback(() => logout('Sesión inválida, ingresa la clave de nuevo.'), [logout]);
  const { questions, loading, error, create, update, remove } = useAdminQuestions(apiKey, onUnauthorized);

  const nextNumber = useMemo(
    () => questions.reduce((max, q) => Math.max(max, q.optionNumber), 0) + 1,
    [questions],
  );

  const handleLogin = async (key) => {
    setLoginError('');
    try {
      await questionsApi.listAll(key); // valida la clave antes de guardarla
      try {
        sessionStorage.setItem(STORAGE_KEY, key);
      } catch { /* noop */ }
      setApiKey(key);
    } catch (err) {
      setLoginError(err.status === 401 ? 'Clave incorrecta' : err.message);
    }
  };

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 3000);
  };

  const handleSubmit = async (data) => {
    if (editing) {
      await update(editing.id, data);
      setEditing(null);
      flash('Pregunta actualizada');
    } else {
      await create(data);
      flash('Pregunta creada');
    }
  };

  const handleDelete = async (id) => {
    try {
      await remove(id);
      if (editing?.id === id) setEditing(null);
      flash('Pregunta eliminada');
    } catch (err) {
      flash(`Error: ${err.message}`);
    }
  };

  return (
    <div className="admin">
      <header className="admin__header">
        <h1>Administrar preguntas del chatbot</h1>
        <nav>
          <Link to="/">Ver chatbot</Link>
          {apiKey && (
            <button type="button" className="btn btn--sm" onClick={() => logout()}>
              Cerrar sesión
            </button>
          )}
        </nav>
      </header>

      {!apiKey ? (
        <LoginForm onLogin={handleLogin} error={loginError} />
      ) : (
        <div className="admin__grid">
          <QuestionForm
            initial={editing}
            suggestedNumber={nextNumber}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
          />
          <section className="card">
            <h2>Preguntas registradas ({questions.length})</h2>
            {notice && <p className="alert alert--success" role="status">{notice}</p>}
            {error && <p className="alert alert--error">{error}</p>}
            <QuestionTable
              questions={questions}
              loading={loading}
              editingId={editing?.id}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          </section>
        </div>
      )}
    </div>
  );
}
