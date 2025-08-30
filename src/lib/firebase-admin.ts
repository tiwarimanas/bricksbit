import * as admin from 'firebase-admin';

const firebaseConfig = {
  "projectId": "habitual-harmony-am5y3",
  "appId": "1:373849160259:web:fc30d88d23ce11386cf2f6",
  "storageBucket": "habitual-harmony-am5y3.firebasestorage.app",
  "apiKey": "AIzaSyDwbczEeZXexQfBRVIHYVEPdvGruetABLE",
  "authDomain": "habitual-harmony-am5y3.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "373849160259"
};

function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        projectId: firebaseConfig.projectId,
      });
    } catch (error: any) {
      console.error('Firebase admin initialization error', error);
    }
  }
}

export function getDb() {
  initializeFirebaseAdmin();
  return admin.firestore();
}

export function getAuth() {
  initializeFirebaseAdmin();
  return admin.auth();
}
