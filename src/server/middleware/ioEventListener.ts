import { Socket } from 'socket.io';
import cookie from 'cookie';

import { EventByName, EventType } from '@shared/types/eventTypes';
import { Message } from '@shared/types/messages';
import { PlayerData } from '@shared/types/playerData';

import { Game } from '../models/game/game';
import { User, sendPlayerData, createUser, sendError } from '../models/user';
import { storage } from '../storage/storage';
import chalk from 'chalk';

export const ioConnectionListener = (socket: Socket): void => {
  const cookies = cookie.parse(socket.request.headers.cookie ?? '');

  const userId = cookies.playerID ?? '';
  const isExistingUser = storage.users.has(userId);

  // If we have a user, but this is a new connection
  if (isExistingUser) {
    const user = { ...storage.users.get(userId) };
    const oldSocket = user.socket.id.slice(0, 5);
    const newSocket = socket.id.slice(0, 5);
    console.log(
      `Switching user ${user.shortId} socket from ${oldSocket}... to ${newSocket}...`,
    );
    attachEventListeners(socket, user);
    storage.users.set(userId, user);
    sendPlayerData(user);
    const game = storage.games.get(user.gameID);
    game?.sendGameUpdate(user.id);
  } else {
    console.log(
      chalk.blue(new Date().toLocaleTimeString()) +
        ' Recieved a new connection from ' +
        socket.handshake.address,
      userId ? `with existing userId:${userId}` : 'with no existing userId.',
    );

    const user = createUser(socket);
    storage.users.set(user.id, user);
    attachEventListeners(socket, user);
    sendPlayerData(user);
    // TODO somehow update cookie here?
  }
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

const attachEventListeners = (socket: Socket, user: User) => {
  console.log('Attaching event listeners to socket', socket.id);
  socket.on('createGame', () => createGame(user));

  socket.on('joinGame', (data: unknown) => {
    joinValidator(data) && joinGame(user, data);
  });

  socket.on('playerData', (data: unknown) => {
    playerDataValidator(data) && updatePlayerData(user, data);
  });

  socket.on('clientMessage', (message: unknown) => {
    if (!clientMessageValidator(message)) return;
    const game = storage.games.get(message.gameID);

    if (!game)
      return console.error(
        `Event: ${message.type} cannot be received when no game is present`,
      );
    if (user.gameID !== message.gameID)
      return console.error('Recieved gameID does not match stored gameID');
    if (user.id !== message.playerID)
      return console.error('Recieved playerID does not match stored playerID');

    console.log(`Message - type:`, message.type, 'id:', socket.id);
    game.handleMessage(message);
  });

  user.socket = socket;
};

const createGame = (user: User): Game | void => {
  if (user.gameID) {
    console.error(`User ${user.id.slice(0, 5)} already has a game in progress`);
    return sendError(user, 'game already exists');
  }
  const game = new Game();
  storage.games.set(game.id, game);
  user.gameID = game.id;
  game.addPlayer(user.id);
  game.setHost(user.id);
  game.sendUpdateToAllPlayers();
  return game;
};

const joinGame = (user: User, data: EventByName<'joinGame'>['data']): void => {
  const game = storage.games.get(data.gameID);

  if (!game) {
    console.error(`No game found with ID '${data.gameID}'`);
    console.error('Current games:', ...storage.games.keys());
    return sendError(user, `Game with id ${data.gameID} not found.`);
  }

  if (!game.isOpen) {
    console.error(
      `Error joining game, game with id ${data.gameID} has already begun`,
    );
    return sendError(user, `Game with id ${data.gameID} has already begun`);
  }

  game.addPlayer(user.id);
  user.gameID = game.id;
  game.sendUpdateToAllPlayers();
};

const updatePlayerData = (user: User, data: PlayerData): void => {
  if (data.playerID && user.id !== data.playerID)
    return console.error(
      `ID mismatch: '${user.id}' stored, '${data.playerID}' received`,
    );
  user.name = data.name;
};
