/* @flow */

export type Team = {|
  +displayName: string,
  +icon: *,
  +name: string,
|};

export const Teams = {
  BARCELONA: {
    displayName: 'Barcelona',
    name: 'BARCELONA',
  },

  BAYERN_MUNICH: {
    displayName: 'Bayern Munich',
    name: 'BAYERN_MUNICH',
  },
};

export type TeamName = $Keys<typeof Teams>;
