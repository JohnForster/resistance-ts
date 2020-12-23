// TODO add discriminants to all messages
// TODO PlayerData event?

export type LobbyMessage =
  | {
      type: 'joinGame';
      playerID: string;
    }
  | {
      type: 'startGame';
      playerID: string;
    };
// | {
//     type: 'reorder';
//     playerID: string;
//     newOrder: string[];
//   };

export type CharacterMessage = {
  playerID: string;
};

export type NominationMessage = {
  nominatedPlayerIDs: string[];
};

export type VotingMessage = {
  playerID: string;
  playerApproves: boolean;
};

export type VotingResultMessage = {
  playerID: string;
  confirm: true;
};

export type MissionRoundMessage = {
  playerID: string;
  succeedMission: true;
};

export type MissionResultMessage = {
  playerID: string;
  confirm: boolean;
};

export type Message = { gameID: string } & (
  | LobbyMessage
  | CharacterMessage
  | NominationMessage
  | VotingMessage
  | VotingResultMessage
  | MissionRoundMessage
  | MissionResultMessage
);
