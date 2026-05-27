import admin from 'firebase-admin';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

const keyPath = path.join(
  process.cwd(),
  'ssm-db',
  'serviceAccountKey-SSM.json'
);

const serviceAccount = JSON.parse(
  fs.readFileSync(keyPath, 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

function generateHashID(identifier: string | number): string {
  return crypto
    .createHash('sha256')
    .update(String(identifier))
    .digest('hex');
}

async function uploadSSM(): Promise<void> {
  try {
    const rawData = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'ssm-db', 'SSM_json_encrypted.json'),
        'utf8'
      )
    );

    const ssmSchema = JSON.parse(rawData[0].ssm_schema_export);

    const companies: Record<string, any>[] =
      ssmSchema.ssm_company || [];

    const businessPeople: Record<string, any>[] =
      ssmSchema.ssm_business_person || [];

    console.log(
      `Found ${companies.length} companies and ${businessPeople.length} business person records.`
    );

    const batch = db.batch();

    companies.forEach((company: Record<string, any>) => {
      if (!company.surrogate_key) {
        console.log('Skipped company because surrogate_key is missing.');
        return;
      }

      const docRef = db
        .collection('ssm_company')
        .doc(company.surrogate_key);

      batch.set(docRef, company);
    });

    businessPeople.forEach((person: Record<string, any>) => {
      if (!person.surrogate_key) {
        console.log('Skipped business person because surrogate_key is missing.');
        return;
      }

      const docRef = db
        .collection('ssm_business_person')
        .doc(person.surrogate_key);

      batch.set(docRef, person);
    });

    await batch.commit();

    console.log(
      'Success! SSM data uploaded to Firestore with synchronized surrogate keys.'
    );
  } catch (error) {
    console.error('SSM migration failed:', error);
  }
}

uploadSSM();