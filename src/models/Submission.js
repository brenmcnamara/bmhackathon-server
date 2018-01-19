/* @flow */

import type { Answer } from './Question';
import type { ModelStub, Pointer } from './types';

export type Submission = ModelStub<'Submission'> & {
  +answer: Answer,
  +gameRef: Pointer<'Game'>,
  +questionRef: Pointer<'Question'>,
  +userRef: Pointer<'User'>,
};
