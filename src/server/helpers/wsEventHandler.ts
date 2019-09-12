import WebSocket, { Data } from 'ws';
import { Request } from 'express';

import Game from '../models/game';
import User from '../models/user';
import { CreateEvent, GameCreatedEvent, NewPlayerEvent, JoinEvent, ErrorEvent } from '../../shared/types/eventTypes';
import { WebsocketRequestHandler } from 'express-ws';

export default class WSEventHandler {
  users: Map<string, User>;
  games: Map<string, Game>;

  constructor(users: Map<string, User>, games: Map<string, Game>) {
    this.users = users;
    this.games = games;
  }

  public middleWare: WebsocketRequestHandler = (ws, req): void => {
    const user = this.createNewUser(ws, req);
    ws.on('message', this.handleMessage(user));
  };

  private handleMessage = (user: User) => (msg: Data): void => {
    const [event, data] = JSON.parse(msg as string);
    if (event === 'create_game') this.createGame(user, data);
    if (event === 'join_game') this.joinGame(user, data);
  };

  private createGame = (user: User, data: CreateEvent['data']): void => {
    if (this.games.get(user.id)) return user.ws.send(JSON.stringify({ event: 'error', data: 'game already exists' }));

    const game = new Game();
    this.games.set(game.id, game);

    const payload: GameCreatedEvent = { event: 'game_created', data: { gameID: game.id } };
    user.ws.send(JSON.stringify(payload));
    game.addPlayer(user, true);
  };

  private joinGame = (user: User, data: JoinEvent['data']): void => {
    const game = this.games.get(data.gameID);
    if (!game) {
      return user.ws.send(
        JSON.stringify({ event: 'error', data: `Game with id ${data.gameID} not found.` } as ErrorEvent),
      );
    }
    game.addPlayer(user);
    console.log(`Adding player ${user.id} to game ${game.id}`);
  };

  private createNewUser = (ws: WebSocket, req: Request): User => {
    if (this.users.has(req.ip)) {
      console.log('User already exists!', 'Should reassign that users ws here');
      return;
    }

    const user = new User(ws, req.ip);
    console.log(new Date() + ' Recieved a new connection from origin ' + req.ip);

    this.users.set(req.ip, user);

    const payload: NewPlayerEvent = { event: 'new_player', data: { playerID: user.id } };
    user.ws.send(JSON.stringify(payload));

    return user;
  };
}
