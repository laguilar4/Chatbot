import { useEffect, useRef, useState } from 'react';
import { usePublicQuestions } from '../../hooks/usePublicQuestions';
import { WHATSAPP_URL } from '../../config';
import { CloseIcon, SendIcon, WhatsAppIcon } from './icons';

const VIEWS = { MENU: 'menu', QUESTIONS: 'questions' };

let messageId = 0;
const botMsg = (text) => ({ id: ++messageId, from: 'bot', text });
const userMsg = (text) => ({ id: ++messageId, from: 'user', text });

export default function ChatWindow({ onClose }) {
  const [view, setView] = useState(VIEWS.MENU);
  const [messages, setMessages] = useState(() => [botMsg('¡Hola! 👋 ¿Cómo podemos ayudarte? Elige una opción:')]);
  const [input, setInput] = useState('');
  const [listVisible, setListVisible] = useState(true);
  const { questions, status, reload } = usePublicQuestions(view === VIEWS.QUESTIONS);

  const lastUserMsgRef = useRef(null);
  const inputRef = useRef(null);
  const lastUserMsgId = messages.findLast((m) => m.from === 'user')?.id;

  // Deja el último mensaje del usuario arriba para que lo que responde el bot se lea desde el inicio.
  useEffect(() => {
    lastUserMsgRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [messages, status]);

  useEffect(() => {
    if (view === VIEWS.QUESTIONS && status === 'success') inputRef.current?.focus();
  }, [view, status]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const push = (...msgs) => setMessages((prev) => [...prev, ...msgs]);

  const openQuestions = (label = 'Preguntas') => {
    push(userMsg(label), botMsg('Escribe el número de la pregunta que deseas consultar:'));
    setView(VIEWS.QUESTIONS);
    setListVisible(true);
  };

  const openWhatsApp = () => {
    window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer');
  };

  const backToMenu = () => {
    push(userMsg('Volver al menú'), botMsg('¿En qué más podemos ayudarte?'));
    setView(VIEWS.MENU);
  };

  const answer = (rawValue) => {
    const value = String(rawValue).trim();
    if (!value) return;

    const found = questions.find((q) => String(q.optionNumber) === value);
    push(
      userMsg(found ? `${found.optionNumber}. ${found.question}` : value),
      botMsg(found ? found.answer : `"${value}" no es una opción válida. Escribe uno de los números de la lista.`),
    );
    setInput('');
    setListVisible(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    answer(input);
  };

  return (
    <section className="cb-window" role="dialog" aria-label="Chat de ayuda">
      <header className="cb-header">
        <div>
          <strong>Asistente virtual</strong>
          <span className="cb-header__status">En línea</span>
        </div>
        <button type="button" className="cb-icon-btn" onClick={onClose} aria-label="Cerrar chat">
          <CloseIcon />
        </button>
      </header>

      <div className="cb-body" aria-live="polite">
        {messages.map((m) => (
          <div
            key={m.id}
            ref={m.id === lastUserMsgId ? lastUserMsgRef : undefined}
            className={`cb-msg cb-msg--${m.from}`}
          >
            {m.text}
          </div>
        ))}

        {view === VIEWS.MENU && (
          <div className="cb-options">
            <button type="button" className="cb-option" onClick={() => openQuestions()}>
              ❓ Preguntas
            </button>
            <button type="button" className="cb-option cb-option--whatsapp" onClick={openWhatsApp}>
              <WhatsAppIcon /> WhatsApp
            </button>
          </div>
        )}

        {view === VIEWS.QUESTIONS && (
          <QuestionsPanel
            status={status}
            questions={questions}
            listVisible={listVisible}
            onSelect={answer}
            onRetry={reload}
            onShowList={() => openQuestions('Ver otras preguntas')}
            onBack={backToMenu}
          />
        )}
      </div>

      {view === VIEWS.QUESTIONS && (
        <form className="cb-input" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            placeholder="Escribe el número..."
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/\D/g, ''))}
            disabled={status !== 'success' || questions.length === 0}
            aria-label="Número de la pregunta"
            maxLength={5}
          />
          <button type="submit" className="cb-send" disabled={!input} aria-label="Enviar">
            <SendIcon />
          </button>
        </form>
      )}
    </section>
  );
}

function QuestionsPanel({ status, questions, listVisible, onSelect, onRetry, onShowList, onBack }) {
  if (!listVisible) {
    return (
      <div className="cb-questions">
        <button type="button" className="cb-option" onClick={onShowList}>
          Ver otras preguntas
        </button>
        <button type="button" className="cb-link cb-back" onClick={onBack}>
          ← Volver al menú
        </button>
      </div>
    );
  }

  return (
    <div className="cb-questions">
      {status === 'loading' && <p className="cb-muted">Cargando preguntas...</p>}

      {status === 'error' && (
        <p className="cb-muted">
          No pudimos cargar las preguntas.{' '}
          <button type="button" className="cb-link" onClick={onRetry}>
            Reintentar
          </button>
        </p>
      )}

      {status === 'success' && questions.length === 0 && (
        <p className="cb-muted">Aún no hay preguntas disponibles.</p>
      )}

      {status === 'success' && questions.length > 0 && (
        <ul className="cb-question-list">
          {questions.map((q) => (
            <li key={q.id}>
              <button type="button" className="cb-question" onClick={() => onSelect(q.optionNumber)}>
                <span className="cb-question__num">{q.optionNumber}</span>
                {q.question}
              </button>
            </li>
          ))}
        </ul>
      )}

      <button type="button" className="cb-link cb-back" onClick={onBack}>
        ← Volver al menú
      </button>
    </div>
  );
}
