import WebSocket, { Data } from 'ws';
import { WebsocketRequestHandler } from 'express-ws';

import { Game } from '../models/newGame/newGame';
import User from '../models/user';
import { EventByName, EventType } from '@shared/types/eventTypes';
import { Message } from '@shared/types/messages';

export default class WSEventHandler {
  constructor(
    private users: Map<string, User>,
    private games: Map<string, Game>,
  ) {
    // Should users/games be a part of this class?
  }

  public middleWare: WebsocketRequestHandler = (ws, req): void => {
    console.log('connection made');
    const playerID = req.cookies.playerID || '';
    const user = this.users.get(playerID);

    user
      ? console.log(
          `Player found with ID '${playerID.slice(0, 8)} (${user.name})`,
        )
      : console.log(`No player found with ID '${playerID.slice(0, 8)}...`);

    if (user) {
      // If we have a user, but they are trying to make a new connection.
      const handleMessage = this.createMessageHandler(user);
      user.ws = ws.on('message', handleMessage);
      user.sendPlayerData();
      const game = this.games.get(user.gameID);
      game.sendGameUpdate(user);
    } else {
      console.log(
        new Date().toISOString() +
          ' Recieved a new connection from origin ' +
          req.ip,
      );
      const user = this.createNewUser(ws);
      const handleMessage = this.createMessageHandler(user);
      user.ws = ws.on('message', handleMessage);
    }
  };

  private createMessageHandler = (user: User) => (msg: Data): void => {
    console.log('Message Recieved!');
    // TODO try/catch JSON.parse
    const [event, message] = JSON.parse(msg as string);
    console.log('Event received:', event);
    if (event === 'message') {
      console.log(message);
    }

    const game = this.games.get(user.gameID);
    if (!game) {
      switch (event) {
        case 'createGame':
          return this.createGame(user);
        case 'joinGame':
          return this.joinGame(user, message);
        case 'playerData':
          return this.updatePlayerData(user, message);
        default:
          return console.error(
            `Event: ${event} cannot be received when no game is present`,
          );
      }
    }

    if (user.gameID !== message.gameID)
      return console.error('Recieved gameID does not match stored gameID');
    if (user.id !== message.playerID)
      return console.error('Recieved playerID does not match stored playerID');

    return game.handleMessage(message);
  };

  private createGame = (
    user: User /* data: EventByName<typeof EventType.createGame>['data'] */,
  ): void => {
    if (this.games.get(user.id)) {
      return user.send({ event: 'error', data: 'game already exists' });
    }
    const game = new Game();
    this.games.set(game.id, game);
    user.gameID = game.id;
    console.log('Game created. id:', game.id);
  };

  private joinGame = (
    user: User,
    data: EventByName<'joinGame'>['data'],
  ): void => {
    const game = this.games.get(data.gameID);

    if (!game) {
      console.error(`No game found with ID '${data.gameID}'`);
      console.error(`Current games: ${this.games.keys}`);
      const payload: EventByName<'error'> = {
        event: 'error',
        data: `Game with id ${data.gameID} not found.`,
      };
      return user.send(payload);
    }
    // Move this logic in to LobbyRound.ts, and replace with
    // game.handleMessage(data)?

    game.addPlayer(user);
    user.gameID = game.id;
    console.log(`Added player ${user.id} to game ${game.id}`);
    game.sendGameUpdate(user);
  };

  private updatePlayerData = (
    user: User,
    data: EventByName<'playerData'>['data'],
  ): void => {
    if (user.id !== data.playerID)
      throw new Error(
        `ID mismatch: '${user.id}' stored, '${data.playerID}' received`,
      );
    user.name = data.name;
  };

  private createNewUser = (ws: WebSocket): User => {
    const user = new User(ws);

    this.users.set(user.id, user);

    const payload: EventByName<'playerData'> = {
      event: 'playerData',
      data: { playerID: user.id, name: null },
    };
    user.send(payload);

    return user;
  };

  // private confirmCharacter = (
  //   user: User,
  //   data: EventByName<typeof EventType.confirm>['data'],
  // ): void => {
  //   // TODO extract this checking logic out and perform for all routes
  //   if (user.game.id !== data.gameID)
  //     return console.error('Recieved gameID does not match stored gameID');
  //   if (user.id !== data.playerID)
  //     return console.error('Recieved playerID does not match stored playerID');
  //   const game = this.games.get(data.gameID);
  //   if (game.currentRound !== RoundName.characterAssignment)
  //     return console.error(
  //       'Can only confirm character during characterAssignment stage',
  //     );
  //   game.confirmCharacter(data.playerID);
  // };

  // private nominatePlayer = (
  //   user: User,
  //   data: EventByName<typeof EventType.nominate>['data'],
  // ): void => {
  //   if (user.game.id !== data.gameID)
  //     return console.error('Recieved gameID does not match stored gameID');
  //   if (user.id !== data.playerID)
  //     return console.error('Recieved playerID does not match stored playerID');
  //   const game = this.games.get(user.game.id);
  //   if (game.currentRound !== RoundName.nomination)
  //     return console.error('Can only nominate during nomination stage');
  //   game.nominatePlayers(data.nominatedPlayerIDs);
  // };

  // private handleVote = (
  //   user: User,
  //   data: EventByName<typeof EventType.vote>['data'],
  // ): void => {
  //   const game = this.games.get(data.gameID);
  //   if (game.currentRound !== RoundName.voting)
  //     return console.error('Can only vote during voting stage');
  //   game.vote(user.id, data.playerApproves);
  // };

  // private handleMissionVote = (
  //   user: User,
  //   data: EventByName<typeof EventType.mission>['data'],
  // ): void => {
  //   const game = this.games.get(data.gameID);
  //   if (game.currentRound !== RoundName.mission)
  //     return console.error(
  //       'Can only complete a mission during the mission stage',
  //     );
  //   game.missionResponse(data.playerID, data.playerVotedToSucceed);
  // };

  // private handleVoteResultsConfirm = (
  //   user: User,
  //   data: EventByName<typeof EventType.mission>['voteConfirm'],
  // ): void => {
  //   const game = this.games.get(data.gameID);
  //   if (game.currentRound != RoundName.voteResult)
  //     return console.error('Can only continue during the vote result stage');
  //   game.confirmVoteResult(data.playerID);
  // };

  // private handleReadyForNextRound = (
  //   user: User,
  //   data: EventByName<typeof EventType.continue>['data'],
  // ): void => {
  //   const game = this.games.get(data.gameID);
  //   if (game.currentRound != RoundName.missionResult)
  //     return console.error('Can only continue during the mission result stage');
  //   game.readyForNextMission(data.playerID);
  // };
}
