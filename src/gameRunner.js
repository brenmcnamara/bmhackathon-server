/* @flow */

import * as FirebaseAdmin from 'firebase-admin';

import type { Game } from './models/Game';

export default (async function gameRunner() {
  const game = buildGame();
  await genCreateGame(game);
});

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

function buildGame(): Game {
  return {
    away: 'BARCELONA',
    awayScore: 0,
    createdAt: new Date(),
    gameStartAt: new Date(Date.now() - 1000 * 60 * 22),
    id: 'DEMO_GAME',
    home: 'BAYERN_MUNICH',
    homeScore: 1,
    modelType: 'Game',
    status: { type: 'IN_PROGRESS' },
    timer: {
      type: 'FIRST_HALF',
      startAt: new Date(Date.now() - 1000 * 60 * 19),
    },
    type: 'MODEL',
    updatedAt: new Date(),
  };
}

function genCreateGame(game: Game): Promise<void> {
  return Promise.resolve().then(() =>
    FirebaseAdmin.firestore()
      .collection('Game')
      .doc(game.id)
      .set(game),
  );
}
