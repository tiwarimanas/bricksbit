import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwbczEeZXexQfBRVIHYVEPdvGruetABLE",
  authDomain: "habitual-harmony-am5y3.firebaseapp.com",
  projectId: "habitual-harmony-am5y3",
  storageBucket: "habitual-harmony-am5y3.appspot.com",
  messagingSenderId: "373849160259",
  appId: "1:373849160259:web:fc30d88d23ce11386cf2f6"
};

// Initialize Firebase for client-side
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
