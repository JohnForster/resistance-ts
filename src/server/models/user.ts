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

export const getUser = (userID: string): User => {
  const user = storage.users.get(userID);
  if (!user) throw new Error(`No user found with id: ${userID}`);
  return user;
};

export const isUser = (userID: string) => {
  return storage.users.has(userID);
};

export const updateUser = (userID: string, update: Partial<User>) => {
  const oldUser = getUser(userID);
  if (!oldUser) {
    throw new Error(`No user found with id ${userID}`);
  }
  const newUser = { ...oldUser, ...update };
  storage.users.set(oldUser.id, newUser);
  return newUser;
};

export const sendPlayerData = (userID: string) => {
  const user = getUser(userID);
  send(userID, {
    event: 'playerData',
    data: {
      playerID: userID,
      name: user.name,
    },
  });
};

export const sendError = (userID: string, errorMessage: string) =>
  send(userID, {
    event: 'error',
    data: errorMessage,
  });

export const send = (userID: string, { event, data }: IOEvent) => {
  // ? Error handling?
  const user = getUser(userID);
  user.socket.emit(event, data);
};
