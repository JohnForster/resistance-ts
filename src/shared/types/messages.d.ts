// TODO add discriminants to all messages
// TODO PlayerData event?

type BaseMessage = {
  playerID: string;
  gameID: string;
};

export type LobbyMessage = BaseMessage &
  (
    | {
        type: 'joinGame';
        playerID: string;
      }
    | {
        type: 'startGame';
        playerID: string;
      }
    // | {
    //     type: 'reorder';
    //     playerID: string;
    //     newOrder: string[];
    //   };
  );

export type CharacterMessage = BaseMessage & {
  type: 'confirmCharacter';
  confirm: true;
};

export type NominationMessage = BaseMessage & {
  type: 'nominatePlayers';
  nominatedPlayerIDs: string[];
};

export type VotingMessage = BaseMessage & {
  type: 'vote';
  playerApproves: boolean;
};

export type VotingResultMessage = BaseMessage & {
  type: 'confirmVoteResult';
  confirm: true;
};

export type MissionRoundMessage = BaseMessage & {
  type: 'mission';
  succeedMission: boolean;
};

export type MissionResultMessage = BaseMessage & {
  type: 'confirmMissionResult';
  confirm: true;
};

// TODO Rename message?
export type Message =
  | LobbyMessage
  | CharacterMessage
  | NominationMessage
  | VotingMessage
  | VotingResultMessage
  | MissionRoundMessage
  | MissionResultMessage;
