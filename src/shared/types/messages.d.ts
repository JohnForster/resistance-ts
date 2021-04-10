// TODO add discriminants to all messages
// TODO PlayerData event?

import { Character, GameOverSecretData } from './gameData';

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
        characters: { [key in Exclude<Character, 'Assassin'>]: boolean };
      }
    // | {
    //     type: 'reorder';
    //     playerID: string;
    //     newOrder: string[];
    //   };
  );

type ContinueMessage = BaseMessage & {
  type: 'continue';
  confirm: true;
};

export type CharacterMessage = ContinueMessage;

export type NominationMessage = BaseMessage & {
  type: 'nominatePlayers';
  nominatedPlayerIDs: string[];
};

export type VotingMessage = BaseMessage & {
  type: 'vote';
  playerApproves: boolean;
};

export type VotingResultMessage = ContinueMessage;

export type MissionRoundMessage = BaseMessage & {
  type: 'mission';
  succeedMission: boolean;
};

export type MissionResultMessage = ContinueMessage;

export type AssassinationMessage = BaseMessage & {
  type: 'assassination';
  targetID: string;
};

export type GameOverMessage = ContinueMessage;

// TODO Rename message?
export type Message =
  | LobbyMessage
  | CharacterMessage
  | NominationMessage
  | VotingMessage
  | VotingResultMessage
  | MissionRoundMessage
  | MissionResultMessage
  | AssassinationMessage
  | GameOverMessage;
