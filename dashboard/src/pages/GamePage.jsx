import { Grid, Paper, Typography } from '@mui/material'
import { Bar, Line } from 'react-chartjs-2'
import ChartCard from '../components/ChartCard'
import GameTable from '../components/GameTable'
import StatCard from '../components/StatCard'
import { average, formatDuration, GAMES, isWin } from '../utils/gameData'

export default function GamePage({ game, records = [] }) {
  const info = GAMES[game]; const data = records.filter((r) => r?.game === game).slice().sort((a, b) => a.timestamp - b.timestamp)
  const metric = game === 'simon' ? 'score' : game === 'pinta' ? 'level' : 'durationSeconds'
  const metricLabel = game === 'simon' ? 'Puntaje' : game === 'pinta' ? 'Nivel alcanzado' : 'Duración (seg.)'
  const values = data.map((r) => Number(r[metric]) || 0)
  const labels = data.map((_, i) => `Partida ${i + 1}`)
  const chartData = { labels, datasets: [{ label: metricLabel, data: values, borderColor: info.color, backgroundColor: `${info.color}55`, fill: true, tension: .35 }] }
  const best = values.length ? Math.max(...values) : 0
  const winningTimes = data.filter((record) => isWin(record.resultado)).map((record) => Number(record.durationSeconds) || 0)
  const minimum = winningTimes.length ? Math.min(...winningTimes) : null
  const scoreValues = data.map((r) => Number(r.score) || 0)
  return <><Typography variant="h4">{info.label}</Typography><Typography color="text.secondary" sx={{ mb: 3 }}>Historial y desempeño de este juego.</Typography><Grid container spacing={2.5}><Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard title="Partidas" value={data.length} subtitle="Registros totales" icon="◎" color={info.color} /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard title="Tiempo promedio" value={formatDuration(average(data.map((r) => r.durationSeconds)))} subtitle="Por partida" icon="◷" color={info.color} /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard title={game === 'pinta' ? 'Nivel máximo' : game === 'simon' ? 'Puntaje máximo' : 'Mejor tiempo'} value={game === 'traza' || game === 'rescate' ? formatDuration(minimum) : best} subtitle={metricLabel} icon="★" color={info.color} /></Grid>{game === 'simon' ? <><Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard title="Puntaje promedio" value={average(scoreValues).toFixed(1)} subtitle="Por partida" icon="≈" color={info.color} /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard title="Puntaje mínimo" value={scoreValues.length ? Math.min(...scoreValues) : 0} subtitle="Registro más bajo" icon="↓" color={info.color} /></Grid></> : <Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard title="Resultado" value={data.filter((r) => String(r.resultado).toLowerCase().includes('gano')).length} subtitle="Partidas ganadas" icon="✓" color={info.color} /></Grid>}<Grid size={{ xs: 12, lg: 7 }}><ChartCard title={`${metricLabel} por partida`}><Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }} /></ChartCard></Grid><Grid size={{ xs: 12, lg: 5 }}><ChartCard title={`Distribución de ${metricLabel.toLowerCase()}`}><Bar data={{ ...chartData, datasets: [{ ...chartData.datasets[0], backgroundColor: `${info.color}bb` }] }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} /></ChartCard></Grid><Grid size={12}><Paper sx={{ p: 2.5 }}><Typography variant="h6" sx={{ mb: 2 }}>Tabla de partidas</Typography><GameTable records={data.slice().reverse()} /></Paper></Grid></Grid></>
}
