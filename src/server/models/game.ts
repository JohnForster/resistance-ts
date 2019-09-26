import User from './user';
import generateID from '../utils/generateID';
import { GameUpdateEvent } from '../../shared/types/eventTypes';

export default class Game {
  public id: string;
  public host: User;
  public players: User[] = [];
  public round = 0;
  public roundData: {} = {};
  public stage: 'nominate' | 'nominationVote' | 'missionVote' = null;

  constructor(user: User) {
    this.id = generateID();
    this.host = user;
  }

  sendGameUpdate = (player: User): void => {
    const payload: GameUpdateEvent = {
      event: 'gameUpdate',
      data: {
        gameID: this.id,
        round: this.round,
        stage: this.stage,
        playerID: player.id,
        players: this.players.map(p => ({ name: p.name, id: p.id })),
        hostID: this.host.id,
        roundData: this.roundData,
      },
    };

    player.ws.send(JSON.stringify(payload));
  };

  addPlayer(user: User, isHost = false): void {
    console.log('adding player...', user.id);
    this.players.push(user);
    console.log('Players:', this.players.map(p => p.id).join(', '));
    if (isHost && !this.host) this.host = user;
    this.sendGameUpdates();
  }

  sendGameUpdates = (): void => {
    this.players.forEach(this.sendGameUpdate);
  };
}
