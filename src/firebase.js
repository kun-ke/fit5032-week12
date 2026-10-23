import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

export const useEmulators = import.meta.env.VITE_USE_EMULATORS === 'true'

const firebaseConfig = {
  apiKey: 'AIzaSyCNAj8Qf5_jqrc006gTD4ZEQ7n1gklO71E',
  authDomain: 'yankun-library.firebaseapp.com',
  projectId: 'yankun-library',
  storageBucket: 'yankun-library.firebasestorage.app',
  messagingSenderId: '30262359287',
  appId: '1:30262359287:web:c40d7c4c279f5520b04ff2',
}

// A demo project keeps local testing separate from the real Firebase project.
if (useEmulators) {
  firebaseConfig.projectId = 'demo-yankun-library'
  firebaseConfig.apiKey = 'demo-api-key'
  firebaseConfig.authDomain = 'demo-yankun-library.firebaseapp.com'
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const functions = getFunctions(app, 'us-central1')

if (useEmulators) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
  connectFunctionsEmulator(functions, '127.0.0.1', 5001)
}
