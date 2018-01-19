/* @flow */

import type { ModelStub } from './types';

export type User = ModelStub<'User'> & {
  firstName: string,
  lastName: string,
};
