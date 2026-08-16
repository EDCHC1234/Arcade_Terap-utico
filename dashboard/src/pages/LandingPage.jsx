import { Link } from 'react-router-dom'
import {
  HiArrowRight,
  HiChartBar,
  HiCheckCircle,
  HiCloudUpload,
  HiLightningBolt,
  HiSparkles,
} from 'react-icons/hi'
import { FaBrain, FaChild, FaGamepad, FaHeartbeat, FaMicrochip } from 'react-icons/fa'

const therapistImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbvS_y9QIIXxXZAxcFBLQls-HKGwkspoWlNEtHgm5qV0Ov3RsXF7RDGCQFb6YfM7rxVCbqocNePVX5Oo8mpZI6ci79iDK308BCrvr3hg-axiwueGC_8gewWQAaEhGIYJADlBibwmJF010FehI1LW6WUf8gvKhtk1xFR92DgbhE4UixseDNZflIWr37i-FYNJsl-K8iroz49B9BZmsE0wz9t57VoNfzhICd02wD3IAQAVp4041ynrqpNVnUGgPybKTk0ASGZtz0AXf6'
const arcadeImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbvE7YvE60uwymmh4EHNiUmXWDsgHYxdRsYHKxs6hv_sSaXq1iGWZZmDoeh0kKeNEBzEezjae1eiUX1FEfgsiivvvcvg4YSaOPbjVrf0uB4A7OTJn9Fj0SZpc1M_gXNs6HvMS_xcdLPaja3od_iWJeQTWZSHR7mAxiBVFT6EdPH53U-r4IfxyPb6Gij7LK4J1VN_3IVVw7O4suzGTrpDwuC0bGju7a8tejNi0VXqalHjmDreJaielotKZsB8Is8G14b50xsraZLOe1'

const benefits = [
  { icon: <HiChartBar />, title: 'Medición objetiva', text: 'Convierte cada partida en evidencia clara del progreso terapéutico.' },
  { icon: <HiCloudUpload />, title: 'Registro automático', text: 'Las sesiones se guardan sin interrumpir la atención del paciente.' },
  { icon: <HiLightningBolt />, title: 'Monitoreo en tiempo real', text: 'Consulta resultados apenas termina cada actividad del arcade.' },
  { icon: <FaBrain />, title: 'Decisiones clínicas', text: 'Identifica fortalezas, tendencias y habilidades por reforzar.' },
]

const workflow = [
  { icon: <FaGamepad />, step: 'Paso 01', title: 'El niño juega', text: 'Participa en actividades diseñadas para estimular habilidades clave.' },
  { icon: <FaMicrochip />, step: 'Paso 02', title: 'ESP32 registra', text: 'La consola captura duración, resultado, nivel y puntaje.' },
  { icon: <HiCloudUpload />, step: 'Paso 03', title: 'Datos seguros', text: 'MQTT y Firebase conservan automáticamente cada sesión.' },
  { icon: <HiChartBar />, step: 'Paso 04', title: 'El terapeuta analiza', text: 'El panel transforma métricas en observaciones comprensibles.', active: true },
]

export default function LandingPage() {
  return (
    <>
      <header className="site-header">
        <Link className="brand" to="/">
          <span className="brand-mark"><HiSparkles /></span>
          <span>Arcade Terapéutico</span>
        </Link>
        <nav className="site-nav" aria-label="Navegación del sitio">
          <a href="#beneficios">Beneficios</a>
          <a href="#tecnologia">Tecnología</a>
          <a href="#como-funciona">Cómo funciona</a>
          <Link className="primary-button nav-cta" to="/terapeuta">Ver plataforma</Link>
        </nav>
      </header>

      <main className="stack-page">
        <section className="stack-section" style={{ background: '#edf4ff', zIndex: 1 }}>
          <div className="landing-container hero-grid">
            <div>
              <span className="eyebrow">Salud digital infantil</span>
              <h1 className="hero-title">Transformamos la rehabilitación a través del <span>juego inteligente</span></h1>
              <p className="hero-copy">
                Una plataforma que ayuda a terapeutas ocupacionales a evaluar el progreso infantil con datos objetivos obtenidos durante juegos terapéuticos.
              </p>
              <div className="button-row">
                <Link className="primary-button" to="/terapeuta">Acceso terapeuta <HiArrowRight /></Link>
                <Link className="orange-button" to="/paciente">Mi panel de juego <FaChild /></Link>
              </div>
            </div>
            <img className="hero-image" src={therapistImage} alt="Terapeuta acompaña a una niña durante una actividad digital" />
          </div>
        </section>

        <section id="beneficios" className="stack-section" style={{ background: '#f9fbff', zIndex: 2 }}>
          <div className="landing-container">
            <h2 className="section-heading center-copy">Innovación en cada sesión</h2>
            <p className="section-lead center-copy">Tecnología pensada para que el progreso terapéutico sea visible, medible y fácil de interpretar.</p>
            <div className="feature-grid">
              {benefits.map((benefit) => (
                <article className="feature-card" key={benefit.title}>
                  <div className="feature-icon">{benefit.icon}</div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="tecnologia" className="stack-section" style={{ background: '#eaf2ff', zIndex: 3 }}>
          <div className="landing-container split-grid">
            <img className="clinical-image" src={arcadeImage} alt="Arcade terapéutico utilizado en una sesión infantil" />
            <div>
              <span className="page-kicker">Tecnología con propósito</span>
              <h2 className="section-heading">Hardware diseñado para acompañar la terapia</h2>
              <p className="section-lead">La consola transforma interacciones lúdicas en métricas útiles sin convertir la sesión en una prueba clínica fría.</p>
              <ul className="check-list">
                <li><HiCheckCircle /> Joystick de precisión para coordinación visomotora</li>
                <li><HiCheckCircle /> Botones LED para memoria, atención y velocidad de respuesta</li>
                <li><HiCheckCircle /> Registro automático mediante ESP32 y MQTT seguro</li>
                <li><HiCheckCircle /> Reportes claros para seguimiento longitudinal</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="stack-section" style={{ background: '#dfeaff', zIndex: 4 }}>
          <div className="landing-container">
            <span className="page-kicker">Del juego a una decisión clínica</span>
            <h2 className="section-heading">Flujo de trabajo inteligente</h2>
            <p className="section-lead">Cada resultado viaja de forma automática desde el arcade hasta el panel de seguimiento.</p>
            <div className="workflow-grid">
              {workflow.map((item) => (
                <article className={`workflow-card ${item.active ? 'active' : ''}`} key={item.title}>
                  <div className="workflow-icon">{item.icon}</div>
                  <span className="page-kicker">{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="stack-section" style={{ background: '#f7faff', zIndex: 5 }}>
          <div className="landing-container">
            <div className="cta-panel">
              <FaHeartbeat size={38} color="#16853b" />
              <h2 className="section-heading">¿Listo para comprender mejor cada avance?</h2>
              <p className="section-lead center-copy">Explora la experiencia clínica del terapeuta o acompaña al paciente desde un espacio motivador.</p>
              <div className="button-row" style={{ justifyContent: 'center' }}>
                <Link className="primary-button" to="/terapeuta">Abrir panel terapeuta <HiArrowRight /></Link>
                <Link className="secondary-button" to="/paciente">Ver panel del paciente</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="landing-footer">
        <strong>Arcade Terapéutico Inteligente</strong>
        <span>Rehabilitación medible, humana y motivadora.</span>
      </footer>
    </>
  )
}
