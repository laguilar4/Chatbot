import { useState } from 'react';
import ChatWindow from './ChatWindow';
import { OwlShieldIcon, CloseIcon } from './icons';
import './ChatBot.css';

export default function ChatBot() {
  const [open, setOpen] = useState(false);

  return (
    <div className="cb-root">
      {open && <ChatWindow onClose={() => setOpen(false)} />}
      <button
        type="button"
        className={open ? 'cb-bubble' : 'cb-bubble cb-bubble--badge'}
        aria-label={open ? 'Cerrar chat' : 'Abrir chat'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <CloseIcon /> : <OwlShieldIcon size={64} />}
      </button>
    </div>
  );
}
