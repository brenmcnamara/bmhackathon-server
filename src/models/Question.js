/* @flow */

import type { ModelStub } from './types';

export type Question = ModelStub<'Question'> & {
  +status: QuestionStatus,
};

export type QuestionStatus =
  | {|
      +isAcceptingSubmissions: bool,
      +type: 'IN_PROGRESS',
    |}
  | {|
      +correctAnswer: Answer,
      +type: 'COMPLETE',
    |};

export type Answer = number;
