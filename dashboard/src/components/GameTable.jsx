import { Chip, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { formatDate, formatDuration, GAMES } from '../utils/gameData'

export default function GameTable({ records = [], showGame = false }) {
  return <div className="table-scroll"><Table size="small"><TableHead><TableRow>{showGame && <TableCell>Juego</TableCell>}<TableCell>Fecha</TableCell><TableCell>Resultado</TableCell><TableCell align="right">Duración</TableCell></TableRow></TableHead><TableBody>{records.map((item) => <TableRow key={item.id} hover>{showGame && <TableCell><Chip size="small" label={GAMES[item.game]?.label ?? 'Juego'} /></TableCell>}<TableCell>{formatDate(item.timestamp, `${item.fecha || ''} ${item.hora || ''}`)}</TableCell><TableCell><Typography variant="body2">{item.resultado || '—'}</Typography></TableCell><TableCell align="right">{formatDuration(item.durationSeconds)}</TableCell></TableRow>)}{!records.length && <TableRow><TableCell colSpan={showGame ? 4 : 3} align="center" sx={{ py: 4, color: 'text.secondary' }}>No hay partidas para mostrar.</TableCell></TableRow>}</TableBody></Table></div>
}
