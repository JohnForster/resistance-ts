import { Message } from './messages';
import { GameData } from './gameData';
import { PlayerData } from './playerData';

export type EventType =
  | 'open'
  | 'close'
  | 'error'
  | 'createGame'
  | 'joinGame'
  | 'message'
  | 'playerData'
  | 'outgoingMessage';

// TODO ? 23/12/10 Move createGame and joinGame into message type.

interface EventTemplate {
  event: EventType;
  data: unknown;
}

interface CloseEvent extends EventTemplate {
  event: 'close';
  data: null; // TBD
}

interface OpenEvent extends EventTemplate {
  event: 'open';
  data: null; // TBD
}

interface ErrorEvent extends EventTemplate {
  event: 'error';
  data: string;
}

interface CreateEvent extends EventTemplate {
  event: 'createGame';
  data: {
    hostID: string;
  };
}

interface PlayerDataEvent extends EventTemplate {
  event: 'playerData';
  data: PlayerData;
}

interface JoinEvent extends EventTemplate {
  event: 'joinGame';
  data: {
    gameID: string;
  };
}

interface IncomingMessageEvent extends EventTemplate {
  event: 'message';
  data: Message;
}

interface OutgoingMessageEvent extends EventTemplate {
  event: 'outgoingMessage';
  data: GameData;
}

export type WSEvent =
  | CreateEvent
  | JoinEvent
  | IncomingMessageEvent
  | OutgoingMessageEvent
  | CloseEvent
  | OpenEvent
  | ErrorEvent
  | JoinEvent
  | PlayerDataEvent;

export type EventByName<E extends EventType, T = WSEvent> = T extends {
  event: E;
}
  ? T
  : never;

export type DataByEventName<T extends EventType> = EventByName<T>['data'];

export type Callback<T extends WSEvent> = (data: T['data']) => void;

export type Callbacks = {
  [E in WSEvent['event']]?: ((data: DataByEventName<E>) => void)[];
};
