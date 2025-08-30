import * as admin from 'firebase-admin';

// This check prevents the server-side code from being bundled in the browser.
if (typeof window !== 'undefined') {
  throw new Error(
    'firebase-admin cannot be imported in the browser. Use the client-side firebase.ts instead.'
  );
}

let app: admin.app.App;

function getFirebaseAdminApp() {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  // Initialize without explicit credentials.
  // The Firebase Admin SDK will automatically look for credentials
  // in the server environment.
  return admin.initializeApp();
}

export function getDb() {
  if (!app) {
    app = getFirebaseAdminApp();
  }
  return admin.firestore(app);
}

export function getAuth() {
  if (!app) {
    app = getFirebaseAdminApp();
  }
  return admin.auth(app);
}
