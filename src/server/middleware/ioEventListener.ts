import { Socket } from 'socket.io';
import cookie from 'cookie';

import { EventByName, EventType } from '@shared/types/eventTypes';
import { Message } from '@shared/types/messages';
import { PlayerData } from '@shared/types/playerData';

import { Game } from '../models/game/game';
import {
  sendPlayerData,
  createUser,
  sendError,
  updateUser,
  User,
  getUser,
} from '../models/user';
import { storage } from '../storage/storage';
import chalk from 'chalk';

export const ioConnectionListener = (socket: Socket): void => {
  const cookies = cookie.parse(socket.request.headers.cookie ?? '');

  const userId = cookies.playerID ?? '';
  const existingUser = getUser(userId);

  // If we have a user, but this is a new connection
  if (existingUser) {
    replaceUserSocket(existingUser, socket);
    sendPlayerData(userId);
    const gameId = getUser(userId).gameID;
    const game = storage.games.get(gameId);
    game?.sendGameUpdate(userId);
  } else {
    console.log(
      chalk.blue(new Date().toLocaleTimeString()) +
        ' Received a new connection from ' +
        socket.handshake.address,
      userId ? `with existing userId:${userId}` : 'with no existing userId.',
    );

    const user = createUser(socket);
    console.log('user:', user);
    attachEventListeners(socket, user.id);
    sendPlayerData(user.id);
    // TODO somehow update cookie here?
  }
};

const replaceUserSocket = (user: User, socket: Socket) => {
  attachEventListeners(socket, user.id);
  logSocketChange(user, socket);
  updateUser(user.id, { socket });
};

const logSocketChange = (user: User, socket: Socket) => {
  const oldSocket = user.socket.id.slice(0, 5);
  const newSocket = socket.id.slice(0, 5);
  console.log(
    `Switching user ${user.shortId} socket from ${oldSocket}... to ${newSocket}...`,
  );
};

const validationError = (eventName: EventType, data: unknown) =>
  console.error(`Incorrect data for event ${eventName}:`, JSON.stringify(data));

const joinValidator = (x: any): x is { gameID: string } =>
  typeof x?.gameID === 'string';

const playerDataValidator = (x: any): x is PlayerData => {
  const isPlayerData =
    typeof x?.name === 'string' &&
    (typeof x?.playerID === 'string' || x?.playerID === null);
  if (!isPlayerData) {
    validationError('playerData', x);
  }
  return isPlayerData;
};

const clientMessageValidator = (x: any): x is Message => {
  const isClientMessage =
    typeof x?.playerID === 'string' && typeof x?.gameID === 'string';
  if (!isClientMessage) {
    validationError('clientMessage', x);
  }
  return isClientMessage;
};

const attachEventListeners = (socket: Socket, userId: string) => {
  socket.on('createGame', () => {
    createGame(userId);
  });

  socket.on('joinGame', (data: unknown) => {
    joinValidator(data) && joinGame(userId, data);
  });

  socket.on('playerData', (data: unknown) => {
    playerDataValidator(data) && updatePlayerData(userId, data);
  });

  socket.on('clientMessage', (message: unknown) => {
    const user = getUser(userId);
    if (!clientMessageValidator(message)) return;
    const game = storage.games.get(message.gameID);

    if (!game)
      return console.error(
        `Event: ${message.type} cannot be received when no game is present`,
      );
    if (user.gameID !== message.gameID)
      return console.error(
        `Received gameID ${message.gameID} does not match stored gameID ${user.gameID}`,
      );
    if (user.id !== message.playerID)
      return console.error('Received playerID does not match stored playerID');

    game.handleMessage(message);
  });
};

const createGame = (userId: string): Game | void => {
  const game = new Game();
  storage.games.set(game.id, game);
  updateUser(userId, { gameID: game.id });
  game.addPlayer(userId);
  game.setHost(userId);
  game.sendUpdateToAllPlayers();
  return game;
};

const joinGame = (
  userId: string,
  data: EventByName<'joinGame'>['data'],
): void => {
  const game = storage.games.get(data.gameID);

  if (!game) {
    console.error(`No game found with ID '${data.gameID}'`);
    console.error('Current games:', ...storage.games.keys());
    return sendError(userId, `Game with id ${data.gameID} not found.`);
  }

  if (!game.isOpen) {
    console.error(
      `Error joining game, game with id ${data.gameID} has already begun`,
    );
    return sendError(userId, `Game with id ${data.gameID} has already begun`);
  }

  game.addPlayer(userId);
  updateUser(userId, { gameID: data.gameID });
  game.sendUpdateToAllPlayers();
};

const updatePlayerData = (userId: string, data: PlayerData): void => {
  if (data.playerID && userId !== data.playerID)
    return console.error(
      `ID mismatch: '${userId}' stored, '${data.playerID}' received`,
    );
  updateUser(userId, { name: data.name });
};
