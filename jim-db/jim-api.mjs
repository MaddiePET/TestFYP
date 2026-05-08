import * as admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

function generateHashID(identifier) {
  return crypto.createHash('sha256').update(identifier).digest('hex');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let jimApp;
let jimDb;

function initializeJIM() {
  if (!jimApp) {
    const serviceAccountPath = path.join(__dirname, "serviceAccountKey-JIM.json");
    
    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, "utf8")
    );

    jimApp = admin.initializeApp(
      {
        credential: admin.credential.cert(serviceAccount),
      },
      "jim-api-app"
    );

    jimDb = admin.app("jim-api-app").firestore();
  }

  return jimDb;
}

const JIM_NONRESIDENTS_COLLECTION = "jim_nonresidents";

function getTitleFromSex(sex) {
  const normalizedSex = sex?.toLowerCase();

  if (normalizedSex === "male" || normalizedSex === "m") {
    return "Mr.";
  }

  if (normalizedSex === "female" || normalizedSex === "f") {
    return "Ms.";
  }

  return "";
}

function formatJIMFormData(data) {
  return {
    id_type: "passport",
    id_number: data.passport_no,

    title: getTitleFromSex(data.sex),
    full_name: data.full_name,
    date_of_birth: data.date_of_birth,
    sex: data.sex,

    passport_no: data.passport_no,
    nationality: data.nationality,
    country: data.country || data.nationality,

    issue_date: data.issue_date || "",
    exp_date: data.exp_date || "",
    issue_office: data.issue_office || "",
    visa_type: data.visa_type || "",
  };
}

async function lookupJIMIdentity(idNum) {
  const db = initializeJIM();

  if (!idNum) return null;

  // Hash the incoming idNum to match the database IDs
  const hashedID = generateHashID(idNum);

  // Perform direct document lookup
  const docRef = db.collection(JIM_NONRESIDENTS_COLLECTION).doc(hashedID);
  const docSnapshot = await docRef.get();

  if (!docSnapshot.exists) {
    return null;
  }

  const data = docSnapshot.data();

  return {
    source: "jim",
    identity: data,
    formData: formatJIMFormData(data),
  };
}

export { lookupJIMIdentity };