/* @flow */

/* eslint-disable no-console */

import * as FirebaseAdmin from 'firebase-admin';

import chalk from 'chalk';
import uuid from 'uuid/v4';

import type { Game } from './models/Game';
import type { Question } from './models/Question';
import type { Seconds } from './models/types';

const GAME_ID = 'DEMO_GAME';
const QUESTION_DELAY = 1;
const QUESTION_TIME = 8;
const QUESTION_POINTS = 5000;

const questions = {};

// -----------------------------------------------------------------------------
//
// GAME RUNNER STARTS HERE
//
// -----------------------------------------------------------------------------

export default (async function gameRunner() {
  console.log(chalk.green('Initializing. This may take a moment...'));
  await initialize();

  console.log(chalk.green('Generating a game...'));
  const game = buildGame();
  await genCreateGame(game);

  questions.FIRST = buildQuestion(
    'Who is the only foreign player to have been permanently appointed captain at Bayern?',
    ['Bixenta Lizarazu', 'Mark van Bommel', 'Niko Kovac', 'Robert Kovac'],
    QUESTION_POINTS,
    QUESTION_TIME,
  );
  await genCreateQuestion(questions.FIRST);
  await genMarkCorrectIndex(questions.FIRST, 1);

  await waitForSeconds(QUESTION_DELAY + QUESTION_TIME);
  questions.SECOND = buildQuestion(
    "Which one of these former Bayern players never won the Balon d'Or?",
    [
      'Gerd Muller',
      'Paul Breitner',
      'Karl-Heinz Rummenigge',
      'Franz Bechenbauer',
    ],
    QUESTION_POINTS,
    QUESTION_TIME,
  );
  await genCreateQuestion(questions.SECOND);
  await genMarkCorrectIndex(questions.SECOND, 1);

  await waitForSeconds(QUESTION_DELAY + QUESTION_TIME);
  questions.THIRD = buildQuestion(
    'How many times did Oliver Kahn represent the German national team?',
    ['86', '105', '72', '97'],
    QUESTION_POINTS,
    QUESTION_TIME,
  );
  await genCreateQuestion(questions.THIRD);
  await genMarkCorrectIndex(questions.THIRD, 0);

  await waitForSeconds(QUESTION_DELAY + QUESTION_TIME);
  questions.FOURTH = buildQuestion(
    "Who is the youngest player to play for 'Die Bayern'?",
    [
      'Mehmet Scholl',
      'Bastian Schweinsteiger',
      'Pierre-Emil Hojbjerg',
      'David Alaba',
    ],
    QUESTION_POINTS,
    QUESTION_TIME,
  );
  await genCreateQuestion(questions.FOURTH);
  await genMarkCorrectIndex(questions.FOURTH, 2);

  await waitForSeconds(QUESTION_DELAY + QUESTION_TIME);
  questions.FIFTH = buildQuestion(
    'Which one of these players made the most appearances for Manchester City?',
    [
      'Michael Tarnat',
      'Daniel van Buyten',
      'Jerome Boateng',
      'Roque Santa Cruz',
    ],
    QUESTION_POINTS,
    QUESTION_TIME,
  );
  await genCreateQuestion(questions.FIFTH);
  await genMarkCorrectIndex(questions.FIFTH, 0);

  await waitForSeconds(QUESTION_TIME + QUESTION_DELAY);
  questions.SIXTH = buildQuestion(
    'How many times have Bayern won the Bundesliga?',
    ['23', '21', '20', '22'],
    QUESTION_POINTS,
    QUESTION_TIME,
  );
  await genCreateQuestion(questions.SIXTH);
  await genMarkCorrectIndex(questions.SIXTH, 1);

  await waitForSeconds(QUESTION_TIME + QUESTION_DELAY);
  console.log(chalk.green('Ending game...'));
  await genEndGame(game);
});

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

function initialize(): Promise<void> {
  return (
    Promise.resolve()
      // Delete all existing questions for this game.
      .then(() => {
        return FirebaseAdmin.firestore()
          .collection('Question')
          .where('gameRef.refID', '==', GAME_ID)
          .get();
      })
      .then(snapshot => {
        const batch = FirebaseAdmin.firestore().batch();
        snapshot.docs.forEach(doc => {
          if (!doc.exists) {
            return;
          }
          const question = doc.data();
          const ref = FirebaseAdmin.firestore()
            .collection('Question')
            .doc(question.id);
          batch.delete(ref);
        });
        return batch.commit();
      })
      // Delete submissions
      .then(() => {
        return FirebaseAdmin.firestore()
          .collection('Submission')
          .where('gameRef.refID', '==', GAME_ID)
          .get();
      })
      .then(snapshot => {
        const batch = FirebaseAdmin.firestore().batch();
        snapshot.docs.forEach(doc => {
          if (!doc.exists) {
            return;
          }
          const submission = doc.data();
          const ref = FirebaseAdmin.firestore()
            .collection('Submission')
            .doc(submission.id);
          batch.delete(ref);
        });
        return batch.commit();
      })
      // Delete the game
      .then(() => {
        return FirebaseAdmin.firestore()
          .collection('Game')
          .doc(GAME_ID)
          .delete();
      })
  );
}

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
    status: 'IN_PROGRESS',
    timer: {
      type: 'HALF_TIME',
    },
    type: 'MODEL',
    updatedAt: new Date(),
  };
}

function waitForSeconds(timeSeconds: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, timeSeconds * 1000);
  });
}

function buildQuestion(
  query: string,
  options: Array<string>,
  maxPointValue: number,
  timeLimit: Seconds,
): Question {
  const now = new Date();
  return {
    askAt: new Date(now.getTime() + 1000 * QUESTION_DELAY),
    correctIndex: 'UNKNOWN',
    createdAt: now,
    gameRef: {
      pointerType: 'Game',
      refID: GAME_ID,
      type: 'POINTER',
    },
    id: uuid(),
    isCanceled: false,
    maxPointValue,
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

function genEndGame(game: Game): Promise<any> {
  return Promise.resolve().then(() => {
    const now = new Date();
    return FirebaseAdmin.firestore()
      .collection('Game')
      .doc(game.id)
      .update({ ...game, status: 'COMPLETE_AND_PENDING', updatedAt: now });
  });
}
