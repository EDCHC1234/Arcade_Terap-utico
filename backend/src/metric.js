const GAME_PATHS = new Map([
  ['simondice', 'Simondice'],
  ['pintafeliz', 'Pintafeliz'],
  ['trazafacil', 'trazaFacil'],
  ['rescate', 'rescate'],
])

const requiredText = (value, field) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Campo obligatorio invalido: ${field}`)
  }
  return value.trim()
}

const finiteInteger = (value, field, { optional = false } = {}) => {
  if (optional && value == null) return undefined
  const number = Number(value)
  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`Campo numerico invalido: ${field}`)
  }
  return Math.trunc(number)
}

export function parseMetric(topic, payload) {
  const topicMatch = /^arcade\/([^/]+)\/metricas$/.exec(topic)
  if (!topicMatch) throw new Error(`Topico no permitido: ${topic}`)

  let input
  try {
    input = JSON.parse(payload.toString('utf8'))
  } catch {
    throw new Error('El payload no es JSON valido')
  }

  const idMensaje = requiredText(input.idMensaje, 'idMensaje')
  const dispositivoId = requiredText(input.dispositivoId, 'dispositivoId')
  if (dispositivoId !== topicMatch[1]) {
    throw new Error('dispositivoId no coincide con el topico')
  }

  const rawGame = requiredText(input.juego, 'juego')
  const gamePath = GAME_PATHS.get(rawGame.replace(/\s+/g, '').toLowerCase())
  if (!gamePath) throw new Error(`Juego no reconocido: ${rawGame}`)

  const timestamp = finiteInteger(input.timestamp ?? Date.now() / 1000, 'timestamp')
  const metric = {
    idMensaje,
    dispositivoId,
    juego: gamePath,
    duracion: requiredText(input.duracion, 'duracion'),
    duracionMs: finiteInteger(input.duracionMs, 'duracionMs'),
    resultado: requiredText(input.resultado, 'resultado'),
    fecha: requiredText(input.fecha, 'fecha'),
    hora: requiredText(input.hora, 'hora'),
    timestamp,
  }

  const puntaje = finiteInteger(input.puntaje, 'puntaje', { optional: true })
  const nivel = finiteInteger(input.nivel, 'nivel', { optional: true })
  if (puntaje !== undefined) metric.puntaje = puntaje
  if (nivel !== undefined) metric.nivel = nivel

  const firebaseKey = idMensaje.replace(/[.#$[\]/]/g, '_')
  return { gamePath, firebaseKey, metric }
}
