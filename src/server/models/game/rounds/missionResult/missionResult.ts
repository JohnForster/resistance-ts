import { Round } from '../round';
import { Player } from '../../game';
import { MissionResultData, MissionResultSecretData } from '@shared/types/gameData';
import { RoundName } from '@server/types/enums';
import { Key } from 'readline';

export class MissionResult implements Round {
  roundName = RoundName.missionResult;
  private readonly _players: Player[];
  private readonly _confirmedPlayers: Set<Player>;
  private readonly _missionResults: { success: number; fail: number };

  public get everyoneHasConfirmed(): boolean {
    return this._players.every(p => this._confirmedPlayers.has(p));
  }

  public playerIsReady = (playerID: string): void => {
    const player = this._players.find(p => p.id === playerID);
    this._confirmedPlayers.add(player);
  };

  constructor(players: Player[], missionResults: { success: number; fail: number }) {
    this._players = players;
    this._confirmedPlayers = new Set();
    this._missionResults = missionResults;
  }

  getRoundData = (): MissionResultData => {
    const unconfirmedPlayers = this._players.filter(p => !this._confirmedPlayers.has(p)).map(p => p.name);
    console.log('unconfirmedPlayers:', unconfirmedPlayers);
    console.log('this._confirmedPlayers:', this._confirmedPlayers);
    return {
      missionResults: this._missionResults,
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
