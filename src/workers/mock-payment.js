/* @flow */

import * as FirebaseAdmin from 'firebase-admin';

export function initialize(): void {
  FirebaseAdmin.firestore()
    .collection('Game')
    .where('status', '==', 'COMPLETE_AND_PENDING')
    .onSnapshot(onCompleteAndPending);
}

function onCompleteAndPending(snapshot: *): void {
  const games = snapshot.docs.filter(doc => doc.exists).map(doc => doc.data());
  const batch = FirebaseAdmin.firestore().batch();

  games.forEach(game => {
    const ref = FirebaseAdmin.firestore()
      .collection('Game')
      .doc(game.id);
    const now = new Date();
    batch.update(ref, { ...game, updatedAt: now, status: 'COMPLETE_AND_PAID' });
  });

  return batch.commit();
}
