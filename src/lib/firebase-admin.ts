import * as admin from 'firebase-admin';

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      projectId: projectId,
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error);
    // This will prevent the app from crashing if initialization fails.
    // However, Firestore and Auth will not work.
  }
}

let db: admin.firestore.Firestore;
let auth: admin.auth.Auth;

if (admin.apps.length > 0) {
    db = admin.firestore();
    auth = admin.auth();
} else {
    // In a scenario where admin app fails to initialize,
    // we can assign mock objects or throw a more specific error.
    // For now, we'll log the error and the app might not function correctly.
    console.error("Firebase Admin SDK is not initialized.");
    // @ts-ignore
    db = {}; 
    // @ts-ignore
    auth = {};
}

export { db, auth };
