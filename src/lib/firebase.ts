// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "habitual-harmony-am5y3",
  appId: "1:373849160259:web:fc30d88d23ce11386cf2f6",
  storageBucket: "habitual-harmony-am5y3.appspot.com",
  apiKey: "AIzaSyDwbczEeZXexQfBRVIHYVEPdvGruetABLE",
  authDomain: "habitual-harmony-am5y3.firebaseapp.com",
  messagingSenderId: "373849160259",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
