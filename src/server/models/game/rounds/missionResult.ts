import { Round } from '.';
import { GameHistory, Game, PlayerId } from '../game';
import {
  MissionResultPublicData,
  MissionResultSecretData,
  RoundName,
} from '@shared/types/gameData';
import { MissionResultMessage } from '@shared/types/messages';
import { storage } from '../../../storage/storage';

export class MissionResult implements Round<'missionResult'> {
  public roundName = 'missionResult' as const;
  public confirmedPlayers: Set<PlayerId> = new Set();

  constructor(private readonly game: Game) {}

  validateMessage = (message: MissionResultMessage): boolean => {
    return message.confirm === true || message.confirm === false;
  };

  handleMessage = (message: MissionResultMessage): void => {
    this.confirmedPlayers.add(message.playerID);
  };

  isReadyToComplete = (): boolean =>
    this.confirmedPlayers.size === this.game.players.length;

  completeRound = (): RoundName => {
    return 'nomination';
  };

  getRoundData = (): MissionResultPublicData => {
    const votes = this.game.currentMission.votes;
    const success = votes.filter(({ succeed }) => succeed).length;
    const fail = votes.filter(({ succeed }) => !succeed).length;

    const data = {
      unconfirmedPlayerNames: this.game.players
        .filter(({ userId }) => this.confirmedPlayers.has(userId))
        .map(({ userId }) => storage.users.get(userId)?.name),
      missionSucceeded: this.game.currentMission.success,
      missionResults: {
        success,
        fail,
      },
    };

    return data;
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
