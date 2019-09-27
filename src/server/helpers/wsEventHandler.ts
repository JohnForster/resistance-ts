import WebSocket, { Data } from 'ws';
import { Request } from 'express';

import Game from '../models/game';
import User from '../models/user';
import {
  CreateEvent,
  PlayerDataEvent,
  JoinEvent,
  ErrorEvent,
  GameUpdateEvent,
  WSEvent,
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
    const isExistingUser = this.users.has(req.ip);
    if (isExistingUser) {
      const user = this.users.get(req.ip);
      user.ws = ws.on('message', this.handleMessage(user));
      user.sendPlayerData();
      if (user.game) {
        // TODO refactor to user.sendGameUpdate()
        user.game.sendGameUpdate(user);
      }
    } else {
      const user = this.createNewUser(ws, req);
      user.ws = ws.on('message', this.handleMessage(user));
    }
  };

  private handleMessage = (user: User) => (msg: Data): void => {
    const [event, data] = JSON.parse(msg as string);
    console.log('Event received:', event);
    if (event === 'create_game') this.createGame(user, data);
    if (event === 'join_game') this.joinGame(user, data);
    if (event === 'playerData') this.updatePlayerData(user, data);
  };

  private createGame = (user: User, data: CreateEvent['data']): void => {
    if (this.games.get(user.id)) return user.ws.send(JSON.stringify({ event: 'error', data: 'game already exists' }));

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
      return user.ws.send(
        JSON.stringify({ event: 'error', data: `Game with id ${data.gameID} not found.` } as ErrorEvent),
      );
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

  private createNewUser = (ws: WebSocket, req: Request): User => {
    if (this.users.has(req.ip)) {
      const user = this.users.get(req.ip);
      user.sendPlayerData();
      return;
    }

    const user = new User(ws, req.ip);
    console.log(new Date() + ' Recieved a new connection from origin ' + req.ip);

    this.users.set(req.ip, user);

    const payload: PlayerDataEvent = { event: 'playerData', data: { playerID: user.id, name: null } };
    user.ws.send(JSON.stringify(payload));

    return user;
  };
}
