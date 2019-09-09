import uuidv4 from 'uuid/v4';
import User from './user';

export default class Game {
  public id: string;
  public user: User;

  constructor(user: User) {
    this.id = Math.floor(Math.random() * 60466176)
      .toString(36)
      .toUpperCase();
    this.user = user;
  }
}
