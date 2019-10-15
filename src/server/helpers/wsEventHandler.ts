import WebSocket, { Data } from 'ws';
import { Request } from 'express';

import Game from '../models/game';
import User from '../models/user';
import {
  CreateEvent,
  PlayerDataEvent,
  JoinEvent,
  ErrorEvent,
  BeginGameEvent,
  ConfirmEvent,
} from '../../shared/types/eventTypes';
import { WebsocketRequestHandler } from 'express-ws';

export default class WSEventHandler {
  users: Map<string, User>;
  games: Map<string, Game>;

  constructor(users: Map<string, User>, games: Map<string, Game>) {
    this.users = users;
    this.games = games;
  }

  public middleWare: WebsocketRequestHandler = (ws, req): void => {
    const playerID = req.cookies.playerID;
    const isExistingUser = this.users.has(playerID);
    console.log(`Player ${isExistingUser ? 'EXISTS' : 'does not exist'} with ID '${playerID}'`);
    if (isExistingUser) {
      const user = this.users.get(playerID);
      user.ws = ws.on('message', this.handleMessage(user));
      user.sendPlayerData();
      // TODO refactor to user.sendGameUpdate()
      if (user.game) user.game.sendGameUpdate(user);
    } else {
      console.log(new Date() + ' Recieved a new connection from origin ' + req.ip);
      const user = this.createNewUser(ws);
      user.ws = ws.on('message', this.handleMessage(user));
    }
  };

  private handleMessage = (user: User) => (msg: Data): void => {
    const [event, data] = JSON.parse(msg as string);
    console.log('Event received:', event);
    if (event === 'create_game') this.createGame(user, data);
    if (event === 'join_game') this.joinGame(user, data);
    if (event === 'playerData') this.updatePlayerData(user, data);
    if (event === 'beginGame') this.beginGame(user, data);
    if (event === 'confirm') this.confirmCharacter(user, data);
  };

  private createGame = (user: User, data: CreateEvent['data']): void => {
    if (this.games.get(user.id)) return user.send({ event: 'error', data: 'game already exists' });

    const game = new Game(user);
    this.games.set(game.id, game);

    user.game = game;
    game.addPlayer(user, true);
  };

  private joinGame = (user: User, data: JoinEvent['data']): void => {
    const game = this.games.get(data.gameID);
    if (!game) {
      console.error(`No game found with ID '${data.gameID}'`);
      console.error(`Current games: ${this.games.keys}`);
      return user.send({ event: 'error', data: `Game with id ${data.gameID} not found.` } as ErrorEvent);
    }
    game.addPlayer(user);
    user.game = game;
    console.log(`Added player ${user.id} to game ${game.id}`);
    game.sendGameUpdate(user);
  };

  private updatePlayerData = (user: User, data: PlayerDataEvent['data']): void => {
    if (user.id !== data.playerID) throw new Error(`ID mismatch: '${user.id}' stored, '${data.playerID}' received`);
    user.name = data.name;
  };

  private beginGame = (user: User, data: BeginGameEvent['data']): void => {
    const game = this.games.get(data.gameID);
    let errorMessage;
    if (game.hasBegun) errorMessage = 'This game has already begun';
    if (game.host.id !== user.id) errorMessage = 'Only the host can begin the game';
    if (errorMessage) return user.send({ event: 'error', data: errorMessage });

    game.beginGame();
  };

  private createNewUser = (ws: WebSocket): User => {
    const user = new User(ws);

    this.users.set(user.id, user);

    const payload: PlayerDataEvent = { event: 'playerData', data: { playerID: user.id, name: null } };
    user.send(payload);

    return user;
  };

  private confirmCharacter = (user: User, data: ConfirmEvent['data']): void => {
    if (user.game.id !== data.gameID) return console.error('Recieved gameID does not match stored gameID');
    if (user.id !== data.playerID) return console.error('Recieved playerID does not match stored playerID');
    const game = this.games.get(data.gameID);
    game.confirmCharacter(data.playerID);
  };
}
