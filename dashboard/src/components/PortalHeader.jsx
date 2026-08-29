import { NavLink } from 'react-router-dom'
import { HiSparkles } from 'react-icons/hi'

export default function PortalHeader({ patient = false }) {
  return (
    <header className="portal-topbar">
      <NavLink className="brand" to="/">
        <span className="brand-mark"><HiSparkles /></span>
        <span>Arcade Terapéutico</span>
      </NavLink>
      <nav className="portal-nav" aria-label="Navegación principal">
        <NavLink to="/"><span>Inicio</span></NavLink>
        <NavLink className={({ isActive }) => isActive ? 'active' : ''} to="/terapeuta">
          Terapeuta
        </NavLink>
        <NavLink className={({ isActive }) => isActive ? 'active' : ''} to="/paciente">
          {patient ? 'Mi progreso' : 'Paciente'}
        </NavLink>
      </nav>
    </header>
  )
}
