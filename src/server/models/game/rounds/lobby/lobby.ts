import { Rules } from '@server/data/gameRules';
import { Round } from '../round';
import { RoundName } from '@shared/types/gameData';
import { Player } from '../../game';
import User from '../../../user';

export class Lobby implements Round {
  public roundName = RoundName.lobby;
  public isActive = true;

  private readonly _players: Player[];
  private readonly _rules: Rules;

  public getRoundData = (): null => null;

  public getSecretData = (): null => null;

  constructor(players: Player[]) {
    this._players = players;
  }

  addPlayer(player: User, isHost = false): void {
    this._players.push(player);
    console.log('Players:', this._players.map(p => p.id).join(', '));
  }
}
