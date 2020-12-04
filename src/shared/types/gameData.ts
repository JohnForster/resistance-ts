import { CharacterEnum, RoundNameEnum } from './enums';

// TODO formalise types, buy creating a BaseRoundData type and a BaseSecretData type

const RoundName: RoundNameEnum = {
  characterAssignment: 'characterAssignment',
  nomination: 'nomination',
  lobby: 'lobby',
  voting: 'voting',
  mission: 'mission',
  missionResult: 'missionResult',
  voteResult: 'voteResult',
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
  history: boolean[];
  rounds: [number, number][];
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
  unconfirmedPlayerNames: string[];
  // ? Probably need to add these?
  // votingRoundNumber: number;
  // missionNumber: number;
  // nextLeader: { id: string; name: string };
  //  or
  // playerOrder: string[]
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
  nominatedPlayers: { name: string; id: string }[]; // ? Should we ever be sending playerIds?
  // playersLeftToVote: string[]; //? Why is this here? Should this just be a number?
}

export interface MissionRoundSecretData {
  hasVoted: boolean;
}

export interface MissionResultData {
  roundName: typeof RoundName.missionResult;
  unconfirmedPlayerNames: string[];
  missionSucceeded: boolean;
  missionResults: {
    success: number;
    fail: number;
  };
}
export interface VotingResultData {
  roundName: typeof RoundName.voteResult;
  unconfirmedPlayerNames: string[];
  votes: { id: string; name: string; playerApproves: boolean }[]; // ? Do we need to send other player ids... ever?
  voteSucceeded: boolean;
  votesRemaining: number;
}

export interface MissionResultSecretData {
  hasConfirmed: boolean;
}

export type RoundData =
  | CharacterRoundData
  | NominationRoundData
  | VotingRoundData
  | VotingResultData
  | MissionRoundData
  | MissionResultData;

export type SecretData =
  | CharacterSecretData
  | VotingRoundSecretData
  | MissionRoundSecretData
  | MissionResultSecretData
  | {};

// TODO Store Message type here as well, and refactor Round to take a RoundName type argument only.
// TODO   Then can use RoundDataByName, SecretDataByName and MessageByName to work out types.

// export type RoundDataByName<R extends RoundData['roundName'], T = RoundData> = T extends { roundName: R } ? T : never;
export type RoundDataByName<R extends RoundName, T = RoundData> = T extends {
  roundName: R;
}
  ? T
  : never;
