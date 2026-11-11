import { useState } from 'react';

export default function LoginForm({ onLogin, error }) {
  const [key, setKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (key.trim()) onLogin(key.trim());
  };

  return (
    <form className="card login" onSubmit={handleSubmit}>
      <h2>Acceso de administrador</h2>
      <p className="muted">Ingresa la clave definida en <code>ADMIN_API_KEY</code> del servidor.</p>
      <label className="field">
        <span>Clave</span>
        <input type="password" value={key} onChange={(e) => setKey(e.target.value)} autoFocus autoComplete="current-password" />
      </label>
      {error && <p className="alert alert--error">{error}</p>}
      <button type="submit" className="btn btn--primary" disabled={!key.trim()}>
        Entrar
      </button>
    </form>
  );
}
