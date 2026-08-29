import { spawn } from 'node:child_process'
import { resolve } from 'node:path'

const processes = []
let stopping = false

function run(name, cwd, entry, args = []) {
  console.log(`[${name}] Iniciando...`)
  const child = spawn(process.execPath, [resolve(entry), ...args], {
    cwd: resolve(cwd),
    stdio: 'inherit',
    env: process.env,
  })
  processes.push(child)

  child.on('error', (error) => {
    console.error(`[${name}] No pudo iniciar: ${error.message}`)
    shutdown(1)
  })

  child.on('exit', (code, signal) => {
    if (stopping) return
    console.error(`[${name}] Se detuvo (${signal || `codigo ${code}`}).`)
    shutdown(code || 1)
  })
}

function shutdown(exitCode = 0) {
  if (stopping) return
  stopping = true
  for (const child of processes) {
    if (!child.killed) child.kill('SIGTERM')
  }
  setTimeout(() => process.exit(exitCode), 300)
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))

run('backend', 'backend', 'backend/src/index.js')
run('dashboard', 'dashboard', 'dashboard/node_modules/vite/bin/vite.js')
