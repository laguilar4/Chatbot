export const API_URL = import.meta.env.VITE_API_URL ?? '/api';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? '573014837377';
const WHATSAPP_MESSAGE = import.meta.env.VITE_WHATSAPP_MESSAGE ?? 'Hola, quiero más información.';

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
