import { useCallback, useEffect, useRef, useState } from 'react';
import { questionsApi } from '../api/questionsApi';

/**
 * Carga las preguntas activas sólo cuando `enabled` es true (p. ej. al abrir "Preguntas").
 * Expone `reload` para reintentar tras un error.
 */
export function usePublicQuestions(enabled) {
  const [questions, setQuestions] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const controllerRef = useRef(null);

  const load = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setStatus('loading');
    try {
      const data = await questionsApi.listPublic(controller.signal);
      setQuestions(data);
      setStatus('success');
    } catch (err) {
      if (err.name !== 'AbortError') setStatus('error');
    }
  }, []);

  useEffect(() => {
    if (enabled) load();
    return () => controllerRef.current?.abort();
  }, [enabled, load]);

  return { questions, status, reload: load };
}
