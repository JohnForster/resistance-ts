import { EventTypeEnum } from '../../shared/types/enums';

export const EventType: EventTypeEnum = {
  confirm: 'confirm',
  beginGame: 'beginGame',
  createGame: 'createGame',
  joinGame: 'joinGame',
  message: 'clientMessage',
  close: 'close',
  open: 'open',
  error: 'error',
  playerData: 'playerData',
  gameUpdate: 'gameUpdate',
  nominate: 'nominate',
  vote: 'vote',
  mission: 'mission',
  continue: 'continue',
} as const;
