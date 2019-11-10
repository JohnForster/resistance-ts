import { GameData } from './gameData';
import { PlayerData } from './playerData';
interface EventTemplate {
  event: EventType;
  data: any;
}

// TODO Remove exports of individual events in favour of using EventByName<'close'> etc.
interface CloseEvent extends EventTemplate {
  event: EventType.close;
  data: null; // TBD
}

interface OpenEvent extends EventTemplate {
  event: EventType.open;
  data: null; // TBD
}

interface CreateEvent extends EventTemplate {
  event: EventType.createGame;
  data: {
    hostID: string;
  };
}

interface JoinEvent extends EventTemplate {
  event: EventType.joinGame;
  data: {
    gameID: string;
  };
}

interface MessageEvent extends EventTemplate {
  event: EventType.message;
  data: string;
}

interface ErrorEvent extends EventTemplate {
  event: EventType.error;
  data: string;
}

interface PlayerDataEvent extends EventTemplate {
  event: EventType.playerData;
  data: PlayerData;
}

interface GameUpdateEvent extends EventTemplate {
  event: EventType.gameUpdate;
  data: GameData;
}

interface BeginGameEvent extends EventTemplate {
  event: EventType.beginGame;
  data: {
    gameID: string;
  };
}

interface ConfirmEvent extends EventTemplate {
  event: EventType.confirm;
  data: {
    gameID: string;
    playerID: string;
  };
}

export enum EventType {
  confirm = 'confirm',
  beginGame = 'beginGame',
  createGame = 'createGame',
  joinGame = 'joinGame',
  message = 'message',
  close = 'close',
  open = 'open',
  error = 'error',
  playerData = 'playerData',
  gameUpdate = 'gameUpdate',
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
