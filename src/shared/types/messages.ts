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
  type: 'confirmCharacter';
  playerID: string;
  confirm: true;
};

export type NominationMessage = {
  type: 'nominatePlayers';
  nominatedPlayerIDs: string[];
};

export type VotingMessage = {
  type: 'vote';
  playerID: string;
  playerApproves: boolean;
};

export type VotingResultMessage = {
  type: 'confirmVoteResult';
  playerID: string;
  confirm: true;
};

export type MissionRoundMessage = {
  type: 'mission';
  playerID: string;
  succeedMission: boolean;
};

export type MissionResultMessage = {
  type: 'confirmMissionResult';
  playerID: string;
  confirm: true;
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
