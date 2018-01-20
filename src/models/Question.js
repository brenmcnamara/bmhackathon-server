/* @flow */

import type { ModelStub, Seconds } from './types';

export type Question = ModelStub<'Question'> & {
  +askAt: Date,
  +correctIndex: number | 'UNKNOWN',
  +isCanceled: bool,
  +options: Array<string>,
  +query: string,
  +timeLimit: Seconds,
};
