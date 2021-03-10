import { Socket } from 'socket.io';
import cookie from 'cookie';

import { EventByName, EventType } from '@shared/types/eventTypes';
import { Message } from '@shared/types/messages';
import { PlayerData } from '@shared/types/playerData';

import { Game } from '../models/game/game';
import { User, sendPlayerData, createUser, sendError } from '../models/user';
import { storage } from '../storage/storage';

export const ioConnectionListener = (socket: Socket): void => {
  console.log('Sockets.io connection made, id:', socket.id);

  const cookies = cookie.parse(socket.request.headers.cookie);
  console.log('cookies:', cookies);

  const userId = cookies.playerID ?? '';
  const isExistingUser = storage.users.has(userId);

  // If we have a user, but this is a new connection
  if (isExistingUser) {
    const user = storage.users.get(userId);
    attachEventListeners(socket, user);
    sendPlayerData(user);
    const game = storage.games.get(user.gameID);
    game?.sendGameUpdate(user);
  } else {
    console.log(
      new Date().toISOString() +
        ' Recieved a new connection from origin ' +
        socket.handshake.address,
    );

    const user = createUser(socket);
    storage.users.set(user.id, user);
    attachEventListeners(socket, user);
    sendPlayerData(user);
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
  game.addPlayer(user);
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

  game.addPlayer(user);
  user.gameID = game.id;
  console.log(`Added player ${user.id} to game ${game.id}`);
  game.sendUpdateToAllPlayers();
};

const updatePlayerData = (
  user: User,
  data: EventByName<'playerData'>['data'],
): void => {
  if (user.id !== data.playerID)
    throw new Error(
      `ID mismatch: '${user.id}' stored, '${data.playerID}' received`,
    );
  user.name = data.name;
};
