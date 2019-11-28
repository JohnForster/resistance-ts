import { RoundNameEnum, EventTypeEnum, CharacterEnum } from '../../shared/types/enums';

export const RoundName: RoundNameEnum = {
  characterAssignment: 'characterAssignment',
  nomination: 'nomination',
  lobby: 'lobby',
  voting: 'voting',
};

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
} as const;

export const Character: CharacterEnum = {
  Merlin: 'merlin',
  Assassin: 'assassin',
  Percival: 'percival',
  Morgana: 'morgana',
  Mordred: 'mordred',
} as const;
