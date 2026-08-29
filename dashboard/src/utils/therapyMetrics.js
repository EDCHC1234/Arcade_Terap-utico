import { average, GAMES, isWin } from './gameData.js'

export const gameDetails = {
  simon: { skill: 'Memoria y atención', symbol: '◆' },
  pinta: { skill: 'Motricidad fina', symbol: '✦' },
  traza: { skill: 'Coordinación visomotora', symbol: '⌁' },
  rescate: { skill: 'Atención y precisión', symbol: '◎' },
}

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value))

export function sessionPerformance(record) {
  if (record.game === 'simon') return clamp((Number(record.score) || 0) / 8 * 100)
  if (record.game === 'pinta') return clamp((Number(record.level) || 0) / 3 * 100)
  const duration = clamp(Number(record.durationSeconds) || 0, 0, 180)
  if (record.game === 'traza' || record.game === 'rescate') {
    return isWin(record.resultado)
      ? clamp(100 - duration / 3, 40, 100)
      : clamp(duration / 6, 0, 30)
  }
  return 0
}

const recentWeightedAverage = (items, selector = sessionPerformance) => {
  let weight = 1
  let weightedTotal = 0
  let totalWeight = 0
  items.slice().reverse().forEach((item) => {
    weightedTotal += selector(item) * weight
    totalWeight += weight
    weight *= 0.82
  })
  return totalWeight ? weightedTotal / totalWeight : 0
}

const skillWeights = {
  'Motricidad fina': { pinta: 1, traza: 0.75, rescate: 0.3, simon: 0.1 },
  Coordinación: { traza: 1, rescate: 0.75, pinta: 0.35, simon: 0.1 },
  Memoria: { simon: 1, pinta: 0.25, traza: 0.1, rescate: 0.1 },
  Atención: { rescate: 1, simon: 0.7, traza: 0.4, pinta: 0.2 },
}

const indicatorMeta = [
  { name: 'Motricidad fina', color: '#e9780b', note: 'Precisión y control manual en Pinta Feliz y Traza Fácil.' },
  { name: 'Coordinación', color: '#16853b', note: 'Integración entre mirada y movimiento en recorridos.' },
  { name: 'Memoria', color: '#705bd8', note: 'Secuencias recordadas en Simón Dice y práctica complementaria.' },
  { name: 'Atención', color: '#075eb6', note: 'Foco sostenido, aciertos y finalización de actividades.' },
]

export function buildTherapyModel(records = []) {
  const chronological = records.slice().sort((a, b) => a.timestamp - b.timestamp)
  const byGame = Object.fromEntries(Object.keys(GAMES).map((game) => [game, chronological.filter((record) => record.game === game)]))
  const stats = Object.fromEntries(Object.entries(byGame).map(([game, items]) => {
    const wins = items.filter((item) => isWin(item.resultado)).length
    const values = items.map((item) => game === 'simon' ? Number(item.score) || 0 : game === 'pinta' ? Number(item.level) || 0 : Number(item.durationSeconds) || 0)
    const winningValues = items.filter((item) => isWin(item.resultado)).map((item) => Number(item.durationSeconds) || 0)
    const best = values.length ? ((game === 'traza' || game === 'rescate') ? (winningValues.length ? Math.min(...winningValues) : 0) : Math.max(...values)) : 0
    return [game, {
      count: items.length,
      wins,
      success: items.length ? Math.round((wins / items.length) * 100) : 0,
      average: average(values),
      best,
      hasWinningTime: winningValues.length > 0,
      progress: Math.round(recentWeightedAverage(items)),
      items,
    }]
  }))
  const totalSeconds = records.reduce((sum, record) => sum + (Number(record.durationSeconds) || 0), 0)
  const completed = records.length
  const indicators = indicatorMeta.map((meta) => {
    const relevant = chronological.filter((record) => skillWeights[meta.name][record.game])
    const value = recentWeightedAverage(relevant, (record) => {
      const relevance = skillWeights[meta.name][record.game]
      return 50 + (sessionPerformance(record) - 50) * relevance
    })
    return { ...meta, value: Math.round(value) }
  })
  const overall = completed ? Math.round(average(indicators.map((indicator) => indicator.value))) : 0
  const recentStart = Math.max(0, chronological.length - 10)
  const timeline = chronological.slice(recentStart).map((record, index) => ({ label: `S${recentStart + index + 1}`, value: Math.round(sessionPerformance(record)) }))
  return { stats, indicators, overall, totalSeconds, completed, timeline }
}
