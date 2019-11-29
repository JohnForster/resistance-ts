import { CharacterEnum, RoundNameEnum } from './enums';

const RoundName: RoundNameEnum = {
  characterAssignment: 'characterAssignment',
  nomination: 'nomination',
  lobby: 'lobby',
  voting: 'voting',
  mission: 'mission',
};
type RoundName = typeof RoundName[keyof RoundNameEnum];

const Character: CharacterEnum = {
  Merlin: 'merlin',
  Assassin: 'assassin',
  Percival: 'percival',
  Morgana: 'morgana',
  Mordred: 'mordred',
} as const;
type Character = typeof Character[keyof typeof Character];

export interface GameData {
  gameID: string;
  missionNumber: number;
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

export interface CharacterRoundData {
  roundName: typeof RoundName.characterAssignment;
  unconfirmedPlayerNames: string[];
}

export interface NominationRoundData {
  roundName: typeof RoundName.nomination;
  leader: string;
  playersToNominate: number;
  failsRequired: number;
}

export interface VotingRoundData {
  roundName: typeof RoundName.voting;
  nominatedPlayers: { id: string; name: string }[];
  votes?: { id: string; name: string; playerApproves: boolean }[];
  unconfirmedPlayerNames: string[];
  // ? Probably need to add these?
  // votingRoundNumber: number;
  // missionNumber: number;
  // nextLeader: { id: string; name: string };
}

export interface VotingRoundSecretData {
  playerApproves: boolean;
}

export interface CharacterSecretData {
  character?: Character;
  allegiance: 'resistance' | 'spies';
  spies?: string[];
}

export interface MissionRoundData {
  roundName: typeof RoundName.mission;
  nominatedPlayers: { name: string; id: string }[];
  unconfirmedPlayers: string[];
}

export interface MissionRoundSecretData {
  hasVoted: boolean;
}

export type RoundData = CharacterRoundData | NominationRoundData | VotingRoundData | MissionRoundData;

export type SecretData = CharacterSecretData | VotingRoundSecretData | MissionRoundSecretData;

// export type RoundDataByName<R extends RoundData['roundName'], T = RoundData> = T extends { roundName: R } ? T : never;
export type RoundDataByName<R extends RoundName, T = RoundData> = T extends { roundName: R } ? T : never;
