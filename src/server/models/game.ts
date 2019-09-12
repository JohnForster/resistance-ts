import User from './user';
import generateID from '../utils/generateID';
import { UpdatePlayersEvent } from '../../shared/types/eventTypes';

export default class Game {
  public id: string;
  public host: User;
  public players: User[] = [];

  constructor() {
    this.id = generateID();
  }

  addPlayer(user: User, isHost = false): void {
    this.players.push(user);
    if (isHost && !this.host) this.host = user;
    this.players.forEach(this.sendUpdatedPlayerList());
  }

  sendUpdatedPlayerList = (): ((u: User) => void) => {
    const payloadString = JSON.stringify({
      event: 'updatePlayers',
      data: {
        gameID: this.id,
        playerIDs: this.players.map(p => p.id),
        host: this.host.id,
      },
    } as UpdatePlayersEvent);
    return (player: User): void => player.ws.send(payloadString);
  };
}
