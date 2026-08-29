import 'dotenv/config'
import mqtt from 'mqtt'
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'
import { parseMetric } from './metric.js'

const requiredEnv = (name) => {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Falta la variable de entorno ${name}`)
  return value
}

const firebaseCredential = () => {
  const encoded = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64?.trim()
  if (!encoded) return applicationDefault()

  try {
    const serviceAccount = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'))
    return cert(serviceAccount)
  } catch {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 no contiene un JSON Base64 valido')
  }
}

const databaseURL = requiredEnv('FIREBASE_DATABASE_URL')
if (!getApps().length) {
  initializeApp({ credential: firebaseCredential(), databaseURL })
}
const database = getDatabase()

const mqttHost = requiredEnv('MQTT_HOST')
const mqttPort = Number(process.env.MQTT_PORT || 8883)
const mqttTopic = process.env.MQTT_TOPIC?.trim() || 'arcade/+/metricas'

const client = mqtt.connect({
  protocol: 'mqtts',
  host: mqttHost,
  port: mqttPort,
  username: requiredEnv('MQTT_USERNAME'),
  password: requiredEnv('MQTT_PASSWORD'),
  clientId: `arcade-backend-${process.pid}`,
  clean: true,
  connectTimeout: 10_000,
  reconnectPeriod: 2_000,
  rejectUnauthorized: true,
})

client.on('connect', () => {
  console.log(`Conectado a HiveMQ Cloud: ${mqttHost}:${mqttPort}`)
  client.subscribe(mqttTopic, { qos: 1 }, (error) => {
    if (error) console.error('No fue posible suscribirse:', error.message)
    else console.log(`Escuchando metricas en ${mqttTopic}`)
  })
})

client.on('reconnect', () => console.log('Reconectando con HiveMQ Cloud...'))
client.on('error', (error) => console.error('Error MQTT:', error.message))

client.on('message', async (topic, payload) => {
  try {
    const { gamePath, firebaseKey, metric } = parseMetric(topic, payload)
    await database.ref(`${gamePath}/${firebaseKey}`).set(metric)
    console.log(`Metrica guardada: ${gamePath}/${firebaseKey}`)
  } catch (error) {
    console.error(`Metrica rechazada [${topic}]:`, error.message)
  }
})

const shutdown = (signal) => {
  console.log(`${signal}: cerrando backend...`)
  client.end(false, {}, () => process.exit(0))
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
