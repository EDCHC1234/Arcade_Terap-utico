import { useMemo, useState } from 'react'
import { Paper, Stack, TextField, Typography } from '@mui/material'
import GameTable from '../components/GameTable'

const comparators = { fecha: (a, b) => b.timestamp - a.timestamp, juego: (a, b) => a.game.localeCompare(b.game), duracion: (a, b) => b.durationSeconds - a.durationSeconds }
export default function HistoryPage({ records = [] }) {
  const [query, setQuery] = useState(''); const [sort, setSort] = useState('fecha')
  const filtered = useMemo(() => records.filter((item) => `${item.game} ${item.resultado} ${item.fecha} ${item.hora}`.toLowerCase().includes(query.toLowerCase())).sort(comparators[sort]), [records, query, sort])
  return <><Typography variant="h4">Historial general</Typography><Typography color="text.secondary" sx={{ mb: 3 }}>Consulta y compara todas las partidas en un solo lugar.</Typography><Paper sx={{ p: { xs: 2, sm: 2.5 } }}><Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 2.5 }}><TextField fullWidth size="small" label="Buscar" placeholder="Juego, resultado, fecha..." value={query} onChange={(e) => setQuery(e.target.value)} /><TextField select size="small" label="Ordenar por" value={sort} onChange={(e) => setSort(e.target.value)} sx={{ minWidth: 180 }} SelectProps={{ native: true }}><option value="fecha">Fecha</option><option value="juego">Juego</option><option value="duracion">Duración</option></TextField></Stack><GameTable records={filtered} showGame /></Paper></>
}
