import { Game } from '../models/newGame/newGame';
import User from '../models/user';

export const games: Map<string, Game> = new Map();
export const users: Map<string, User> = new Map();

export const getGame = (id: string): Game | undefined => {
  return games.get(id);
};

export const addPlayer = (gameId: string, userId: string): void => {
  const game = games.get(gameId);
  const player = users.get(userId);
  game.handleMessage({
    player,
  });
};
