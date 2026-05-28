import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAWB5WmL-5EIJenrUoBtWcVQtGpswhAZ7Y",
  authDomain: "akuntansi-umkm-b7fca.firebaseapp.com",
  projectId: "akuntansi-umkm-b7fca",
  storageBucket: "akuntansi-umkm-b7fca.firebasestorage.app",
  messagingSenderId: "891417794516",
  appId: "1:891417794516:web:0dea665e7570a22e2d2841"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)