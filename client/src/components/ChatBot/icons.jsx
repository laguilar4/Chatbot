import { useId } from 'react';

const base = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true };

export const OwlShieldIcon = ({
  size = 64,
  primaryColor = '#06b6d4',
  accentColor = '#f59e0b',
  eyeColor = '#38bdf8',
  className = '',
}) => {
  const uid = useId().replace(/:/g, '');
  const shieldId = `shield-bg-grad-${uid}`;
  const bodyId = `owl-body-grad-${uid}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={shieldId} x1="15" y1="5" x2="85" y2="95" gradientUnits="userSpaceOnUse">
          <stop stopColor={primaryColor} />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id={bodyId} x1="30" y1="30" x2="70" y2="75" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>

      {/* Escudo */}
      <path
        d="M50 8C68 8 85 14 85 14V46C85 68.5 69.5 87.5 50 93C30.5 87.5 15 68.5 15 46V14C15 14 32 8 50 8Z"
        fill={`url(#${shieldId})`}
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Cabeza y cuerpo del búho */}
      <path d="M32 40C32 30 40 25 50 25C60 25 68 30 68 40C68 55 62 70 50 72C38 70 32 55 32 40Z" fill={`url(#${bodyId})`} />

      {/* Alas */}
      <path d="M26 42C26 42 33 46 33 58C33 66 27 72 27 72C27 72 38 70 41 60C43 53 40 44 37 40C34 37 26 42 26 42Z" fill="#cbd5e1" />
      <path d="M74 42C74 42 67 46 67 58C67 66 73 72 73 72C73 72 62 70 59 60C57 53 60 44 63 40C66 37 74 42 74 42Z" fill="#cbd5e1" />

      {/* Ojos */}
      <circle cx="42" cy="40" r="7" fill="#0f172a" />
      <circle cx="58" cy="40" r="7" fill="#0f172a" />
      <circle cx="44" cy="38" r="2.5" fill={eyeColor} />
      <circle cx="60" cy="38" r="2.5" fill={eyeColor} />
      <circle cx="41" cy="41" r="1" fill="#ffffff" />
      <circle cx="57" cy="41" r="1" fill="#ffffff" />

      {/* Pico */}
      <path d="M47 45L53 45L50 50Z" fill={accentColor} stroke="#d97706" strokeWidth="0.5" />

      {/* Birrete */}
      <path d="M50 16L70 23L50 30L30 23L50 16Z" fill="#1e293b" />
      <path d="M38 26.5V31.5C38 34.5 62 34.5 62 31.5V26.5" fill="#0f172a" />
      <path d="M65 24.5L67 33" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="67" cy="34" r="1.5" fill={accentColor} />
    </svg>
  );
};

export const CloseIcon = () => (
  <svg {...base} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const SendIcon = () => (
  <svg {...base} width={20} height={20} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4zM22 2 11 13" />
  </svg>
);

export const WhatsAppIcon = () => (
  <svg {...base} width={18} height={18} fill="currentColor">
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43a9.38 9.38 0 0 1 9.42 9.44c0 5.2-4.23 9.43-9.43 9.43zm8.02-17.46A11.27 11.27 0 0 0 12.05.72C5.8.72.7 5.8.7 12.06c0 2 .52 3.95 1.52 5.67L.6 23.6l6.02-1.58a11.33 11.33 0 0 0 5.42 1.38h.01c6.25 0 11.34-5.09 11.34-11.34 0-3.03-1.18-5.88-3.32-8.02z" />
  </svg>
);
