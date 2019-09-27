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

// export interface GameJoinedEvent extends EventTemplate {
//   event: 'game_joined';
//   data: {
//     gameID: string;
//   };
// }

export interface MessageEvent extends EventTemplate {
  event: 'message';
  data: string;
}
// export interface GameCreatedEvent extends EventTemplate {
//   event: 'game_created';
//   data: {
//     gameID: string;
//   };
// }
export interface ErrorEvent extends EventTemplate {
  event: 'error';
  data: string;
}

export interface PlayerDataEvent extends EventTemplate {
  event: 'playerData';
  data: PlayerData;
}

// export interface UpdatePlayersEvent extends EventTemplate {
//   event: 'updatePlayers';
//   data: {
//     gameID: string;
//     playerIDs: string[];
//     host: string;
//   };
// }

// export interface GameInProgress extends EventTemplate {
//   event: 'gameInProgress';
//   data: {
//     gameID: string;
//     playerID: string;
//     playerIDs: string[];
//     hostID: string;
//   };
// }

export interface GameUpdateEvent extends EventTemplate {
  event: 'gameUpdate';
  data: GameData;
}

// {
//   event: 'gameUpdated',
//   data: {
//     round: 0 (lobby), 1,2,3,4,5
//     stage: 'nominate', 'nominationVote' , 'missionVote'
//     players: {name, id}[]
//     host: playerID
//     roundData: {
//     }
//   }
// }

export type WSEvent =
  | CreateEvent
  | JoinEvent
  | MessageEvent
  | CloseEvent
  | OpenEvent
  // | GameCreatedEvent
  | ErrorEvent
  | JoinEvent
  // | GameJoinedEvent
  | PlayerDataEvent
  // | UpdatePlayersEvent
  // | GameInProgress
  | GameUpdateEvent;

export type EventByName<E extends WSEvent['event'], T = WSEvent> = T extends { event: E } ? T : never;

export type Callback<T extends WSEvent> = (data: T['data']) => void;

export type Callbacks = {
  [E in WSEvent['event']]?: ((data: EventByName<E>['data']) => void)[];
};
