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
    this._rules = rules;
    this._missionNumber = missionNumber;
    this._nominatedPlayers = nominatedPlayers;
  }

  public getRoundData = (): MissionRoundData => ({
    roundName: RoundName.mission,
    nominatedPlayers: this._nominatedPlayers.map(({ name, id }) => ({ name, id })),
    unconfirmedPlayers: this._players.filter(this._readyPlayers.has).map(p => p.name),
  });

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
