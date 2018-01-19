/* @flow */

export type ID = string;

export type Pointer<T: string> = {|
  +refID: string,
  +pointerType: T,
  +type: 'POINTER',
|};

export type ModelStub<T: string> = {
  +createdAt: Date,
  +id: string,
  +modelType: T,
  +type: 'MODEL',
  +updatedAt: Date,
};

export type JSONMap<K: string, V> = { [key: K]: V };

export type Currency = {|
  +type: string,
  +value: number,
|};
