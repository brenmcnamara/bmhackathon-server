/* eslint-disable no-console */

/**
 * NOTE: This file is not transformed via babel. Must use
 * syntax this works with the runnning version of node.
 */

const FirebaseAdmin = require('firebase-admin');

const chalk = require('chalk');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const GAME_ID = "DEMO_GAME";

console.log('Configuring environment variables...');
dotenv.config();

console.log('Configuring Firebase Admin...');
const serviceCertFilename = path.join(
  __dirname,
  '../firebase-service-cert.json',
);
const serviceCertSerialized = fs.readFileSync(serviceCertFilename).toString();
const serviceCert = JSON.parse(serviceCertSerialized);

FirebaseAdmin.initializeApp({
  credential: FirebaseAdmin.credential.cert(serviceCert),
  databaseURL: process.env.FIREBASE_DB_URL,
});

console.log(chalk.green('Starting deletion process...'));

FirebaseAdmin.firestore()
  .collection('Submisssion')
  .where('gameRef.refID', '==', GAME_ID)
  .get()
  .then(snapshot => {
    const submissions = getData(snapshot);
    const batch = FirebaseAdmin.firestore().batch();
    for (let submission of submissions) {
      const ref = FirebaseAdmin.firestore()
        .collection('Submission')
        .doc(submission.id);
      batch.delete(ref);
    }
    return batch.commit();
  })
  .then(() => {
    return FirebaseAdmin.firestore()
      .collection('Question')
      .where('gameRef.refID', '==', GAME_ID)
      .get();
  })
  .then(snapshot => {
    const questions = getData(snapshot);
    const batch = FirebaseAdmin.firestore().batch();
    for (let question of questions) {
      const ref = FirebaseAdmin.firestore()
        .collection('Question')
        .doc(question.id);
      batch.delete(ref);
    }
    return batch.commit();
  })
  .then(() => {
    return FirebaseAdmin.firestore()
      .collection('Game')
      .doc(GAME_ID)
      .delete();
  });

function getData(snapshot) {
  return snapshot.docs.filter(doc => doc.exists).map(doc => doc.data());
}
