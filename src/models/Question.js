/* @flow */

import type { ModelStub, Pointer, Seconds } from './types';

export type Question = ModelStub<'Question'> & {
  +askAt: Date,
  +correctIndex: number | 'UNKNOWN',
  +gameRef: Pointer<'Game'>,
  +isCanceled: bool,
  +options: Array<string>,
  +query: string,
  +timeLimit: Seconds,
};
