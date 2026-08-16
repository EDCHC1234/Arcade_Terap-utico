import { Alert, CircularProgress, Grid, Paper, Stack, Typography } from '@mui/material'
import { FaTrophy } from 'react-icons/fa'
import { HiChartBar, HiClock, HiCollection } from 'react-icons/hi'
import { Bar } from 'react-chartjs-2'
import ChartCard from '../components/ChartCard'
import GameTable from '../components/GameTable'
import StatCard from '../components/StatCard'
import { average, formatDate, formatDuration, GAMES } from '../utils/gameData'

export default function OverviewPage({ records = [], error = '', loading = false }) {
  const countByGame = Object.keys(GAMES).map((game) => records.filter((record) => record.game === game).length)
  const latest = records[0]
  const bestSimon = Math.max(0, ...records.filter((record) => record.game === 'simon').map((record) => Number(record.score) || 0))
  const chart = { labels: Object.values(GAMES).map((game) => game.label), datasets: [{ label: 'Partidas', data: countByGame, backgroundColor: Object.values(GAMES).map((game) => `${game.color}bb`), borderRadius: 8 }] }

  if (loading) return <Stack alignItems="center" sx={{ pt: 12 }}><CircularProgress /></Stack>

  return <><Typography variant="h4">Panel principal</Typography><Typography color="text.secondary" sx={{ mb: 3 }}>Vista consolidada de las actividades registradas.</Typography>{error && <Alert severity="warning" sx={{ mb: 3 }}>{error}. Copia <code>.env.example</code> como <code>.env</code> y completa los datos.</Alert>}<Grid container spacing={2.5}><Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard title="Total de partidas" value={records.length} subtitle="Todos los juegos" icon={<HiCollection />} /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard title="Tiempo promedio" value={formatDuration(average(records.map((record) => record.durationSeconds)))} subtitle="Por partida" icon={<HiClock />} color="#2dd4bf" /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard title="Mejor resultado" value={bestSimon ? `${bestSimon} pts` : '—'} subtitle="Récord de Simón Dice" icon={<FaTrophy />} color="#f59e0b" /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard title="Última actividad" value={latest ? GAMES[latest.game]?.label ?? '—' : '—'} subtitle={latest ? formatDate(latest.timestamp, latest.hora) : 'Sin registros'} icon={<HiChartBar />} color="#38bdf8" /></Grid><Grid size={{ xs: 12, lg: 7 }}><ChartCard title="Partidas por juego"><Bar data={chart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }} /></ChartCard></Grid><Grid size={{ xs: 12, lg: 5 }}><Paper sx={{ p: 2.5, height: '100%' }}><Typography variant="h6" sx={{ mb: 2 }}>Actividad reciente</Typography><GameTable records={records.slice(0, 5)} showGame /></Paper></Grid></Grid></>
}
