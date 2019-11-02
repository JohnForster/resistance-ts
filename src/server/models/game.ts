import shuffle from 'lodash.shuffle';

import User from './user';
import generateID from '../utils/generateID';
import { GameUpdateEvent } from '../../shared/types/eventTypes';
import { GameData } from '../../shared/types/gameData';

interface Player extends User {
  character?: 'resistance' | 'spy';
  hasConfirmedCharacter?: boolean;
}

// TODO separate stages into separate classes?
export default class Game {
  private _id: string;
  private _players: Player[] = [];
  private _hasBegun = false;
  private _host: User;
  private _spies: Player[] = [];
  private _resistance: Player[] = [];
  private _round = 0;
  private _roundData: any = {};
  private _stage: 'lobby' | 'characterAssignment' | 'nominate' | 'nominationVote' | 'missionVote' = 'lobby';
  private _leaderIndex = 0;

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

  private get leader(): Player {
    return this._players[this._leaderIndex];
  }

  constructor(host: User) {
    this._id = generateID();
    this._host = host;
    this._stage = 'lobby';
  }

  sendUpdateToAllPlayers = (): void => {
    this._players.forEach(this.sendGameUpdate);
  };

  sendGameUpdate = (player: User): void => {
    const secretData = this.getSecretData(player);
    const payload: GameUpdateEvent = {
      event: 'gameUpdate',
      data: {
        gameID: this._id,
        round: this._round,
        stage: this._stage,
        playerID: player.id,
        hostName: this._host.name,
        isHost: this._host === player,
        leaderName: this.leader.name,
        isLeader: this.leader === player,
        players: this._players.map(p => ({ name: p.name })),
        roundData: this._roundData,
        secretData,
      },
    };

    player.ws.send(JSON.stringify(payload));
  };

  getSecretData = (player: Player): GameData['secretData'] => {
    if (this._stage === 'characterAssignment') {
      if (this._spies.includes(player)) {
        return {
          character: 'spy',
          spies: this._spies.map(p => p.name),
        };
      }
      return { character: 'resistance' };
    }

    return null;
  };

  addPlayer(player: User, isHost = false): void {
    this._players.push(player);
    console.log('Players:', this._players.map(p => p.id).join(', '));
    if (isHost && !this._host) this._host = player;
    this.sendUpdateToAllPlayers();
  }

  allocateTeams = (): void => {
    const players = shuffle([...this._players]);
    const numberOfSpies = this.NUMBER_OF_SPIES[players.length];
    // if (this.characters.merlin)
    for (let i = 0; i < numberOfSpies; i++) {
      this._spies.push(players.pop());
    }
    this._resistance.push(...players);
  };

  beginGame = (): void => {
    this.allocateTeams();
    this._stage = 'characterAssignment';
    this.sendUpdateToAllPlayers();
    this._players = shuffle(this._players);
    this._hasBegun = true;
  };

  startRound = (roundNumber: number): void => {
    this._round = roundNumber;
    this.beginNominationRound(0);
    this.sendUpdateToAllPlayers();
  };

  beginNominationRound = (rejections: number) => {
    // if (rejections >= 5) this.badGuysWin()
    this._leaderIndex = (this._leaderIndex + 1) % this._players.length;
    this._stage = 'nominate';
    this._roundData = {
      leader: this._players[this._leaderIndex].name,
      nominatedPlayers: [],
    };
  };

  nominate = (playerID: User['id']): void => {
    console.log('Nominated player with id', playerID);
  };

  confirmCharacter = (playerID: string): void => {
    const player = this._players.find(p => p.id === playerID);
    if (!player) return console.error(`No player found with id ${playerID}`);
    player.hasConfirmedCharacter = true;
    const unconfirmedPlayers = this._players.filter(p => !p.hasConfirmedCharacter).map(p => p.name);
    this._roundData.unconfirmedPlayers = unconfirmedPlayers;
    this.sendUpdateToAllPlayers();
    if (unconfirmedPlayers.length === 0) this.startRound(1);
  };
}
