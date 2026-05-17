/* eslint-disable @typescript-eslint/no-require-imports */
const admin = require('firebase-admin');
const crypto = require('crypto');
const fs = require('fs');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey-JPN.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// The person data you provided
const personData = {
  ic_number: "011226101829",
  full_name: "JAIND RAAJ SINGH A/L RAJINDER SINGH",
  date_of_birth: "2001-12-26",
  phone_registered: "1111890138",
  add1: "186 JALAN SS 14",
  add2: "47500, Subang Jaya",
  postcode: "47500",
  state: "Selangor",
  ic_photo: "\\xffd8ffe000104a464946",
  photo_pattern: "ABC123",
};

async function addSinglePerson() {
  try {
    // 1. Generate the same Deterministic Hash ID used in your migration script
    const hashedID = crypto
      .createHash('sha256')
      .update(personData.ic_number)
      .digest('hex');

    console.log(`Generating secure ID for ${personData.ic_number}...`);
    console.log(`Hash ID: ${hashedID}`);

    // 2. Insert into the jpn_citizens collection
    await db.collection('jpn_citizens').doc(hashedID).set(personData);

    console.log(`Successfully added ${personData.full_name} to JPN database!`);
    process.exit(0);
  } catch (error) {
    console.error("Error adding person:", error);
    process.exit(1);
  }
}

addSinglePerson();