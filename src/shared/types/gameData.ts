// TODO 23/12/2020 split this file up

export type RoundName =
  | 'lobby'
  | 'character'
  | 'nomination'
  | 'voting'
  | 'votingResult'
  | 'mission'
  | 'missionResult';

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
  // votingRoundNumber: number;
  // missionNumber: number;
  // nextLeader: { id: string; name: string };
  //  or
  // playerOrder: string[]
};

export type MissionRoundPublicData = {
  nominatedPlayers: { name: string; id: string }[]; // ? Should we ever be sending playerIds?
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

export type PublicData =
  | LobbyRoundPublicData
  | CharacterRoundPublicData
  | NominationRoundPublicData
  | VotingRoundPublicData
  | VotingResultPublicData
  | MissionRoundPublicData
  | MissionResultPublicData;

// ? 23/12/2020 Do the secret datas need a roundName as well?
export type LobbyRoundSecretData = {};
export type CharacterRoundSecretData = {
  // character?: Character
  allegiance: 'resistance' | 'spies';
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
  hasVoted: boolean;
  // 23/12/20 Include vote in secret data?
};
export type MissionResultSecretData = {
  hasConfirmed: boolean;
};

export type SecretData =
  | LobbyRoundSecretData
  | CharacterRoundPublicData
  | NominationRoundSecretData
  | VotingRoundSecretData
  | VotingResultSecretData
  | MissionRoundSecretData
  | MissionResultSecretData;

export type RoundData =
  | {
      roundName: 'lobby';
      public: LobbyRoundPublicData;
      secret: LobbyRoundSecretData;
    }
  | {
      roundName: 'character';
      public: CharacterRoundPublicData;
      secret: CharacterRoundSecretData;
    }
  | {
      roundName: 'nomination';
      public: NominationRoundPublicData;
      secret: NominationRoundSecretData;
    }
  | {
      roundName: 'voting';
      public: VotingRoundPublicData;
      secret: VotingRoundSecretData;
    }
  | {
      roundName: 'votingResult';
      public: VotingResultPublicData;
      secret: VotingResultSecretData;
    }
  | {
      roundName: 'mission';
      public: MissionRoundPublicData;
      secret: MissionRoundSecretData;
    }
  | {
      roundName: 'missionResult';
      public: MissionResultPublicData;
      secret: MissionResultSecretData;
    };

export type GameData<R extends RoundName = RoundName> = {
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
  roundData: PublicDataByName<R>;
  secretData?: SecretDataByName<R>;
  rounds: [number, number][];
};

type RoundDataByName<R extends RoundName, T = RoundData> = T extends {
  roundName: R;
}
  ? T
  : never;

export type PublicDataByName<R extends RoundName> = RoundDataByName<
  R
>['public'];

export type SecretDataByName<R extends RoundName> = RoundDataByName<
  R
>['secret'];
