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
  | 'gameUpdateMessage'
  | 'endGame'
  | 'returnToMainScreen'
  | 'cancelGame';

// TODO ? 23/12/10 Move createGame and joinGame into message type.

interface EventTemplate {
  event: EventType;
  data: unknown;
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

interface EndGameEvent extends EventTemplate {
  event: 'endGame';
  data: {};
}
interface ClientMessageEvent extends EventTemplate {
  event: 'clientMessage';
  data: Message;
}

interface GameUpdateMessageEvent extends EventTemplate {
  event: 'gameUpdateMessage';
  data: GameData<RoundName>;
}

interface ReturnToMainScreenEvent extends EventTemplate {
  event: 'returnToMainScreen';
  data: undefined;
}

interface CancelGameEvent extends EventTemplate {
  event: 'cancelGame';
  data: {
    playerID: string;
  };
}

export type IOEvent =
  | ErrorEvent
  | PlayerDataEvent
  | CreateEvent
  | JoinEvent
  | ClientMessageEvent
  | GameUpdateMessageEvent
  | EndGameEvent
  | ReturnToMainScreenEvent
  | CancelGameEvent;

export type EventByName<E extends EventType, T = IOEvent> = T extends {
  event: E;
}
  ? T
  : never;

export type DataByEventName<T extends EventType> = EventByName<T>['data'];

export type Callback<T extends IOEvent> = (data: T['data']) => void;

export type Callbacks = {
  [E in EventType]?: ((data: DataByEventName<E>) => void)[];
};
