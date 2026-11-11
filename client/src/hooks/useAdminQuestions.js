import { useCallback, useEffect, useState } from 'react';
import { questionsApi } from '../api/questionsApi';

/** CRUD de preguntas para el panel de administración. */
export function useAdminQuestions(apiKey, onUnauthorized) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleError = useCallback(
    (err) => {
      if (err.status === 401) onUnauthorized?.();
      throw err;
    },
    [onUnauthorized],
  );

  const refresh = useCallback(
    async (signal) => {
      if (!apiKey) return;
      setLoading(true);
      setError('');
      try {
        setQuestions(await questionsApi.listAll(apiKey, signal));
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (err.status === 401) onUnauthorized?.();
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [apiKey, onUnauthorized],
  );

  useEffect(() => {
    const controller = new AbortController();
    refresh(controller.signal);
    return () => controller.abort();
  }, [refresh]);

  const sortByNumber = (list) => [...list].sort((a, b) => a.optionNumber - b.optionNumber);

  const create = useCallback(
    async (data) => {
      const created = await questionsApi.create(apiKey, data).catch(handleError);
      setQuestions((prev) => sortByNumber([...prev, created]));
    },
    [apiKey, handleError],
  );

  const update = useCallback(
    async (id, data) => {
      const updated = await questionsApi.update(apiKey, id, data).catch(handleError);
      setQuestions((prev) => sortByNumber(prev.map((q) => (q.id === id ? updated : q))));
    },
    [apiKey, handleError],
  );

  const remove = useCallback(
    async (id) => {
      await questionsApi.remove(apiKey, id).catch(handleError);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    },
    [apiKey, handleError],
  );

  return { questions, loading, error, refresh, create, update, remove };
}
