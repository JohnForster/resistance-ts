import shuffle from 'lodash.shuffle';

import User from './user';
import generateID from '../utils/generateID';
import { GameUpdateEvent } from '../../shared/types/eventTypes';

interface Player extends User {
  character?: 'resistance' | 'spy';
}

export default class Game {
  private _id: string;
  private _host: User;
  private _players: Player[] = [];
  private _spies: Player[] = [];
  private _resistance: Player[] = [];
  private _hasBegun = false;
  private _round = 0;
  private _roundData: {} = {};
  private _stage: 'characterAssignment' | 'nominate' | 'nominationVote' | 'missionVote' = null;

  private NUMBER_OF_SPIES: { [key: number]: number } = {
    2: 1, // Here for dev purposes only
    3: 1, // Here for dev purposes only
    5: 2,
    6: 2,
    7: 3,
    8: 3,
    9: 3,
    10: 4,
  };

  public get id(): string {
    return this._id;
  }

  public get players(): Player[] {
    return this._players;
  }

  public get hasBegun(): boolean {
    return this._hasBegun;
  }

  public get host(): User {
    return this._host;
  }
  constructor(host: User) {
    this._id = generateID();
    this._host = host;
  }

  sendGameUpdate = (player: User, privateData?: any): void => {
    const payload: GameUpdateEvent = {
      event: 'gameUpdate',
      data: {
        gameID: this._id,
        round: this._round,
        stage: this._stage,
        playerID: player.id,
        players: this._players.map(p => ({ name: p.name, id: p.id })),
        hostID: this._host.id,
        roundData: this._roundData,
        privateData,
      },
    };

    player.ws.send(JSON.stringify(payload));
  };

  addPlayer(player: User, isHost = false): void {
    console.log('adding player...', player.id);
    this._players.push(player);
    console.log('Players:', this._players.map(p => p.id).join(', '));
    if (isHost && !this._host) this._host = player;
    this.sendUpdateToAllPlayers();
  }

  sendUpdateToAllPlayers = (fn?: (player: Player) => any): void => {
    this._players.forEach(player => {
      const data = fn && fn(player);
      this.sendGameUpdate(player, data);
    });
  };

  allocateTeams = (): void => {
    const players = shuffle([...this._players]);
    const numberOfSpies = this.NUMBER_OF_SPIES[players.length];
    // if (this.characters.merlin)
    for (let i = 0; i < numberOfSpies; i++) {
      this._spies.push(players.pop());
    }
    this._resistance.push(...players);
  };

  beginGame(): void {
    this.allocateTeams();
    this._stage = 'characterAssignment';
    this.sendUpdateToAllPlayers(player => {
      if (this._spies.includes(player)) {
        return {
          character: 'spy',
          spies: this._spies.map(p => p.name),
        };
      }
      return {
        character: 'resistance',
      };
    });
    this._hasBegun = true;
  }
}
