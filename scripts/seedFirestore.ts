import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, writeBatch, collection, getDocs } from 'firebase/firestore';
import { INITIAL_USERS, INITIAL_CURRENT_USER, INITIAL_INDICATIONS, CURRENT_USER_ID } from '../src/data/seedData';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

console.log('Connecting to Firebase project:', config.projectId);
const app = initializeApp(config);
const db = getFirestore(app);

async function seed() {
  try {
    console.log('Checking existing users in Firestore...');
    const usersSnap = await getDocs(collection(db, 'users'));
    console.log(`Found ${usersSnap.size} existing users.`);

    const batch = writeBatch(db);

    // Current user
    const meRef = doc(db, 'users', CURRENT_USER_ID);
    batch.set(meRef, INITIAL_CURRENT_USER);

    // Initial users
    for (const u of INITIAL_USERS) {
      const uRef = doc(db, 'users', u.id);
      batch.set(uRef, u);
    }

    // Indications
    for (const ind of INITIAL_INDICATIONS) {
      const docId = `${ind.fromUserId}_${ind.toUserId}`;
      const indRef = doc(db, 'indications', docId);
      batch.set(indRef, ind);
    }

    console.log('Committing batch to Firestore...');
    await batch.commit();
    console.log('SUCCESS! Seeded users and indications directly to Firestore project:', config.projectId);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding Firestore:', err);
    process.exit(1);
  }
}

seed();
