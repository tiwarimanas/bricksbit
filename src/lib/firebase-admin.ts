import * as admin from 'firebase-admin';

let app: admin.app.App;

function getFirebaseAdminApp() {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  // Initialize without explicit credentials.
  // Firebase Admin SDK will automatically look for credentials
  // in the server environment.
  return admin.initializeApp({
    projectId: 'habitual-harmony-am5y3',
  });
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
