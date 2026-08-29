import test from 'node:test'
import assert from 'node:assert/strict'
import { parseMetric } from '../src/metric.js'

const sample = {
  idMensaje: 'ESP32_001-1784845800-4',
  dispositivoId: 'ESP32_001',
  juego: 'Simon dice',
  duracion: '0.35 min',
  duracionMs: 35000,
  resultado: 'puntaje 4',
  puntaje: 4,
  fecha: '23/07/2026',
  hora: '14:30',
  timestamp: 1784845800,
}

test('normaliza una metrica de Simon Dice para Firebase', () => {
  const parsed = parseMetric(
    'arcade/ESP32_001/metricas',
    Buffer.from(JSON.stringify(sample)),
  )
  assert.equal(parsed.gamePath, 'Simondice')
  assert.equal(parsed.firebaseKey, sample.idMensaje)
  assert.equal(parsed.metric.puntaje, 4)
})

test('rechaza un dispositivo que no coincide con el topico', () => {
  assert.throws(
    () => parseMetric('arcade/OTRO/metricas', Buffer.from(JSON.stringify(sample))),
    /no coincide/,
  )
})
