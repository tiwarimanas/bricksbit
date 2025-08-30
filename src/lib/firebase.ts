// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwbczEeZXexQfBRVIHYVEPdvGruetABLE",
  authDomain: "habitual-harmony-am5y3.firebaseapp.com",
  projectId: "habitual-harmony-am5y3",
  storageBucket: "habitual-harmony-am5y3.appspot.com",
  messagingSenderId: "373849160259",
  appId: "1:373849160259:web:fc30d88d23ce11386cf2f6"
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
