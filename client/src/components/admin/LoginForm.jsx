import { useState } from 'react';

export default function LoginForm({ onLogin, error }) {
  const [key, setKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (key.trim()) onLogin(key.trim());
  };

  return (
    <form className="card login" onSubmit={handleSubmit}>
      <img className="login__logo" src="/logo.png" alt="Institución Universitaria de Barranquilla" width="240" height="58" />
      <h1 className="login__title">Panel de administración</h1>
      <p className="muted login__text">Ingresa la clave de administrador para gestionar las preguntas del chatbot.</p>
      <label className="field">
        <span>Clave</span>
        <input type="password" value={key} onChange={(e) => setKey(e.target.value)} autoFocus autoComplete="current-password" />
      </label>
      {error && <p className="alert alert--error">{error}</p>}
      <button type="submit" className="btn btn--primary btn--block" disabled={!key.trim()}>
        Entrar
      </button>
    </form>
  );
}
