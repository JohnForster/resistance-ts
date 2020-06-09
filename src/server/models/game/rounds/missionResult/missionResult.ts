import { Round } from '../round';
import { Player } from '../../game';
import { MissionResultData, MissionResultSecretData } from '@shared/types/gameData';
import { RoundName } from '@server/types/enums';
import { Rules } from '@server/data/gameRules';

export class MissionResult implements Round {
  public roundName = RoundName.missionResult;

  private readonly _confirmedPlayers: Set<Player>;

  public get everyoneHasConfirmed(): boolean {
    return this._players.every(p => this._confirmedPlayers.has(p));
  }

  public playerIsReady = (playerID: string): void => {
    const player = this._players.find(p => p.id === playerID);
    this._confirmedPlayers.add(player);
  };
  constructor(
    private readonly _players: Player[],
    private readonly _missionResults: { success: number; fail: number },
    private readonly _missionSucceeded: boolean,
  ) {
    console.log('Creating a MissionResult round...');
    this._confirmedPlayers = new Set();
  }

  getRoundData = (): MissionResultData => {
    const unconfirmedPlayerNames = this._players.filter(p => !this._confirmedPlayers.has(p)).map(p => p.name);
    return {
      roundName: this.roundName,
      missionResults: this._missionResults,
      missionSucceeded: this._missionSucceeded,
      unconfirmedPlayerNames,
    };
  };

  getSecretData = (playerID: string): MissionResultSecretData => {
    const player = this._players.find(p => p.id === playerID);
    return {
      hasConfirmed: this._confirmedPlayers.has(player),
    };
  };
}
