import { GameData } from './gameData';
import { PlayerData } from './playerData';
interface EventTemplate {
  event: string;
  data: any;
}

// TODO Remove exports of individual events in favour of using EventByName<'close'> etc.
export interface CloseEvent extends EventTemplate {
  event: 'close';
  data: null; // TBD
}

export interface OpenEvent extends EventTemplate {
  event: 'open';
  data: null; // TBD
}

export interface CreateEvent extends EventTemplate {
  event: 'create_game';
  data: {
    hostID: string;
  };
}

export interface JoinEvent extends EventTemplate {
  event: 'join_game';
  data: {
    gameID: string;
  };
}

export interface MessageEvent extends EventTemplate {
  event: 'message';
  data: string;
}

export interface ErrorEvent extends EventTemplate {
  event: 'error';
  data: string;
}

export interface PlayerDataEvent extends EventTemplate {
  event: 'playerData';
  data: PlayerData;
}

export interface GameUpdateEvent extends EventTemplate {
  event: 'gameUpdate';
  data: GameData;
}

export interface BeginGameEvent extends EventTemplate {
  event: 'beginGame';
  data: {
    gameID: string;
  };
}

export interface ConfirmEvent extends EventTemplate {
  event: 'confirm';
  data: {
    gameID: string;
    playerID: string;
  };
}

export type WSEvent =
  | CreateEvent
  | JoinEvent
  | MessageEvent
  | CloseEvent
  | OpenEvent
  | ErrorEvent
  | JoinEvent
  | PlayerDataEvent
  | GameUpdateEvent
  | BeginGameEvent
  | ConfirmEvent;

export type EventByName<E extends WSEvent['event'], T = WSEvent> = T extends { event: E } ? T : never;

export type Callback<T extends WSEvent> = (data: T['data']) => void;

export type Callbacks = {
  [E in WSEvent['event']]?: ((data: EventByName<E>['data']) => void)[];
};
