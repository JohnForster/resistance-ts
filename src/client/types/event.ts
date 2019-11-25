import { EventTypeEnum } from '../../shared/types/eventTypes';

export const EventType: EventTypeEnum = {
  confirm: 'confirm',
  beginGame: 'beginGame',
  createGame: 'createGame',
  joinGame: 'joinGame',
  message: 'message',
  close: 'close',
  open: 'open',
  error: 'error',
  playerData: 'playerData',
  gameUpdate: 'gameUpdate',
  nominate: 'nominate',
} as const;
