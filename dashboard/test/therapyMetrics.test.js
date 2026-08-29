import test from 'node:test'
import assert from 'node:assert/strict'
import { buildTherapyModel } from '../src/utils/therapyMetrics.js'

const record = (game, timestamp, extra = {}) => ({ game, timestamp, durationSeconds: 30, resultado: 'gano', ...extra })

test('el mejor tiempo solo considera partidas ganadas', () => {
  const model = buildTherapyModel([
    record('traza', 1, { durationSeconds: 5, resultado: 'perdio' }),
    record('traza', 2, { durationSeconds: 40 }),
    record('traza', 3, { durationSeconds: 32 }),
  ])
  assert.equal(model.stats.traza.best, 32)
  assert.equal(model.stats.traza.hasWinningTime, true)
})

test('no inventa un récord si todavía no hay victorias', () => {
  const model = buildTherapyModel([record('rescate', 1, { durationSeconds: 4, resultado: 'perdio' })])
  assert.equal(model.stats.rescate.best, 0)
  assert.equal(model.stats.rescate.hasWinningTime, false)
})

test('el progreso depende del desempeño y cambia con una partida nueva', () => {
  const initial = buildTherapyModel([record('simon', 1, { score: 2, resultado: 'puntaje 2' })])
  const updated = buildTherapyModel([
    record('simon', 1, { score: 2, resultado: 'puntaje 2' }),
    record('simon', 2, { score: 7, resultado: 'puntaje 7' }),
  ])
  assert.notEqual(initial.stats.simon.progress, updated.stats.simon.progress)
  assert.notDeepEqual(initial.indicators.map(({ value }) => value), updated.indicators.map(({ value }) => value))
})
