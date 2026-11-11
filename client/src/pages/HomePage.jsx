import { Link } from 'react-router-dom';
import ChatBot from '../components/ChatBot/ChatBot';

export default function HomePage() {
  return (
    <main className="home">
      <h1>Bienvenido</h1>
      <p className="muted">Haz clic en la burbuja de la esquina inferior derecha para abrir el chatbot.</p>
      <Link to="/admin" className="btn btn--primary">Ir al panel de administración</Link>
      <ChatBot />
    </main>
  );
}
