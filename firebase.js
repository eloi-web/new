import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDA1oonly5aQv0NPPna32lJli3P2GVPzHs",
  authDomain: "gba-marketplace.firebaseapp.com",
  projectId: "gba-marketplace",
  storageBucket: "gba-marketplace.firebasestorage.app",
  messagingSenderId: "110246782047",
  appId: "1:110246782047:web:ca126e8b6466395833e7ea",
  measurementId: "G-SSS7TFDC83"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  collection,
  addDoc
};