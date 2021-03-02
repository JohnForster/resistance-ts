import { Message } from './messages';
import { GameData, RoundName } from './gameData';
import { PlayerData } from './playerData';

export type EventType =
  | 'open'
  | 'close'
  | 'error'
  | 'createGame'
  | 'joinGame'
  | 'clientMessage'
  | 'playerData'
  | 'serverMessage';

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

interface ClientMessageEvent extends EventTemplate {
  event: 'clientMessage';
  data: Message;
}

interface ServerMessageEvent extends EventTemplate {
  event: 'serverMessage';
  data: GameData<RoundName>;
}

export type WSEvent =
  | CreateEvent
  | JoinEvent
  | ClientMessageEvent
  | ServerMessageEvent
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
