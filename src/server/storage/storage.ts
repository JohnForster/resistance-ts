import { User } from '../models/user';
import { Game } from '../models/game/game';

export const storage = {
  users: new Map<string, User>(),
  games: new Map<string, Game>(),
};
