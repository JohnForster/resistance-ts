import uuidv4 from 'uuid/v4';
import User from './user';

export default class Game {
  public id: string;
  public host: User;
  public players: User[] = [];

  constructor(user: User) {
    this.id = Math.floor(Math.random() * 60466176)
      .toString(36)
      .toUpperCase();
    this.host = user;
    this.players.push(user);
  }

  addPlayer(user: User): void {
    this.players.push(user);
  }
}
