// TODO 23/12/2020 split this file up

import {
  CharacterMessage,
  GameOverMessage,
  LobbyMessage,
  MissionResultMessage,
  MissionRoundMessage,
  NominationMessage,
  VotingMessage,
  VotingResultMessage,
} from './messages';

export type RoundName =
  | 'lobby'
  | 'character'
  | 'nomination'
  | 'voting'
  | 'votingResult'
  | 'mission'
  | 'missionResult'
  | 'gameOver';

export type PlayerId = string;
export interface Nomination {
  leaderId: PlayerId;
  nominatedPlayerIds: PlayerId[];
  votes: Map<PlayerId, boolean>;
  succeeded?: boolean;
}

export interface CompletedMission {
  missionNumber: number;
  nominations: Nomination[];
  nominatedPlayerIds: PlayerId[];
  votes: {
    playerID: PlayerId;
    succeed: boolean;
  }[];
  success: boolean;
}

export type GameHistory = Record<number, CompletedMission>;

export type OngoingMission = Omit<CompletedMission, 'success'> & {
  success?: boolean;
};

export type LobbyRoundPublicData = {};

export type CharacterRoundPublicData = {
  unconfirmedPlayerNames: string[];
};

export type NominationRoundPublicData = {
  leader: string;
  playersToNominate: number;
  failsRequired: number;
};

export type VotingRoundPublicData = {
  nominatedPlayers: { id: string; name: string }[];
  unconfirmedPlayerNames: string[];
  // ? Probably need to add these?
  // votingLabel: number | string;
  // missionNumber: number;
  // nextLeader: { id: string; name: string };
  //  or
  // playerOrder: string[]
};

export type MissionRoundPublicData = {
  nominatedPlayers: { name: string; id: string }[]; // ? Should we ever be sending playerIDs?
};

export type MissionResultPublicData = {
  unconfirmedPlayerNames: string[];
  missionSucceeded: boolean;
  missionResults: {
    success: number;
    fail: number;
  };
};

export type VotingResultPublicData = {
  unconfirmedPlayerNames: string[];
  votes: { id: string; name: string; playerApproves: boolean }[]; // ? Do we need to send other player ids... ever?
  voteSucceeded: boolean;
  votesRemaining: number;
};

export type GameOverPublicData = {
  winners: 'resistance' | 'spies';
  reason: 'missions' | 'nominations';
  spies: string[];
  fullHistory: GameHistory;
  // characters?
};

export type PublicData =
  | LobbyRoundPublicData
  | CharacterRoundPublicData
  | NominationRoundPublicData
  | VotingRoundPublicData
  | VotingResultPublicData
  | MissionRoundPublicData
  | MissionResultPublicData
  | GameOverPublicData;

// ? 23/12/2020 Do the secret datas need a roundName as well?
export type LobbyRoundSecretData = {
  allegiance: null;
};
export type CharacterRoundSecretData = {
  allegiance: 'resistance' | 'spies';
  // character?: Character
  spies?: string[];
};
export type NominationRoundSecretData = {};
export type VotingRoundSecretData = {
  playerApproves: boolean;
};
export type VotingResultSecretData = {
  hasConfirmed: boolean;
};
export type MissionRoundSecretData = {
  votedToSucceed: boolean | undefined;
};
export type MissionResultSecretData = {
  hasConfirmed: boolean;
};
export type GameOverSecretData = {
  allegiance: 'resistance' | 'spies';
};

export type SecretData =
  | LobbyRoundSecretData
  | CharacterRoundPublicData
  | NominationRoundSecretData
  | VotingRoundSecretData
  | VotingResultSecretData
  | MissionRoundSecretData
  | MissionResultSecretData
  | GameOverSecretData;

export type RoundData =
  | {
      roundName: 'lobby';
      public: LobbyRoundPublicData;
      secret: LobbyRoundSecretData;
      clientMessage: LobbyMessage;
    }
  | {
      roundName: 'character';
      public: CharacterRoundPublicData;
      secret: CharacterRoundSecretData;
      clientMessage: CharacterMessage;
    }
  | {
      roundName: 'nomination';
      public: NominationRoundPublicData;
      secret: NominationRoundSecretData;
      clientMessage: NominationMessage;
    }
  | {
      roundName: 'voting';
      public: VotingRoundPublicData;
      secret: VotingRoundSecretData;
      clientMessage: VotingMessage;
    }
  | {
      roundName: 'votingResult';
      public: VotingResultPublicData;
      secret: VotingResultSecretData;
      clientMessage: VotingResultMessage;
    }
  | {
      roundName: 'mission';
      public: MissionRoundPublicData;
      secret: MissionRoundSecretData;
      clientMessage: MissionRoundMessage;
    }
  | {
      roundName: 'missionResult';
      public: MissionResultPublicData;
      secret: MissionResultSecretData;
      clientMessage: MissionResultMessage;
    }
  | {
      roundName: 'gameOver';
      public: GameOverPublicData;
      secret: GameOverSecretData;
      clientMessage: GameOverMessage;
    };

export type GameData<
  R extends RoundName = RoundName,
  P = PublicDataByName<R>,
  S = SecretDataByName<R>
> = {
  gameID: string;
  missionNumber: number;
  stage: R;
  hostName: string;
  isHost: boolean;
  leaderName: string;
  isLeader: boolean;
  playerID: string;
  players: {
    name: string;
    id: string;
  }[];
  history: boolean[];
  roundData: P;
  secretData?: S;
  rounds: [number, number][];
};

export type RoundDataByName<R extends RoundName, T = RoundData> = T extends {
  roundName: R;
}
  ? T
  : never;

export type PublicDataByName<
  R extends RoundName
> = RoundDataByName<R>['public'];

export type SecretDataByName<
  R extends RoundName
> = RoundDataByName<R>['secret'];

export type MessageByName<
  R extends RoundName
> = RoundDataByName<R>['clientMessage'];
