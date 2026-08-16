import { Link } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import {
  HiArrowRight,
  HiChartBar,
  HiCheckCircle,
  HiClock,
  HiExclamationCircle,
  HiInformationCircle,
  HiLightBulb,
  HiSparkles,
} from 'react-icons/hi'
import { FaBrain, FaGamepad, FaHandsHelping } from 'react-icons/fa'
import PortalHeader from '../components/PortalHeader'
import { formatDate, formatDuration, GAMES } from '../utils/gameData'
import { buildTherapyModel, gameDetails } from '../utils/therapyMetrics'

function CalculationNote({ children }) {
  return (
    <span className="calculation-note" tabIndex="0" aria-label={children}>
      <HiInformationCircle />
      <span className="calculation-tooltip" role="tooltip">{children}</span>
    </span>
  )
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, max: 100, grid: { color: '#e8edf4' }, ticks: { callback: (value) => `${value}%` } },
    x: { grid: { display: false } },
  },
}

export default function TherapistDashboard({ records = [], error = '', loading = false }) {
  const model = buildTherapyModel(records)
  const latest = records[0]
  const strongest = model.indicators.slice().sort((a, b) => b.value - a.value)[0]
  const reinforce = model.indicators.slice().sort((a, b) => a.value - b.value)[0]
  const timeline = model.timeline.length ? model.timeline : [{ label: 'Inicio', value: 0 }]
  const chartData = {
    labels: timeline.map((point) => point.label),
    datasets: [{
      data: timeline.map((point) => point.value),
      borderColor: '#075eb6',
      backgroundColor: 'rgba(7, 94, 182, .12)',
      borderWidth: 3,
      fill: true,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#075eb6',
      pointBorderWidth: 2,
      tension: .38,
    }],
  }

  const insights = records.length ? [
    `${strongest.name} es actualmente la habilidad con mejor desempeño (${strongest.value}%).`,
    `${reinforce.name} presenta la mayor oportunidad de refuerzo durante las próximas sesiones.`,
    model.stats.simon.count
      ? `Simón Dice acumula ${model.stats.simon.count} sesiones y favorece el entrenamiento de memoria sostenida.`
      : 'Se recomienda iniciar una sesión de Simón Dice para establecer la línea base de memoria.',
    latest
      ? `La actividad más reciente fue ${GAMES[latest.game]?.label || 'un juego terapéutico'} y duró ${formatDuration(latest.durationSeconds)}.`
      : 'Aún no hay sesiones registradas para construir una tendencia clínica.',
  ] : [
    'El panel comenzará a generar observaciones cuando llegue la primera sesión.',
    'Se recomienda registrar una actividad de cada juego para establecer una línea base.',
  ]

  return (
    <div className="portal-page">
      <PortalHeader />
      <main className="portal-shell">
        <span className="page-kicker">Decisiones clínicas basadas en juego</span>
        <h1 className="page-title">Seguimiento terapéutico</h1>
        <p className="page-subtitle">Comprende la evolución del paciente, no solo sus puntajes.</p>

        {error && <div className="panel" style={{ borderColor: '#f0b7b7', marginBottom: 20 }}><HiExclamationCircle color="#ba1a1a" /> {error}</div>}
        {loading && <div className="panel" style={{ marginBottom: 20 }}>Sincronizando sesiones con Firebase…</div>}

        <section className="panel patient-summary">
          <div className="patient-avatar">SM</div>
          <div>
            <div className="patient-name">Sofía M.</div>
            <div className="patient-meta">
              <span>8 años</span><span>•</span><span>Plan: coordinación y atención</span>
              <span>•</span><span>{model.completed} sesiones registradas</span>
            </div>
            <div style={{ marginTop: 14 }}><span className="status-chip">Evolución favorable</span></div>
          </div>
          <div className="overall-score">
            <span>Progreso global</span>
            <strong>{model.overall}%</strong>
            <small>{formatDuration(model.totalSeconds)} de terapia</small>
          </div>
        </section>

        <section className="dashboard-grid grid-4 section-gap">
          {model.indicators.map((indicator) => (
            <article className="panel metric-card" style={{ '--metric-color': indicator.color }} key={indicator.name}>
              <div className="metric-top">
                <strong>{indicator.name} <CalculationNote>Promedio ponderado de las partidas: resultado, puntaje o nivel y, en recorridos, tiempo. Las sesiones recientes pesan más y cada juego aporta según su relación con esta habilidad.</CalculationNote></strong>
                <span className="trend-up">↑ evolución</span>
              </div>
              <div className="metric-value">{indicator.value}%</div>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${indicator.value}%` }} /></div>
              <p className="interpretation">{indicator.note}</p>
            </article>
          ))}
        </section>

        <section className="dashboard-grid grid-2 section-gap">
          <article className="panel">
            <h2 className="panel-title"><span>Evolución general <CalculationNote>Cada punto representa el desempeño de una sesión reciente (máximo 10): puntaje sobre 8, nivel sobre 3 o resultado y tiempo en los recorridos. Una derrota rápida no se considera mejora.</CalculationNote></span><HiChartBar color="#075eb6" /></h2>
            <p className="interpretation" style={{ marginTop: -8 }}>Tendencia combinada de las últimas sesiones.</p>
            <div className="chart-wrap"><Line data={chartData} options={chartOptions} /></div>
          </article>
          <article className="panel">
            <h2 className="panel-title"><span>Observaciones clínicas</span><HiSparkles color="#705bd8" /></h2>
            <div className="insight-list">
              {insights.map((insight, index) => (
                <div className="insight" key={insight}>
                  {index === 1 ? <HiLightBulb /> : <HiCheckCircle />}
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="section-gap">
          <h2 className="panel-title" style={{ fontSize: 24 }}>Rendimiento por actividad</h2>
          <div className="dashboard-grid grid-4">
            {Object.entries(GAMES).map(([game, info]) => {
              const stat = model.stats[game]
              return (
                <article className="panel game-card" style={{ '--game-color': info.color }} key={game}>
                  <div className="game-card-header">
                    <div className="game-symbol">{gameDetails[game].symbol}</div>
                    <div><h3>{info.label}</h3><div className="game-skill">{gameDetails[game].skill}</div></div>
                  </div>
                  <div className="mini-stats">
                    <div className="mini-stat"><span>Sesiones</span><strong>{stat.count}</strong></div>
                    <div className="mini-stat"><span>Éxito</span><strong>{stat.success}%</strong></div>
                    <div className="mini-stat"><span>Tiempo</span><strong>{formatDuration(stat.items.length ? stat.items.reduce((sum, item) => sum + item.durationSeconds, 0) / stat.items.length : 0)}</strong></div>
                  </div>
                  <Link className="secondary-button" style={{ marginTop: 18, width: '100%' }} to={`/juegos/${game}`}>Ver detalle <HiArrowRight /></Link>
                </article>
              )
            })}
          </div>
        </section>

        <section className="dashboard-grid grid-3 section-gap">
          <article className="panel">
            <h2 className="panel-title"><span>Perfil de habilidades</span><FaBrain color="#705bd8" /></h2>
            {model.indicators.map((indicator) => (
              <div key={indicator.name} style={{ marginBottom: 17 }}>
                <div className="metric-top" style={{ marginBottom: 7 }}><span>{indicator.name}</span><strong>{indicator.value}%</strong></div>
                <div className="progress-track"><div className="progress-fill" style={{ '--metric-color': indicator.color, width: `${indicator.value}%` }} /></div>
              </div>
            ))}
          </article>
          <article className="panel">
            <h2 className="panel-title"><span>Comparación de sesión</span><HiClock color="#e9780b" /></h2>
            <div className="mini-stats" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="mini-stat"><span>Sesión actual</span><strong>{latest ? formatDuration(latest.durationSeconds) : '—'}</strong></div>
              <div className="mini-stat"><span>Sesión previa</span><strong>{records[1] ? formatDuration(records[1].durationSeconds) : '—'}</strong></div>
              <div className="mini-stat"><span>Resultado</span><strong>{latest?.resultado || '—'}</strong></div>
              <div className="mini-stat"><span>Tendencia</span><strong style={{ color: '#16853b' }}>Favorable</strong></div>
            </div>
          </article>
          <article className="panel">
            <h2 className="panel-title"><span>Próxima recomendación</span><FaHandsHelping color="#16853b" /></h2>
            <p style={{ fontSize: 20, fontWeight: 800 }}>Reforzar {reinforce.name.toLowerCase()}</p>
            <p className="interpretation">Programa una actividad corta y registra el nivel de asistencia para comparar la respuesta con la sesión anterior.</p>
            <Link className="primary-button" style={{ marginTop: 18 }} to="/juegos/traza">Abrir actividad sugerida</Link>
          </article>
        </section>

        <section className="panel section-gap">
          <h2 className="panel-title"><span>Historial de sesiones</span><Link to="/historial" style={{ color: '#075eb6', fontSize: 14 }}>Ver historial completo</Link></h2>
          <div className="history-list">
            {records.slice(0, 6).map((record) => (
              <div className="history-row" key={record.id}>
                <div><strong>{GAMES[record.game]?.label}</strong><div className="game-skill">{formatDate(record.timestamp, record.fecha)}</div></div>
                <span>{record.resultado}</span>
                <span>{formatDuration(record.durationSeconds)}</span>
                <span className="status-chip">Registrada</span>
              </div>
            ))}
            {!records.length && <p className="interpretation">Todavía no existen sesiones para mostrar.</p>}
          </div>
        </section>
      </main>
    </div>
  )
}
