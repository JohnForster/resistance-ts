import WebSocket, { Data } from 'ws';
import { WebsocketRequestHandler } from 'express-ws';

import Game from '../models/game/game';
import User from '../models/user';
import { EventType, EventByName } from '@shared/types/eventTypes';
import { RoundName } from '@shared/types/gameData';

export default class WSEventHandler {
  users: Map<string, User>;
  games: Map<string, Game>;

  constructor(users: Map<string, User>, games: Map<string, Game>) {
    this.users = users;
    this.games = games;
  }

  public middleWare: WebsocketRequestHandler = (ws, req): void => {
    const playerID = req.cookies.playerID;
    console.log('req.cookies:', req.cookies);
    const isExistingUser = this.users.has(playerID);
    console.log(`Player ${isExistingUser ? 'exists' : 'does not exist'} with ID '${playerID}'`);
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
    if (event === EventType.createGame) this.createGame(user /*, data*/);
    if (event === EventType.joinGame) this.joinGame(user, data);
    if (event === EventType.playerData) this.updatePlayerData(user, data);
    if (event === EventType.beginGame) this.beginGame(user, data);
    if (event === EventType.confirm) this.confirmCharacter(user, data);
    if (event === EventType.nominate) this.nominatePlayer(user, data);
  };

  private createGame = (user: User /* data: EventByName<EventType.createGame>['data'] */): void => {
    if (this.games.get(user.id)) return user.send({ event: EventType.error, data: 'game already exists' });

    const game = new Game(user);
    this.games.set(game.id, game);

    user.game = game;
    game.addPlayer(user, true);
  };

  private joinGame = (user: User, data: EventByName<EventType.joinGame>['data']): void => {
    const game = this.games.get(data.gameID);
    if (!game) {
      console.error(`No game found with ID '${data.gameID}'`);
      console.error(`Current games: ${this.games.keys}`);
      const payload: EventByName<EventType.error> = {
        event: EventType.error,
        data: `Game with id ${data.gameID} not found.`,
      };
      return user.send(payload);
    }
    game.addPlayer(user);
    user.game = game;
    console.log(`Added player ${user.id} to game ${game.id}`);
    game.sendGameUpdate(user);
  };

  private updatePlayerData = (user: User, data: EventByName<EventType.playerData>['data']): void => {
    if (user.id !== data.playerID) throw new Error(`ID mismatch: '${user.id}' stored, '${data.playerID}' received`);
    user.name = data.name;
  };

  private beginGame = (user: User, data: EventByName<EventType.beginGame>['data']): void => {
    const game = this.games.get(data.gameID);
    let errorMessage;
    if (game.hasBegun) errorMessage = 'This game has already begun';
    if (game.host.id !== user.id) errorMessage = 'Only the host can begin the game';
    if (errorMessage) return user.send({ event: EventType.error, data: errorMessage });

    game.beginGame();
  };

  private createNewUser = (ws: WebSocket): User => {
    const user = new User(ws);

    this.users.set(user.id, user);

    const payload: EventByName<EventType.playerData> = {
      event: EventType.playerData,
      data: { playerID: user.id, name: null },
    };
    user.send(payload);

    return user;
  };

  private confirmCharacter = (user: User, data: EventByName<EventType.confirm>['data']): void => {
    if (user.game.id !== data.gameID) return console.error('Recieved gameID does not match stored gameID');
    if (user.id !== data.playerID) return console.error('Recieved playerID does not match stored playerID');
    const game = this.games.get(data.gameID);
    if (game.currentRound !== RoundName.characterAssignment)
      return console.error('Can only confirm character during characterAssignment stage');
    game.confirmCharacter(data.playerID);
  };

  private nominatePlayer = (user: User, data: EventByName<EventType.nominate>['data']): void => {
    if (user.game.id !== data.gameID) return console.error('Recieved gameID does not match stored gameID');
    if (user.id !== data.playerID) return console.error('Recieved playerID does not match stored playerID');
    const game = this.games.get(user.game.id);
    if (game.currentRound !== RoundName.nomination) return console.error('Can only nominate during nomination stage');
    game.nominate(data.nominatedPlayerIDs);
  };
}
