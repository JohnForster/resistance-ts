import { WSEvent } from '@shared/types/eventTypes';
import { v4 as uuidv4 } from 'uuid';
import { Socket } from 'socket.io';
import { getHsl } from '../utils/getHsl';
import chalk from 'chalk';

export type User = {
  // TODO Split into public and private IDs
  id: string;
  gameID: string | null;
  name: string | null;
  socket: Socket; //  ? Store as a socketID and keep a map of Sockets?
  shortId: string;
};

export const createUser = (socket: Socket): User => {
  const id = uuidv4();
  const hsl = getHsl(id, 16);
  const shortId = `${id.slice(0, 5)}...`;
  return {
    id: uuidv4(),
    gameID: '',
    name: '',
    socket,
    shortId: chalk.hsl(...hsl)(shortId),
  };
};

export const sendPlayerData = (user: User) =>
  send(user, {
    event: 'playerData',
    data: {
      playerID: user.id,
      name: user.name,
    },
  });

export const sendError = (user: User, errorMessage: string) =>
  send(user, {
    event: 'error',
    data: errorMessage,
  });

export const send = (user: User, { event, data }: WSEvent) => {
  // ? Error handling?
  user.socket.emit(event, data);
};
