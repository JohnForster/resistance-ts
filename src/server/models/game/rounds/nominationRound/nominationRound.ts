import { Rules } from '../../../../data/gameRules';
import { Round } from '../round';
import { NominationRoundData } from '@shared/types/gameData';
import { RoundName } from '@server/types/enums';
import { Player } from '../../game';

export class NominationRound implements Round {
  public readonly roundName = RoundName.nomination;
  public readonly nominationRoundNumber: number;
  public isActive = true;

  private readonly _players: Player[];
  private readonly _rules: Rules;
  private readonly _roundNumber: number;
  private _leaderIndex: number;

  public get leaderIndex(): number {
    return this._leaderIndex;
  }

  constructor(
    players: Player[],
    rules: Rules,
    roundNumber: number,
    leaderIndex: number,
    nominationRoundNumber: number,
  ) {
    this._players = players;
    this._rules = rules;
    this._roundNumber = roundNumber;
    this._leaderIndex = leaderIndex;
    this.nominationRoundNumber = nominationRoundNumber;
  }

  public getRoundData = (): NominationRoundData => ({
    roundName: RoundName.nomination,
    leader: this._players[this._leaderIndex].name,
    playersToNominate: this._rules.missions[this._roundNumber].players,
    failsRequired: this._rules.missions[this._roundNumber].failsRequired,
  });

  public getSecretData = (): null => null;
}
