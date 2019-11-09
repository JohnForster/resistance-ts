import { Rules } from '../../../../data/gameRules';
import Round from '../round';
import { RoundName } from '../../../../../shared/types/gameData';
import { Player } from '../../game';

export default class NominationRound implements Round {
  public roundName = RoundName.nomination;
  public isActive = true;

  private readonly _players: Player[];
  private readonly _rules: Rules;

  public getRoundData = (): null => null;

  public getSecretData = (): null => null;

  constructor(players: Player[], rules: Rules) {
    this._players = players;
    this._rules = rules;
  }
}
