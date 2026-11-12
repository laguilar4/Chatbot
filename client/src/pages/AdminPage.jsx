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
  const activeCount = useMemo(() => questions.filter((q) => q.isActive).length, [questions]);

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
    <div className="admin-page">
      <header className="admin-topbar">
        <div className="admin-topbar__inner">
          <Link to="/" className="admin-topbar__brand">
            <img src="/logo.png" alt="Institución Universitaria de Barranquilla" width="167" height="40" />
          </Link>
          <nav className="admin-topbar__nav">
            <Link to="/" className="btn btn--ghost btn--sm">Ver sitio</Link>
            {apiKey && (
              <button type="button" className="btn btn--sm" onClick={() => logout()}>
                Cerrar sesión
              </button>
            )}
          </nav>
        </div>
      </header>

      {!apiKey ? (
        <LoginForm onLogin={handleLogin} error={loginError} />
      ) : (
        <main className="admin">
          <div className="admin__intro">
            <div>
              <h1>Preguntas del chatbot</h1>
              <p className="muted">Crea, edita u oculta las respuestas que ve la comunidad estudiantil.</p>
            </div>
            <dl className="admin__stats">
              <div><dt>Total</dt><dd>{questions.length}</dd></div>
              <div><dt>Visibles</dt><dd>{activeCount}</dd></div>
              <div><dt>Ocultas</dt><dd>{questions.length - activeCount}</dd></div>
            </dl>
          </div>

          {notice && <p className="alert alert--success admin__notice" role="status">{notice}</p>}

          <div className="admin__grid">
            <QuestionForm
              initial={editing}
              suggestedNumber={nextNumber}
              onSubmit={handleSubmit}
              onCancel={() => setEditing(null)}
            />
            <section className="card">
              <h2 className="card__title">Preguntas registradas</h2>
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
        </main>
      )}
    </div>
  );
}
