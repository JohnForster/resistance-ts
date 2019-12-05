import { Rules } from '../../../../data/gameRules';
import { Round } from '../round';
import { MissionRoundData, MissionRoundSecretData } from '@shared/types/gameData';
import { RoundName } from '@server/types/enums';
import { Player } from '../../game';
import { ENGINE_METHOD_DIGESTS } from 'constants';

export class MissionRound implements Round {
  public readonly roundName = RoundName.mission;
  public isActive = true;

  private readonly _players: Player[];
  private readonly _rules: Rules;
  private readonly _missionNumber: number;
  private _leaderIndex: number;
  private _nominatedPlayers: Player[];
  private _votes: Map<Player['id'], boolean> = new Map();
  private _readyPlayers: Set<Player> = new Set();

  public get leaderIndex(): number {
    return this._leaderIndex;
  }

  public get allVotes(): { success: number; fail: number } {
    if (this._votes.size !== this._nominatedPlayers.length) return null;
    const votesArray = Array.from(this._votes);
    return {
      success: votesArray.filter(([, isSuccessVote]) => isSuccessVote).length,
      fail: votesArray.filter(([, isSuccessVote]) => !isSuccessVote).length,
    };
  }

  public get isMissionOver(): boolean {
    if (this._votes.size > this._players.length) throw new Error('WTF');
    return this._votes.size === this._players.length;
  }
  public playerIsReady = (playerID: string): void => {
    const player = this._players.find(p => p.id === playerID);
    if (!player) return console.error(`player with id: ${playerID} is not a part of this game`);
    this._readyPlayers.add(player);
  };

  public get areAllPlayersReady(): boolean {
    return this._readyPlayers.size === this._players.length;
  }

  constructor(players: Player[], rules: Rules, missionNumber: number, nominatedPlayers: Player[]) {
    this._players = players;
    console.log('this._players:', this._players);
    this._rules = rules;
    this._missionNumber = missionNumber;
    this._nominatedPlayers = nominatedPlayers;
  }

  public getRoundData = (): MissionRoundData => {
    console.log('inside getRoundData. this._players:', this._players);
    return {
      roundName: RoundName.mission,
      nominatedPlayers: this._nominatedPlayers.map(({ name, id }) => ({ name, id })),
      unconfirmedPlayers: this._players.filter(p => this._readyPlayers.has(p)).map(p => p.name),
    };
  };

  public getSecretData = (playerID: string): MissionRoundSecretData => ({
    hasVoted: this._votes.has(playerID),
  });

  public confirmVote = (playerID: string, isSuccessVote: boolean): void => {
    if (!this._players.find(p => p.id === playerID)) {
      return console.error(`Player ${playerID} cannot vote this mission.`);
    }
    this._votes.set(playerID, isSuccessVote);
  };
}
