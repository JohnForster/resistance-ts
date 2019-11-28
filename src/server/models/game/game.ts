import shuffle from 'lodash.shuffle';

import User from '../user';
import generateID from '@server/utils/generateID';
import { EventByName } from '@shared/types/eventTypes';
// import { GameData, RoundData, RoundDataByName } from '@shared/types/gameData.d';
import RULES, { Rules } from '@server/data/gameRules';
// import CharacterRound from './rounds/characterRound/characterRound';
// import Round from './rounds/round';
import { Round, Lobby, CharacterRound, NominationRound, VotingRound } from './rounds/index';
import typeGuard from '@server/utils/typeGuard';
import { EventType, Character, RoundName } from '@server/types/enums';
type Character = typeof Character[keyof typeof Character];
type RoundName = typeof RoundName[keyof typeof RoundName];

export interface Player extends User {
  allegiance?: 'resistance' | 'spies';
  character?: Character;
  hasConfirmedCharacter?: boolean;
  isLeader?: boolean;
}

// TODO separate stages into separate classes?
export default class Game {
  private _id: string;
  private _players: Player[] = [];
  private _hasBegun = false;
  private _host: User;
  // private _spies: Player[] = [];
  // private _resistance: Player[] = [];
  private _missionNumber = 0;
  // private _roundData: RoundData = {};
  // private _stage: RoundName = 'lobby';
  private _leaderIndex = 0;
  private _rules: Rules;

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
    this._currentRound = new Lobby(this._players);
  }

  sendUpdateToAllPlayers = (): void => {
    this._players.forEach(this.sendGameUpdate);
  };

  sendGameUpdate = (player: User): void => {
    const payload = this.generatePayload(player);
    player.send(payload);
  };

  generatePayload = (player: User): EventByName<typeof EventType.gameUpdate> => {
    const secretData = (this._currentRound && this._currentRound.getSecretData(player.id)) || null;
    const roundData = (this._currentRound && this._currentRound.getRoundData()) || null;
    return {
      event: EventType.gameUpdate,
      data: {
        gameID: this._id,
        // TODO replace this._round with this._currentRound.roundNumber? Or store in roundData?
        missionNumber: this._missionNumber,
        stage: this._currentRound.roundName,
        playerID: player.id,
        hostName: this._host.name,
        isHost: this._host === player,
        leaderName: this.leader.name,
        isLeader: this.leader === player,
        players: this._players.map(p => ({ name: p.name, id: p.id })),
        roundData,
        secretData,
      },
    };
  };

  isRound = <T extends Round>(round: Round): round is T => {
    return round.roundName === name;
  };

  addPlayer = (player: User, isHost = false): void => {
    if (!typeGuard(this._currentRound, Lobby)) throw new Error('Lobby is closed');
    this._currentRound.addPlayer(player, isHost);
    if (isHost && !this._host) this._host = player;
    this.sendUpdateToAllPlayers();
  };

  beginGame = (characters: { [C in Character]?: boolean } = {}): void => {
    this._rules = RULES[this._players.length];
    const characterRound = new CharacterRound(this._players, this._rules);
    characterRound.allocateTeams();

    this._currentRound = characterRound;

    // this._stage = characterRound.roundName;
    this._players = shuffle(this._players);
    this.sendUpdateToAllPlayers();

    this._hasBegun = true;
    this._characters = characters;
  };

  incrementLeaderIndex = (): void => {
    this._leaderIndex = (this._leaderIndex + 1) % this._players.length;
  };

  confirmCharacter = (playerID: string): void => {
    if (!typeGuard(this._currentRound, CharacterRound)) {
      throw new Error('Cannot confirm player outside of character round');
    }
    // if (this.currentRound.roundName !== RoundName.characterAssignment)
    //   return console.error('CharacterRound not in Progress');
    // if (!this._currentRound.isActive) return console.error('Character round already complete');
    this._currentRound.confirmCharacter(playerID);
    this.sendUpdateToAllPlayers();
    if (this._currentRound.isReadyToStart) this.startRound(1);
  };

  startRound = (roundNumber: number): void => {
    console.log('Starting round', roundNumber);
    const nominationRound = new NominationRound(this._players, this._rules, roundNumber, this._leaderIndex);
    this._currentRound = nominationRound;
    this._missionNumber = roundNumber;
    // nominationRound.beginNominations(0);
    this.sendUpdateToAllPlayers();
  };

  nominate = (nominatedPlayerIDs: string[]): void => {
    if (!typeGuard(this._currentRound, NominationRound)) {
      throw new Error('Cannot nominate players outside of nomination round');
    }
    console.log('Nominated player ids:', ...nominatedPlayerIDs);
    // TODO Check players are in this game?
    // TODO Check the right number of players are nominated etc.
    // ! Hard coded value here
    const votingRoundNumber = 1;
    this._currentRound = new VotingRound(this._players, this._rules, votingRoundNumber, nominatedPlayerIDs);
    this.sendUpdateToAllPlayers();
  };

  vote = (playerID: string, approves: boolean): void => {
    if (!typeGuard(this._currentRound, VotingRound)) {
      throw new Error('Cannot vote outside of voting round');
    }
    this._currentRound.vote(playerID, approves);
    this.sendUpdateToAllPlayers();
    if (!this._currentRound.hasVoteCompleted) return;
    this._currentRound.countVotes();
    this.sendUpdateToAllPlayers();
    if (this._currentRound.voteSucceded) {
      // this._currentRound = new MissionRound();
    }
    if (!this._currentRound.voteSucceded) {
      this.incrementLeaderIndex();
      this.startRound(this._missionNumber);
    }
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
