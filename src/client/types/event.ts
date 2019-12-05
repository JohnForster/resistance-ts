import { EventTypeEnum } from '../../shared/types/enums';

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
  vote: 'vote',
  mission: 'mission',
} as const;
