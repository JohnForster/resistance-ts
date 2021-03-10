import { WSEvent } from '@shared/types/eventTypes';
import { v4 as uuidv4 } from 'uuid';
import { Socket } from 'socket.io';

export type User = {
  // TODO Split into public and private IDs
  id: string;
  gameID: string | null;
  name: string | null;
  socket: Socket; //  ? Store as a socketID and keep a map of Sockets?
};

export const createUser = (socket: Socket): User => ({
  id: uuidv4(),
  gameID: '',
  name: '',
  socket,
});

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
