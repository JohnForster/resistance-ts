import { Rules } from '../../../../data/gameRules';
import { Round } from '../round';
import { RoundName, NominationRoundData } from '@shared/types/gameData';
import { Player } from '../../game';

export class NominationRound implements Round {
  public readonly roundName = RoundName.nomination;
  public isActive = true;

  private readonly _players: Player[];
  private readonly _rules: Rules;
  private readonly _roundNumber: number;
  private _leaderIndex: number;

  public get leaderIndex(): number {
    return this._leaderIndex;
  }

  constructor(players: Player[], rules: Rules, roundNumber: number, leaderIndex: number) {
    this._players = players;
    this._rules = rules;
    this._roundNumber = roundNumber;
    this._leaderIndex = leaderIndex;
  }

  public getRoundData = (): NominationRoundData => ({
    leader: this._players[this._leaderIndex].name,
    playersToNominate: this._rules.missions[this._roundNumber].players,
    failsRequired: this._rules.missions[this._roundNumber].failsRequired,
  });

  public getSecretData = (): null => null;
}
