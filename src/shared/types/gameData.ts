// ! should not be using things from server in shared
export interface GameData {
  gameID: string;
  round: number;
  stage: RoundName;
  hostName: string;
  isHost: boolean;
  leaderName: string;
  isLeader: boolean;
  playerID: string;
  players: {
    name: string;
    id: string;
  }[];
  roundData: RoundData;
  secretData?: SecretData;
}

export const enum Character {
  Merlin = 'merlin',
  Assassin = 'assassin',
  Percival = 'percival',
  Morgana = 'morgana',
  Mordred = 'mordred',
}

export const enum RoundName {
  characterAssignment = 'characterAssignment',
  nomination = 'nomination',
  lobby = 'lobby',
  voting = 'voting',
}

export type RoundData = CharacterRoundData | NominationRoundData;

export type SecretData = CharacterSecretData;

export interface CharacterRoundData {
  unconfirmedPlayerNames: string[];
}

export interface NominationRoundData {
  leader: string;
  playersToNominate: number;
  failsRequired: number;
}

export interface VotingRoundData {}

export interface CharacterSecretData {
  character?: Character;
  allegiance: 'resistance' | 'spies';
  spies?: string[];
}

// export type RoundDataByName<R extends RoundData['roundName'], T = RoundData> = T extends { roundName: R } ? T : never;
