import * as admin from 'firebase-admin';

// This is a service account for a project that you have access to.
// The email is not a real email address, and the key is not a real key.
// This is a mock service account for demonstration purposes only.
const serviceAccount = {
  "type": "service_account",
  "project_id": "habitual-harmony-am5y3",
  "private_key_id": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC3\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'),
  "client_email": "firebase-adminsdk-12345@habitual-harmony-am5y3.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-12345%40habitual-harmony-am5y3.iam.gserviceaccount.com"
}

function getFirebaseAdminApp() {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    projectId: 'habitual-harmony-am5y3',
  });
}

export function getDb() {
  const app = getFirebaseAdminApp();
  return admin.firestore(app);
}

export function getAuth() {
  const app = getFirebaseAdminApp();
  return admin.auth(app);
}
