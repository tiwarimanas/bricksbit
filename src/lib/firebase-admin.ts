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

const projectId = firebaseConfig.projectId;

if (!admin.apps.length) {
  try {
    // In a local environment, you might need to use a service account key
    // For simplicity here, we'll rely on the projectId for initialization
    // This works in environments where default credentials are set up (like Google Cloud)
    admin.initializeApp({
      projectId: projectId,
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error);
  }
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
