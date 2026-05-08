import * as admin from 'firebase-admin';
import fs from 'fs';
import crypto from 'crypto';

function generateHashID(identifier) {
  return crypto.createHash('sha256').update(identifier).digest('hex');
}

let jpnApp;
let jpnDb;

function initializeJPN() {
  if (!jpnApp) {
    const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey-JPN.json', 'utf8'));
    jpnApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    }, 'jpn-api-app');
    jpnDb = admin.app('jpn-api-app').firestore();
  }
  return jpnDb;
}

const JPN_CITIZENS_COLLECTION = "jpn_citizens";

async function lookupJPNIdentity(idNum) {
  const db = initializeJPN();
  if (!idNum) return null;

  // Hash the incoming ID to match the Hashed Document IDs
  const hashedID = generateHashID(idNum);

  // Look up the citizen document using the hashed ID
  const docRef = db.collection(JPN_CITIZENS_COLLECTION).doc(hashedID);
  const docSnapshot = await docRef.get();

  if (!docSnapshot.exists) {
    return null;
  }

  return docSnapshot.data();
}

export { lookupJPNIdentity };