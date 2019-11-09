import { Character } from '../../server/data/gameRules';

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
  }[];
  roundData: RoundData;
  secretData?: SecretData;
}

export const enum RoundName {
  characterAssignment = 'characterAssignment',
  nomination = 'nomination',
  lobby = 'lobby',
}

export type RoundData = CharacterRoundData;

export type SecretData = CharacterSecretData;

export interface CharacterRoundData {
  unconfirmedPlayerNames: string[];
}

export interface CharacterSecretData {
  character?: Character;
  allegiance: 'resistance' | 'spies';
  spies?: string[];
}

// export type RoundData = NominationRoundData | { roundName: null };

// export type RoundDataByName<R extends GameData['stage'], T = RoundData> = T extends { roundName: R } ? T : never;
