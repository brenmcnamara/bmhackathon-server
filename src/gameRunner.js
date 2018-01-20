/* @flow */

import * as FirebaseAdmin from 'firebase-admin';

import uuid from 'uuid/v4';

import type { Game } from './models/Game';
import type { Question } from './models/Question';
import type { Seconds } from './models/types';

const SECONDS = 1000;
const MINUTES = SECONDS * 60;

const questions = {};

// -----------------------------------------------------------------------------
//
// GAME RUNNER STARTS HERE
//
// -----------------------------------------------------------------------------

export default (async function gameRunner() {
  const game = buildGame();
  await genCreateGame(game);

  atTime({ minutes: 19, seconds: 5 }, game, async () => {
    console.log('CREATING QUESTION!');
    questions.FIRST = buildQuestion(
      'What will happen next?',
      ['Something Crazy!', 'Something Not Crazy!'],
      10,
    );
    await genCreateQuestion(questions.FIRST);
  });

  atTime({ minutes: 19, seconds: 10 }, game, async () => {
    console.log('MARKING CORRECT OPTION');
    await genMarkCorrectIndex(questions.FIRST, 0);
  });
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

function buildQuestion(
  query: string,
  options: Array<string>,
  timeLimit: Seconds,
): Question {
  const now = new Date();
  return {
    askAt: new Date(now.getTime() + 1000 * 2),
    correctIndex: 'UNKNOWN',
    createdAt: now,
    id: uuid(),
    isCanceled: false,
    modelType: 'Question',
    options,
    query,
    timeLimit,
    type: 'MODEL',
    updatedAt: now,
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

function genCreateQuestion(question: Question): Promise<void> {
  return Promise.resolve().then(() =>
    FirebaseAdmin.firestore()
      .collection('Question')
      .doc(question.id)
      .set(question),
  );
}

function genMarkCorrectIndex(
  question: Question,
  correctIndex: number,
): Promise<void> {
  return Promise.resolve().then(() =>
    FirebaseAdmin.firestore()
      .collection('Question')
      .doc(question.id)
      .update({ ...question, correctIndex }),
  );
}

function atTime(
  time: { minutes: number, seconds: number },
  game: Game,
  cb: () => any,
): void {
  const gameTime = game.timer.startAt;
  const now = new Date();
  const targetMillis =
    gameTime.getTime() + time.minutes * MINUTES + time.seconds * SECONDS;
  const delta = targetMillis - now.getTime();
  if (delta < 0) {
    throw Error('Setting the timer for a past time');
  }
  setTimeout(cb, delta);
}
