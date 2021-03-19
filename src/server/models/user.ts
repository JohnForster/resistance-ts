import { IOEvent } from '../../shared/types/eventTypes';
import { v4 as uuidv4 } from 'uuid';
import { Socket } from 'socket.io';
import { getHsl } from '../utils/getHsl';
import chalk from 'chalk';
import { storage } from '../storage/storage';

export type User = Readonly<{
  // TODO Split into public and private IDs
  id: string;
  gameID: string | null;
  name: string | null;
  socket: Socket; //  ? Store as a socketID and keep a map of Sockets?
  shortId: string;
}>;

export const createUser = (socket: Socket): User => {
  const id = uuidv4();
  const hsl = getHsl(id, 16);
  const shortId = `${id.slice(0, 5)}...`;
  const user = {
    id,
    gameID: '',
    name: '',
    socket,
    shortId: chalk.hsl(...hsl)(shortId),
  };
  storage.users.set(id, user);
  return user;
};

export const getUser = (userId: string) => {
  return storage.users.get(userId);
};

export const updateUser = (userId: string, update: Partial<User>) => {
  const oldUser = getUser(userId);
  if (!oldUser) {
    throw new Error(`No user found with id ${userId}`);
  }
  const newUser = { ...oldUser, ...update };
  storage.users.set(oldUser.id, newUser);
  return newUser;
};

export const sendPlayerData = (userId: string) => {
  const user = getUser(userId);
  send(userId, {
    event: 'playerData',
    data: {
      playerID: userId,
      name: user.name,
    },
  });
};

export const sendError = (userId: string, errorMessage: string) =>
  send(userId, {
    event: 'error',
    data: errorMessage,
  });

export const send = (userId: string, { event, data }: IOEvent) => {
  // ? Error handling?
  const user = getUser(userId);
  user.socket.emit(event, data);
};
