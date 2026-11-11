import { Link } from 'react-router-dom';
import ChatBot from '../components/ChatBot/ChatBot';
import './HomePage.css';

const OFFICIAL_SITE = 'https://www.unibarranquilla.edu.co/';

const NAV_LINKS = [
  { href: '#programas', label: 'Programas' },
  { href: '#admisiones', label: 'Admisiones' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#noticias', label: 'Noticias' },
  { href: '#equipo', label: 'Equipo' },
];

const TEAM = [
  'María Angelica Peña Pérez',
  'Sebastián Mendoza Torres',
  'Wendy Miranda Hincapié',
  'Bryan Botello Vázquez',
];

const initials = (name) =>
  name
    .split(' ')
    .filter((_, i, parts) => i === 0 || i === parts.length - 2)
    .map((part) => part[0])
    .join('');

const PROGRAMS = [
  { level: 'Nivel 1', title: 'Técnico Profesional', text: 'El primer ciclo de formación, enfocado en competencias prácticas para el trabajo.' },
  { level: 'Nivel 2', title: 'Tecnólogo', text: 'Continúa tu ruta y profundiza en la gestión y la aplicación de tu área.' },
  { level: 'Nivel 3', title: 'Profesional Universitario', text: 'Culmina los ciclos propedéuticos con una formación profesional completa.' },
];

const STEPS = [
  { title: 'Consulta los requisitos', text: 'Revisa qué documentos necesitas según tu modalidad de ingreso.' },
  { title: 'Resuelve tus dudas', text: 'Pregúntale al asistente virtual sobre matrículas, notas y transferencias.' },
  { title: 'Completa tu inscripción', text: 'Realiza el proceso por los canales oficiales de la institución.' },
];

const SERVICES = ['Biblioteca', 'Bienestar', 'Calendario', 'Investigación', 'Egresados', 'Internacionalización'];

const NEWS = [
  { tag: 'Académico', title: 'Noticia de ejemplo sobre la vida académica' },
  { tag: 'Investigación', title: 'Noticia de ejemplo sobre semilleros y proyectos' },
  { tag: 'Bienestar', title: 'Noticia de ejemplo sobre actividades estudiantiles' },
];

export default function HomePage() {
  return (
    <div className="site">
      <p className="site-notice" role="note">
        <strong>Demostración de un proyecto de grado.</strong> Este no es el sitio oficial de la Institución Universitaria de Barranquilla.{' '}
        <a href={OFFICIAL_SITE} target="_blank" rel="noopener noreferrer">Ir al sitio oficial</a>
      </p>

      <header className="site-header">
        <div className="site-container site-header__inner">
          <a href="#inicio" className="site-brand">
            <img src="/logo.png" alt="Institución Universitaria de Barranquilla" width="200" height="48" />
            <span className="site-brand__badge">Demo · Proyecto de grado</span>
          </a>
          <nav aria-label="Principal" className="site-nav">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}>{link.label}</a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <section id="inicio" className="site-hero">
          <div className="site-container">
            <p className="site-hero__eyebrow">Educación superior por ciclos propedéuticos</p>
            <h1>Construye tu futuro profesional paso a paso</h1>
            <p className="site-hero__lead">
              Conoce los programas y resuelve tus dudas sobre admisiones, matrículas y evaluación con nuestro asistente virtual.
            </p>
            <a href="#programas" className="site-btn">Ver programas</a>
          </div>
        </section>

        <section id="programas" className="site-section">
          <div className="site-container">
            <h2>Programas y niveles de formación</h2>
            <div className="site-grid">
              {PROGRAMS.map((program) => (
                <article key={program.title} className="site-card">
                  <span className="site-tag">{program.level}</span>
                  <h3>{program.title}</h3>
                  <p>{program.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="admisiones" className="site-section site-section--tint">
          <div className="site-container">
            <h2>¿Cómo empezar?</h2>
            <ol className="site-steps">
              {STEPS.map((step) => (
                <li key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="servicios" className="site-section">
          <div className="site-container">
            <h2>Servicios para estudiantes</h2>
            <ul className="site-services">
              {SERVICES.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="noticias" className="site-section site-section--tint">
          <div className="site-container">
            <h2>Noticias</h2>
            <div className="site-grid">
              {NEWS.map((item) => (
                <article key={item.title} className="site-card">
                  <span className="site-tag">{item.tag}</span>
                  <h3>{item.title}</h3>
                  <p>Contenido de ejemplo para esta demostración.</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="equipo" className="site-section">
          <div className="site-container">
            <h2>Integrantes del proyecto</h2>
            <p className="site-section__lead">
              Proyecto de grado: asistente virtual para resolver preguntas académicas de la comunidad estudiantil.
            </p>
            <ul className="site-team">
              {TEAM.map((name) => (
                <li key={name}>
                  <span className="site-team__avatar" aria-hidden="true">{initials(name)}</span>
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-container site-footer__inner">
          <p>
            Proyecto de grado de {TEAM.join(', ')}. Sitio de demostración: no es el portal oficial de la institución.
          </p>
          <Link to="/admin">Administración</Link>
        </div>
      </footer>

      <ChatBot />
    </div>
  );
}
