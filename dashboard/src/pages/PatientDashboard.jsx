import { Link } from 'react-router-dom'
import { HiArrowRight, HiCheckCircle, HiFire, HiSparkles, HiStar } from 'react-icons/hi'
import { FaGamepad, FaMedal, FaTrophy } from 'react-icons/fa'
import PortalHeader from '../components/PortalHeader'
import { formatDuration, GAMES } from '../utils/gameData'
import { buildTherapyModel, gameDetails } from '../utils/therapyMetrics'

export default function PatientDashboard({ records = [], loading = false }) {
  const model = buildTherapyModel(records)
  const stars = Math.max(0, model.completed * 3 + model.stats.simon.best)
  const recommendedGame = Object.entries(model.stats).sort((a, b) => a[1].progress - b[1].progress)[0]?.[0] || 'simon'

  return (
    <div className="portal-page kid-page">
      <PortalHeader patient />
      <main className="portal-shell">
        <section className="panel kid-hero">
          <div>
            <span className="page-kicker" style={{ color: '#fff1a8' }}>Tu espacio de progreso</span>
            <h1>¡Hola, Sofía! 👋</h1>
            <p>{loading ? 'Preparando tus logros…' : 'Cada partida te ayuda a ser más hábil. ¡Sigue así!'}</p>
            <div style={{ marginTop: 24, maxWidth: 560 }}>
              <div className="metric-top"><strong>Meta de hoy</strong><strong>{Math.max(10, model.overall)}%</strong></div>
              <div className="progress-track" style={{ marginTop: 9, background: 'rgba(255,255,255,.24)', height: 14 }}>
                <div className="progress-fill" style={{ '--metric-color': '#ffcf55', width: `${Math.max(10, model.overall)}%` }} />
              </div>
            </div>
          </div>
          <div className="kid-avatar">😊</div>
        </section>

        <section className="dashboard-grid grid-4 section-gap">
          {[
            { value: model.completed, label: 'Juegos completados', icon: <FaGamepad /> },
            { value: stars, label: 'Estrellas ganadas', icon: <HiStar /> },
            { value: `${Math.max(1, Math.min(7, model.completed))} días`, label: 'Racha de práctica', icon: <HiFire /> },
            { value: `${model.overall}%`, label: 'Mi progreso', icon: <HiSparkles /> },
          ].map((stat) => (
            <article className="panel kid-stat" key={stat.label}>
              <div className="feature-icon" style={{ margin: '0 auto 12px' }}>{stat.icon}</div>
              <strong>{stat.value}</strong><span>{stat.label}</span>
            </article>
          ))}
        </section>

        <section className="section-gap">
          <span className="page-kicker">Aprendo jugando</span>
          <h2 className="page-title" style={{ fontSize: 32 }}>Mis juegos</h2>
          <div className="dashboard-grid grid-4">
            {Object.entries(GAMES).map(([game, info]) => {
              const stat = model.stats[game]
              const progress = stat.progress
              const recordValue = (game === 'traza' || game === 'rescate') && !stat.hasWinningTime
                ? 'Sin victorias aún'
                : game === 'simon' ? `${stat.best} puntos` : game === 'pinta' ? `Nivel ${stat.best}` : formatDuration(stat.best)
              return (
                <article className="panel kid-game" style={{ '--game-color': info.color }} key={game}>
                  <div className="game-symbol">{gameDetails[game].symbol}</div>
                  <h3>{info.label}</h3>
                  <div className="game-skill">{gameDetails[game].skill}</div>
                  <div className="record-pill">Mi récord: {recordValue}</div>
                  <div className="metric-top"><span>Progreso</span><strong>{Math.round(progress)}%</strong></div>
                  <div className="progress-track" style={{ margin: '8px 0 18px' }}><div className="progress-fill" style={{ width: `${progress}%`, background: info.color }} /></div>
                  <Link className="primary-button" style={{ width: '100%', background: info.color }} to={`/juegos/${game}`}>Ver mi progreso <HiArrowRight /></Link>
                </article>
              )
            })}
          </div>
        </section>

        <section className="dashboard-grid grid-2 section-gap">
          <article className="panel">
            <h2 className="panel-title"><span>Mis recompensas</span><FaTrophy color="#e99a00" /></h2>
            <div className="reward-row">
              <div className="reward"><span className="reward-icon">🏅</span><div><strong>Primer paso</strong><div className="game-skill">Primera sesión completada</div></div></div>
              <div className="reward"><span className="reward-icon">⭐</span><div><strong>Superestrella</strong><div className="game-skill">{stars} estrellas acumuladas</div></div></div>
              <div className="reward"><span className="reward-icon">🏆</span><div><strong>Nuevo récord</strong><div className="game-skill">Seguiste mejorando</div></div></div>
            </div>
          </article>
          <article className="panel challenge">
            <h2 className="panel-title"><span>Desafío de hoy</span><FaMedal /></h2>
            <p style={{ fontSize: 27, fontWeight: 800, marginBottom: 8 }}>{GAMES[recommendedGame].label}</p>
            <p style={{ color: '#fff5e5', fontSize: 17 }}>Haz que tu hijo juegue una ronda de {GAMES[recommendedGame].label} para reforzar {gameDetails[recommendedGame].skill.toLowerCase()}. Acompáñalo y celebra su esfuerzo.</p>
            <Link className="secondary-button" style={{ marginTop: 18 }} to={`/juegos/${recommendedGame}`}>Comenzar actividad <HiArrowRight /></Link>
          </article>
        </section>

        <section className="dashboard-grid grid-2 section-gap">
          <article className="panel">
            <h2 className="panel-title"><span>Mi evolución</span><HiSparkles color="#705bd8" /></h2>
            <div className="insight-list">
              <div className="insight"><HiCheckCircle /><span>¡Tu práctica está haciendo que cada movimiento sea más preciso!</span></div>
              <div className="insight"><HiCheckCircle /><span>Ya completaste {model.completed} actividades terapéuticas.</span></div>
              <div className="insight"><HiCheckCircle /><span>Tu memoria y atención crecen cada vez que vuelves a intentarlo.</span></div>
            </div>
          </article>
          <article className="panel" style={{ display: 'grid', placeItems: 'center', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: 52 }}>🌟</div>
              <h2 style={{ fontSize: 28, marginBottom: 8 }}>¡Excelente trabajo!</h2>
              <p className="section-lead center-copy" style={{ marginBottom: 0 }}>Estás mejorando todos los días. Cada intento cuenta y estamos orgullosos de ti.</p>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}
