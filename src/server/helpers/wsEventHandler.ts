import WebSocket, { Data } from 'ws';
import { WebsocketRequestHandler } from 'express-ws';

import Game from '../models/game/game';
import User from '../models/user';
import { EventByName } from '../../shared/types/eventTypes';
import { EventType, RoundName } from '@server/types/enums';

export default class WSEventHandler {
  users: Map<string, User>;
  games: Map<string, Game>;

  constructor(users: Map<string, User>, games: Map<string, Game>) {
    this.users = users;
    this.games = games;
  }

  public middleWare: WebsocketRequestHandler = (ws, req): void => {
    const playerID = req.cookies.playerID || '';
    const user = this.users.get(playerID);
    console.log(
      `Player ${user ? 'found' : 'does not exist'} with ID '${playerID.slice(0, 8)}...'${
        user ? ` (${user.name})` : ''
      }`,
    );
    if (user) {
      const handleMessage = this.createMessageHandler(user);
      user.ws = ws.on('message', handleMessage);
      user.sendPlayerData();
      // TODO refactor to user.sendGameUpdate()
      if (user.game) user.game.sendGameUpdate(user);
    } else {
      console.log(new Date().toISOString() + ' Recieved a new connection from origin ' + req.ip);
      const user = this.createNewUser(ws);
      const messageHandler = this.createMessageHandler(user);
      user.ws = ws.on('message', messageHandler);
    }
  };

  private createMessageHandler = (user: User) => (msg: Data): void => {
    // if ((msg as string) === 'ping') return;
    // TODO try/catch JSON.parse
    const [event, data] = JSON.parse(msg as string);
    console.log('Event received:', event);
    if (event === 'mission') {
      console.log(data);
    }

    // Will all be replaced with...
    const game = this.games.get(user.id);
    if (!game) {
    } // Handle error here
    // handle createGame
    // handle joinGame
    // Where should validation occur?
    // game.handleMessage(data);

    if (event === EventType.createGame) return this.createGame(user /*, data*/);
    if (event === EventType.joinGame) return this.joinGame(user, data);
    if (event === EventType.playerData) return this.updatePlayerData(user, data);
    if (event === EventType.beginGame) return this.beginGame(user, data);

    if (user.game.id !== data.gameID) return console.error('Recieved gameID does not match stored gameID');
    if (user.id !== data.playerID) return console.error('Recieved playerID does not match stored playerID');

    if (event === EventType.confirm) return this.confirmCharacter(user, data);
    if (event === EventType.nominate) return this.nominatePlayer(user, data);
    if (event === EventType.vote) return this.handleVote(user, data);
    if (event === EventType.mission) return this.handleMissionVote(user, data);
    if (event === EventType.continue) return this.handleReadyForNextRound(user, data);
  };

  private createGame = (user: User /* data: EventByName<typeof EventType.createGame>['data'] */): void => {
    if (this.games.get(user.id)) return user.send({ event: EventType.error, data: 'game already exists' });

    const game = new Game(user);
    this.games.set(game.id, game);

    user.game = game;
    game.addPlayer(user, true);
  };

  private joinGame = (user: User, data: EventByName<typeof EventType.joinGame>['data']): void => {
    const game = this.games.get(data.gameID);
    if (!game) {
      console.error(`No game found with ID '${data.gameID}'`);
      console.error(`Current games: ${this.games.keys}`);
      const payload: EventByName<typeof EventType.error> = {
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

  private updatePlayerData = (user: User, data: EventByName<typeof EventType.playerData>['data']): void => {
    if (user.id !== data.playerID) throw new Error(`ID mismatch: '${user.id}' stored, '${data.playerID}' received`);
    user.name = data.name;
  };

  private beginGame = (user: User, data: EventByName<typeof EventType.beginGame>['data']): void => {
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

    const payload: EventByName<typeof EventType.playerData> = {
      event: EventType.playerData,
      data: { playerID: user.id, name: null },
    };
    user.send(payload);

    return user;
  };

  private confirmCharacter = (user: User, data: EventByName<typeof EventType.confirm>['data']): void => {
    // TODO extract this checking logic out and perform for all routes
    if (user.game.id !== data.gameID) return console.error('Recieved gameID does not match stored gameID');
    if (user.id !== data.playerID) return console.error('Recieved playerID does not match stored playerID');
    const game = this.games.get(data.gameID);
    if (game.currentRound !== RoundName.characterAssignment)
      return console.error('Can only confirm character during characterAssignment stage');
    game.confirmCharacter(data.playerID);
  };

  private nominatePlayer = (user: User, data: EventByName<typeof EventType.nominate>['data']): void => {
    if (user.game.id !== data.gameID) return console.error('Recieved gameID does not match stored gameID');
    if (user.id !== data.playerID) return console.error('Recieved playerID does not match stored playerID');
    const game = this.games.get(user.game.id);
    if (game.currentRound !== RoundName.nomination) return console.error('Can only nominate during nomination stage');
    game.nominatePlayers(data.nominatedPlayerIDs);
  };

  private handleVote = (user: User, data: EventByName<typeof EventType.vote>['data']): void => {
    const game = this.games.get(data.gameID);
    if (game.currentRound !== RoundName.voting) return console.error('Can only vote during voting stage');
    game.vote(user.id, data.playerApproves);
  };

  private handleMissionVote = (user: User, data: EventByName<typeof EventType.mission>['data']): void => {
    const game = this.games.get(data.gameID);
    if (game.currentRound !== RoundName.mission)
      return console.error('Can only complete a mission during the mission stage');
    game.missionResponse(data.playerID, data.playerVotedToSucceed);
  };

  private handleVoteResultsConfirm = (user: User, data: EventByName<typeof EventType.mission>['voteConfirm']): void => {
    const game = this.games.get(data.gameID);
    if (game.currentRound != RoundName.voteResult)
      return console.error('Can only continue during the vote result stage');
    game.confirmVoteResult(data.playerID);
  };

  private handleReadyForNextRound = (user: User, data: EventByName<typeof EventType.continue>['data']): void => {
    const game = this.games.get(data.gameID);
    if (game.currentRound != RoundName.missionResult)
      return console.error('Can only continue during the mission result stage');
    game.readyForNextMission(data.playerID);
  };
}
