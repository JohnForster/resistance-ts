import shuffle from 'lodash.shuffle';

import User from '../user';
import generateID from '../../utils/generateID';
import { GameUpdateEvent } from '../../../shared/types/eventTypes';
// import { GameData, RoundData, RoundDataByName } from '../../../shared/types/gameData';
import RULES, { Rules, Character } from '../../data/gameRules';
import CharacterRound from './rounds/characterRound/characterRound';
import Round from './rounds/round';
import { RoundName } from '../../../shared/types/gameData';

export interface Player extends User {
  allegiance?: 'resistance' | 'spies';
  character?: Character;
  hasConfirmedCharacter?: boolean;
}

// TODO separate stages into separate classes?
export default class Game {
  private _id: string;
  private _players: Player[] = [];
  private _hasBegun = false;
  private _host: User;
  // private _spies: Player[] = [];
  // private _resistance: Player[] = [];
  private _round = 0;
  // private _roundData: RoundData = {};
  // private _stage: RoundName = 'lobby';
  private _leaderIndex = 0;
  private _rules: Rules;
  private _characterRound: CharacterRound;

  // ? Could be a set?
  // ? private _characters: Set<Character>;
  private _characters: { [C in Character]?: boolean };

  private _currentRound: Round;

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

  public get currentRound(): RoundName {
    return this._currentRound.roundName;
  }

  private get leader(): Player {
    return this._players[this._leaderIndex];
  }

  constructor(host: User) {
    this._id = generateID();
    this._host = host;
    // this._stage = 'lobby';
  }

  sendUpdateToAllPlayers = (): void => {
    this._players.forEach(this.sendGameUpdate);
  };

  sendGameUpdate = (player: User): void => {
    const payload = this.generatePayload(player);
    player.send(payload);
  };

  generatePayload = (player: User): GameUpdateEvent => {
    const secretData = (this._currentRound && this._currentRound.getSecretData(player.id)) || null;
    const roundData = (this._currentRound && this._currentRound.getRoundData()) || null;
    console.log('this._currentRound:', this._currentRound);
    console.log('roundData:', roundData);
    return {
      event: 'gameUpdate',
      data: {
        gameID: this._id,
        round: this._round,
        stage: this._currentRound.roundName,
        playerID: player.id,
        hostName: this._host.name,
        isHost: this._host === player,
        leaderName: this.leader.name,
        isLeader: this.leader === player,
        players: this._players.map(p => ({ name: p.name })),
        roundData,
        secretData,
      },
    };
  };

  addPlayer(player: User, isHost = false): void {
    if (this.hasBegun) return;
    this._players.push(player);
    console.log('Players:', this._players.map(p => p.id).join(', '));
    if (isHost && !this._host) this._host = player;
    this.sendUpdateToAllPlayers();
  }

  beginGame = (characters: { [C in Character]?: boolean } = {}): void => {
    this._rules = RULES[this._players.length];
    const characterRound = new CharacterRound(this._players, this._rules);
    characterRound.allocateTeams();

    this._characterRound = characterRound;
    this._currentRound = characterRound;

    // this._stage = characterRound.roundName;
    this._players = shuffle(this._players);
    this.sendUpdateToAllPlayers();

    this._hasBegun = true;
    this._characters = characters;
  };

  confirmCharacter = (playerID: string): void => {
    // if (this.currentRound.roundName !== RoundName.characterAssignment)
    //   return console.error('CharacterRound not in Progress');
    if (!this._characterRound.isActive) return console.error('Character round already complete');
    this._characterRound.confirmCharacter(playerID);
    this.sendUpdateToAllPlayers();
  };

  // startRound = (roundNumber: number): void => {
  //   this._round = roundNumber;
  //   this.beginNominationRound(0);
  //   this.sendUpdateToAllPlayers();
  // };

  // beginNominationRound = (rejections: number) => {
  //   // if (rejections >= 5) this.badGuysWin()
  //   this._leaderIndex = (this._leaderIndex + 1) % this._players.length;
  //   this._stage = 'nominate';
  //   const roundData: RoundDataByName<'nominate'> = {
  //     roundName: 'nominate',
  //     leader: this._players[this._leaderIndex].name,
  //     nominatedPlayers: new Set(),
  //   };
  //   this._roundData = roundData;
  // };

  // isNominationRound = (round: RoundData): round is RoundDataByName<'nominate'> => {
  //   return round.roundName === 'nominate';
  // };

  // nominate = (playerID: User['id']): void => {
  //   const player = this.players.find(p => p.id === playerID);
  //   const roundData = this._roundData as RoundDataByName<'nominate'>;
  //   (roundData as RoundDataByName<'nominate'>).nominatedPlayers;
  //   if (this._roundData.nominatedPlayers.has(player)) return;
  //   this._roundData.nominatedPlayers.push(player);
  //   console.log('Nominated player with id', playerID);
  // };

  // undoNominate = (playerID: User['id']): void => {
  //   const player = this.players.find(p => p.id === playerID);
  //   if (!this._roundData.nominatedPlayers.includes(player)) return;
  //   this._roundData.nominatedPlayers.delete(player);
  //   console.log('Nominated player with id', playerID);
  // };

  // confirmCharacter = (playerID: string): void => {
  //   const player = this._players.find(p => p.id === playerID);
  //   if (!player) return console.error(`No player found with id ${playerID}`);
  //   player.hasConfirmedCharacter = true;
  //   const unconfirmedPlayers = this._players.filter(p => !p.hasConfirmedCharacter).map(p => p.name);
  //   this._roundData.unconfirmedPlayers = unconfirmedPlayers;
  //   this.sendUpdateToAllPlayers();
  //   if (unconfirmedPlayers.length === 0) this.startRound(1);
  // };
}
