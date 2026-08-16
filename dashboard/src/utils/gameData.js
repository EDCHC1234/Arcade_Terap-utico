export const GAMES = {
  simon: { label: 'Simón Dice', paths: ['Simondice'], color: '#705bd8' },
  pinta: { label: 'Pinta Feliz', paths: ['Pintafeliz'], color: '#e9780b' },
  traza: { label: 'Traza Fácil', paths: ['trazaFacil'], color: '#16853b' },
  rescate: { label: 'Rescate', paths: ['rescate'], color: '#075eb6' },
}

const finiteNumber = (value, fallback = 0) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

export const secondsFromDuration = (value) => {
  if (typeof value === 'number') return finiteNumber(value) / 1000
  const match = String(value || '').match(/(\d+)\.(\d+)\s*min/)
  return match ? Number(match[1]) * 60 + Number(match[2]) : 0
}

const legacyTimestamp = (fecha, hora) => {
  const [day, month, year] = String(fecha || '').split('/').map(Number)
  const [hours = 0, minutes = 0] = String(hora || '').split(':').map(Number)
  return year ? new Date(year, month - 1, day, hours, minutes).getTime() : 0
}

export const numberFromResult = (result) => Number(String(result || '').match(/\d+/)?.[0] || 0)

export const normalizeRecords = (game, sourcePath, value) => Object.entries(value || {}).map(([id, rawRecord]) => {
  const record = rawRecord && typeof rawRecord === 'object' ? rawRecord : {}
  const durationSeconds = record.duracionMs != null ? finiteNumber(record.duracionMs) / 1000 : secondsFromDuration(record.duracion)
  const timestamp = record.timestamp ? finiteNumber(record.timestamp) * 1000 : legacyTimestamp(record.fecha, record.hora)
  return { id: `${sourcePath}-${id}`, firebaseId: id, game, sourcePath, ...record, timestamp, durationSeconds, score: finiteNumber(record.puntaje, numberFromResult(record.resultado)), level: finiteNumber(record.nivel, numberFromResult(record.resultado)) }
})

export const formatDuration = (seconds = 0) => {
  if (seconds == null) return 'Sin victorias'
  const value = finiteNumber(seconds)
  return `${Math.floor(value / 60)}m ${String(Math.round(value % 60)).padStart(2, '0')}s`
}
export const formatDate = (timestamp, fallback = 'Sin fecha') => timestamp ? new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium', timeStyle: 'short' }).format(timestamp) : fallback
export const average = (values = []) => values.length ? values.reduce((sum, value) => sum + finiteNumber(value), 0) / values.length : 0
export const isWin = (result = '') => /\bgan(?:o|ó)\b/i.test(String(result))
