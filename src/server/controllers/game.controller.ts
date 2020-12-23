import { Game } from '../models/newGame/newGame';
import User from '../models/user';

export const games: Map<string, Game> = new Map();
export const users: Map<string, User> = new Map();

export const getGame = (id: string): Game | undefined => {
  return games.get(id);
};

export const addPlayer = (gameID: string, userID: string): void => {
  const game = games.get(gameID);
  const player = users.get(userID);
  game.handleMessage({
    player,
  });
};
