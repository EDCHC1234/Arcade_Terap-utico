import { onValue, ref } from 'firebase/database'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, database, firebaseConfigured } from '../firebase/firebase'
import { GAMES, normalizeRecords } from '../utils/gameData'

export function listenToGames(onData, onError) {
  if (!firebaseConfigured) { onError(new Error('Falta configurar Firebase en el archivo .env')); return () => {} }
  const current = new Map()
  const subscriptions = []
  let stopped = false
  const subscribe = () => Object.entries(GAMES).forEach(([game, { paths }]) => paths.forEach((path) => {
    subscriptions.push(onValue(ref(database, path), (snapshot) => {
      current.set(path, normalizeRecords(game, path, snapshot.val()))
      onData([...current.values()].flat().sort((a, b) => b.timestamp - a.timestamp))
    }, onError))
  }))
  const email = import.meta.env.VITE_FIREBASE_EMAIL
  const password = import.meta.env.VITE_FIREBASE_PASSWORD
  if (email && password) signInWithEmailAndPassword(auth, email, password).then(() => { if (!stopped) subscribe() }).catch((error) => { if (!stopped) onError(error) })
  else subscribe()
  return () => { stopped = true; subscriptions.forEach((unsubscribe) => unsubscribe()) }
}
