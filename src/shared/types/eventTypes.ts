// I have this type structure, where the event is always a string, but the data can be anything (but is constrained by the event)

interface EventTemplate {
  event: string;
  data: any;
}

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

export interface GameJoinedEvent extends EventTemplate {
  event: 'game_joined';
  data: {
    gameID: string;
  };
}

export interface MessageEvent extends EventTemplate {
  event: 'message';
  data: string;
}
export interface GameCreatedEvent extends EventTemplate {
  event: 'game_created';
  data: {
    gameID: string;
  };
}
export interface ErrorEvent extends EventTemplate {
  event: 'error';
  data: string;
}

export interface NewPlayerEvent extends EventTemplate {
  event: 'new_player';
  data: {
    playerID: string;
  };
}

export interface UpdatePlayersEvent extends EventTemplate {
  event: 'updatePlayers';
  data: {
    gameID: string;
    playerIDs: string[];
    host: string;
  };
}

export type WSEvent =
  | CreateEvent
  | JoinEvent
  | MessageEvent
  | CloseEvent
  | OpenEvent
  | GameCreatedEvent
  | ErrorEvent
  | JoinEvent
  | GameJoinedEvent
  | NewPlayerEvent
  | UpdatePlayersEvent;

export type EventByName<E extends WSEvent['event'], T = WSEvent> = T extends { event: E } ? T : never;

export type Callback<T extends WSEvent> = (data: T['data']) => void;

export type Callbacks = {
  [E in WSEvent['event']]?: ((data: EventByName<E>['data']) => void)[];
};