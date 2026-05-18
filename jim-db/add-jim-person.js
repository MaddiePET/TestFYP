/* eslint-disable @typescript-eslint/no-require-imports */
const admin = require('firebase-admin');
const crypto = require('crypto');
const fs = require('fs');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey-JIM.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// The person data you provided
const personData = {
  "passport_no": "A62595296",
  "full_name": "ASHLEY TANG WAY YAN",
  "date_of_birth": "2003-09-09",
  "sex": "F",
  "exp_date": "2029-12-03",
  "nationality": "Malaysia",
  "country": "MYS",
  "issue_date": "2024-12-03",
  "issue_office": "PUCHONG",
  "passport_photo": "\\xcwqe23094833hisfd",
  "visa_type": "Student",
  "photo_pattern": "DEF123"
};

async function addSinglePerson() {
  try {
    // 1. Generate the same Deterministic Hash ID used in your migration script
    const hashedID = crypto
      .createHash('sha256')
      .update(personData.passport_no)
      .digest('hex');

    console.log(`Generating secure ID for ${personData.passport_no}...`);
    console.log(`Hash ID: ${hashedID}`);

    // 2. Insert into the jim_nonresidents collection
    await db.collection('jim_nonresidents').doc(hashedID).set(personData);

    console.log(`Successfully added ${personData.full_name} to JIM database!`);
    process.exit(0);
  } catch (error) {
    console.error("Error adding person:", error);
    process.exit(1);
  }
}

addSinglePerson();