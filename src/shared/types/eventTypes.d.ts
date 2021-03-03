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

/* OLD EVENT TYPES - DELETE WHEN EVERYTHING IS WORKING AGAIN */

// import { GameData } from './gameData';
// import { PlayerData } from './playerData';
// import { EventTypeEnum } from './enums';

// const EventType: EventTypeEnum = {
//   confirm: 'confirm',
//   beginGame: 'beginGame',
//   createGame: 'createGame',
//   joinGame: 'joinGame',
//   message: 'clientMessage',
//   close: 'close',
//   open: 'open',
//   error: 'error',
//   playerData: 'playerData',
//   gameUpdate: 'gameUpdate',
//   nominate: 'nominate',
//   vote: 'vote',
//   mission: 'mission',
//   continue: 'continue',
// } as const;

// type EventType = typeof EventType[keyof EventTypeEnum];

// interface EventTemplate {
//   event: EventType;
//   data: unknown;
// }

// interface CloseEvent extends EventTemplate {
//   event: EventType;
//   data: null; // TBD
// }

// interface OpenEvent extends EventTemplate {
//   event: typeof EventType.open;
//   data: null; // TBD
// }

// interface CreateEvent extends EventTemplate {
//   event: typeof EventType.createGame;
//   data: {
//     hostID: string;
//   };
// }

// interface JoinEvent extends EventTemplate {
//   event: typeof EventType.joinGame;
//   data: {
//     gameID: string;
//   };
// }

// interface MessageEvent extends EventTemplate {
//   event: typeof EventType.message;
//   data: string;
// }

// interface ErrorEvent extends EventTemplate {
//   event: typeof EventType.error;
//   data: string;
// }

// interface PlayerDataEvent extends EventTemplate {
//   event: typeof EventType.playerData;
//   data: PlayerData;
// }

// interface GameUpdateEvent extends EventTemplate {
//   event: typeof EventType.gameUpdate;
//   data: GameData;
// }

// interface BeginGameEvent extends EventTemplate {
//   event: typeof EventType.beginGame;
//   data: {
//     gameID: string;
//   };
// }

// interface ConfirmEvent extends EventTemplate {
//   event: typeof EventType.confirm;
//   data: {
//     gameID: string;
//     playerID: string;
//   };
// }

// interface NominateEvent extends EventTemplate {
//   event: typeof EventType.nominate;
//   data: {
//     gameID: string;
//     playerID: string;
//     nominatedPlayerIDs: string[];
//   };
// }

// interface VoteEvent extends EventTemplate {
//   event: typeof EventType.vote;
//   data: {
//     gameID: string;
//     playerID: string;
//     playerApproves: boolean;
//   };
// }

// interface MissionEvent extends EventTemplate {
//   event: typeof EventType.mission;
//   data: {
//     gameID: string;
//     playerID: string;
//     playerVotedToSucceed: boolean;
//   };
// }

// interface ContinueEvent extends EventTemplate {
//   event: typeof EventType.continue;
//   data: {
//     gameID: string;
//     playerID: string;
//   };
// }

// export type WSEvent =
//   | CreateEvent
//   | JoinEvent
//   | MessageEvent
//   | CloseEvent
//   | OpenEvent
//   | ErrorEvent
//   | JoinEvent
//   | PlayerDataEvent
//   | GameUpdateEvent
//   | BeginGameEvent
//   | ConfirmEvent
//   | NominateEvent
//   | VoteEvent
//   | MissionEvent
//   | ContinueEvent;

// export type EventByName<E extends EventType, T = WSEvent> = T extends {
//   event: E;
// }
//   ? T
//   : never;

// export type DataByEventName<
//   T extends EventType,
//   E extends WSEvent = EventByName<T>
// > = E['data'];

// export type Callback<T extends WSEvent> = (data: T['data']) => void;

// export type Callbacks = {
//   [E in WSEvent['event']]?: ((data: EventByName<E>['data']) => void)[];
// };
