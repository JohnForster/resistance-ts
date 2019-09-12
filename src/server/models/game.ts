import User from './user';
import generateID from '../utils/generateID';

export default class Game {
  public id: string;
  public host: User;
  public players: User[] = [];

  constructor(user: User) {
    this.id = generateID();
    this.host = user;
    this.players.push(user);
  }

  addPlayer(user: User): void {
    this.players.push(user);
  }
}
