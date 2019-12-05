import { Round } from '../round';
import { Player } from '../../game';
import { MissionResultData, MissionResultSecretData } from '@shared/types/gameData';
import { RoundName } from '@server/types/enums';

export class MissionResult implements Round {
  roundName = RoundName.missionResult;
  private readonly _players: Player[];
  private readonly _confirmedPlayers: Set<Player>;
  private readonly _missionSucceeded: boolean;

  public get everyoneHasConfirmed(): boolean {
    return this._players.every(p => this._confirmedPlayers.has(p));
  }

  public playerIsReady = (playerID: string): void => {
    const player = this._players.find(p => p.id === playerID);
    this._confirmedPlayers.add(player);
  };

  constructor(players: Player[], missionSucceeded: boolean) {
    this._players = players;
    this._confirmedPlayers = new Set();
    this._missionSucceeded = missionSucceeded;
  }

  getRoundData = (): MissionResultData => {
    const unconfirmedPlayers = this._players.filter(p => !this._confirmedPlayers.has(p)).map(p => p.name);
    return {
      missionSucceeded: this._missionSucceeded,
      unconfirmedPlayers,
    };
  };

  getSecretData = (playerID: string): MissionResultSecretData => {
    const player = this._players.find(p => p.id === playerID);
    return {
      hasConfirmed: this._confirmedPlayers.has(player),
    };
  };
}
