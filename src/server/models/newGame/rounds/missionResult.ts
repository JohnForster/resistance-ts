import { Round } from '.';
import { GameHistory, Game, PlayerId } from '../newGame';
import {
  MissionResultPublicData,
  MissionResultSecretData,
  RoundName,
} from '@shared/types/gameData';

export interface MissionResultMessage {
  playerId: PlayerId;
  confirm: boolean;
}

export class MissionResult implements Round<'missionResult'> {
  public roundName = 'missionResult' as const;
  public confirmedPlayers: Set<PlayerId> = new Set();

  constructor(private readonly game: Game) {}

  validateMessage = ({ confirm }: MissionResultMessage): boolean => {
    return confirm === true || confirm === false;
  };

  handleMessage = (message: MissionResultMessage): void => {
    this.confirmedPlayers.add(message.playerId);
  };

  isReadyToComplete = (): boolean =>
    this.confirmedPlayers.size === this.game.players.length;

  completeRound = (): RoundName => {
    return 'nomination';
  };

  getRoundData = (): MissionResultPublicData => {
    const votes = this.game.currentMission.nominations[
      this.game.currentMission.nominations.length - 1
    ].votes;
    const success = Array.from(votes.values()).filter((x) => x).length;
    const fail = Array.from(votes.values()).filter((x) => !x).length;

    return {
      unconfirmedPlayerNames: this.game.players
        .filter((p) => this.confirmedPlayers.has(p.id))
        .map(({ name }) => name),
      missionSucceeded: !!this.game.currentMission.success,
      // TODO Change just to an array of true/false values?
      missionResults: {
        success,
        fail,
      },
    };
  };

  getSecretData = (id: PlayerId): MissionResultSecretData => ({
    hasConfirmed: this.confirmedPlayers.has(id),
  });

  isFinal = (): boolean => true;

  getUpdatedHistory = (): GameHistory => ({
    ...this.game.history,
    [this.game.currentMission.missionNumber]: {
      ...this.game.currentMission,
      success: !!this.game.currentMission.success,
    },
  });
}
