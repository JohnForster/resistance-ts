import { Socket } from 'socket.io';
import cookie from 'cookie';

import { EventByName, EventType } from 'shared';
import { Message } from 'shared';
import { PlayerData } from 'shared';

import { Game } from '../models/game/game';
import {
  sendPlayerData,
  createUser,
  sendError,
  updateUser,
  User,
  isUser,
  getUser,
} from '../models/user';
import { storage } from '../storage/storage';
import chalk from 'chalk';

export const ioConnectionListener = (socket: Socket): void => {
  const cookies = cookie.parse(socket.request.headers.cookie ?? '');

  const userID = cookies.playerID ?? '';

  // If we have a user, but this is a new connection
  if (isUser(userID)) {
    replaceUserSocket(userID, socket);
    sendPlayerData(userID);
    const gameID = getUser(userID).gameID;
    const game = storage.games.get(gameID);
    game?.sendGameUpdate(userID);
  } else {
    console.log(
      chalk.blue(new Date().toLocaleTimeString()) +
        ' Received a new connection from ' +
        socket.handshake.address,
      userID ? `with existing userID:${userID}` : 'with no existing userID.',
    );

    const user = createUser(socket);
    attachEventListeners(socket, user.id);
    sendPlayerData(user.id);
    // TODO somehow update cookie here?
  }
};

const replaceUserSocket = (userID: string, socket: Socket) => {
  attachEventListeners(socket, userID);
  logSocketChange(userID, socket);
  updateUser(userID, { socket });
};

const logSocketChange = (userID: string, socket: Socket) => {
  const user = getUser(userID);
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

const cancelGameValidator = (x: any): x is EventByName<'cancelGame'>['data'] =>
  !!x.playerID;

const attachEventListeners = (socket: Socket, userID: string) => {
  socket.on('createGame', () => {
    createGame(userID);
  });

  socket.on('joinGame', (data: unknown) => {
    joinValidator(data) && joinGame(userID, data);
  });

  socket.on('playerData', (data: unknown) => {
    playerDataValidator(data) && updatePlayerData(userID, data);
  });

  socket.on('cancelGame', (data: unknown) => {
    if (!cancelGameValidator(data)) return;
    const user = getUser(userID);
    const game = storage.games.get(user?.gameID);
    if (!game) {
      return console.error(
        `No game found for user: ${userID}. Cannot cancel game.`,
      );
    }
    game.cancelGame(data);
  });

  socket.on('clientMessage', (message: unknown) => {
    const user = getUser(userID);
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

const createGame = (userID: string): Game | void => {
  const game = new Game();
  storage.games.set(game.id, game);
  updateUser(userID, { gameID: game.id });
  game.addPlayer(userID);
  game.setHost(userID);
  game.sendUpdateToAllPlayers();
  return game;
};

const joinGame = (
  userID: string,
  data: EventByName<'joinGame'>['data'],
): void => {
  const game = storage.games.get(data.gameID);

  if (!game) {
    console.error(`No game found with ID '${data.gameID}'`);
    console.error('Current games:', ...storage.games.keys());
    return sendError(userID, `Game with id ${data.gameID} not found.`);
  }

  if (!game.isOpen) {
    console.error(
      `Error joining game, game with id ${data.gameID} has already begun`,
    );
    return sendError(userID, `Game with id ${data.gameID} has already begun`);
  }

  game.addPlayer(userID);
  updateUser(userID, { gameID: data.gameID });
  game.sendUpdateToAllPlayers();
};

const updatePlayerData = (userID: string, data: PlayerData): void => {
  if (data.playerID && userID !== data.playerID)
    return console.error(
      `ID mismatch: '${userID}' stored, '${data.playerID}' received`,
    );
  updateUser(userID, { name: data.name });
};
