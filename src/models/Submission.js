/* @flow */

import type { ModelStub, Pointer } from './types';

export type Submission = ModelStub<'Submission'> & {
  +gameRef: Pointer<'Game'>,
  +pointValue: number,
  +predictionIndex: number,
  +questionRef: Pointer<'Question'>,
  +userRef: Pointer<'User'>,
};
