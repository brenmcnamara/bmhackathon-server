/* @flow */

import type { ModelStub } from './types';
import type { TeamName } from './Team';

export type Game = ModelStub<'Game'> & {
  +away: TeamName,
  +awayScore: number,
  +gameStartAt: Date,
  +home: TeamName,
  +homeScore: number,
  +status: GameStatus,
  +timer: GameTimer,
};

export type GameStatus =
  | 'IN_PROGRESS'
  | 'NOT_YET_STARTED'
  | 'COMPLETE_AND_PENDING'
  | 'COMPELTE_AND_PAID';

export type GameTimer =
  | {|
      +startAt: Date,
      +type: 'FIRST_HALF' | 'SECOND_HALF',
    |}
  | {| +type: 'HALF_TIME' |};
