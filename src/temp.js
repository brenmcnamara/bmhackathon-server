/* @flow */

import * as FirebaseAdmin from 'firebase-admin';

import type { Game } from '../models/Game';
import type { User } from '../models/User';

export default function initialize(): void {
  const db = FirebaseAdmin.firestore();

  db
    .collection('Game')
    .where('gameStatus', '==', 'COMPLETE_AND_PENDING')
    .onSnapshot(async snapshot => {
      const games: Array<Game> = snapshot.docs
        .filter(doc => doc.exists)
        .map(doc => doc.data());

      const allUsers: Array<User> = await FirebaseAdmin.collection('User')
        .get()
        .then(snapshot =>
          snapshot.docs.filter(doc => doc.exists).map(doc => doc.data()),
        );

      for (let game of games) {
        const allUserPoints = await calculateUserPoints(allUsers);
        // Get top 10 winners (NOTE: Could be less than 10 players).
        // Give them coins.
      }
    });
}

function calculateUserPoints(
  allUsers: Array<User>,
  game: Game,
): Promise<Array<number>> {
  return Promise.all(
    allUsers.map(user => {
      // 1. Get all the submissions from the user for this game.
      // 2. Is the submission correct? If so, increment their point values by
      //    the point values for the submission.
      // 3. Return the total point values.
      return Math.random() * 1000;
    }),
  );
}
