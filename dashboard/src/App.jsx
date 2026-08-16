import { Navigate, Route, Routes } from 'react-router-dom'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'
import DashboardLayout from './layouts/DashboardLayout'
import GamePage from './pages/GamePage'
import HistoryPage from './pages/HistoryPage'
import LandingPage from './pages/LandingPage'
import PatientDashboard from './pages/PatientDashboard'
import TherapistDashboard from './pages/TherapistDashboard'
import { useRealtimeGames } from './hooks/useRealtimeGames'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
)

function ClinicalRoute({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>
}

export default function App() {
  const state = useRealtimeGames()

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/terapeuta" element={<TherapistDashboard {...state} />} />
      <Route path="/paciente" element={<PatientDashboard {...state} />} />
      <Route path="/dashboard" element={<Navigate to="/terapeuta" replace />} />
      <Route path="/juegos/simon" element={<ClinicalRoute><GamePage game="simon" records={state.records} /></ClinicalRoute>} />
      <Route path="/juegos/pinta" element={<ClinicalRoute><GamePage game="pinta" records={state.records} /></ClinicalRoute>} />
      <Route path="/juegos/traza" element={<ClinicalRoute><GamePage game="traza" records={state.records} /></ClinicalRoute>} />
      <Route path="/juegos/rescate" element={<ClinicalRoute><GamePage game="rescate" records={state.records} /></ClinicalRoute>} />
      <Route path="/historial" element={<ClinicalRoute><HistoryPage records={state.records} /></ClinicalRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
