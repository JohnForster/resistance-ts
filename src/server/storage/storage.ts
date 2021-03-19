import { User } from '../models/user';
import { Game } from '../models/game/game';

export const storage = {
  users: new Map<string, Readonly<User>>(),
  // TODO Readonly<Game>
  games: new Map<string, Game>(),
  // TODO add socket storage and give users a socketId instead.
};
