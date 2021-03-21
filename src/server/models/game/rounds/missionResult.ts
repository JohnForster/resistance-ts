import { Round } from '.';
import { Game } from '../game';
import {
  GameHistory,
  MissionResultPublicData,
  MissionResultSecretData,
  PlayerId,
  RoundName,
} from '@shared/types/gameData';
import { MissionResultMessage } from '@shared/types/messages';
import { getUser } from '../../user';

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
    const previousMissions = Object.values(this.game.history);
    const resistanceWins =
      previousMissions.filter((m) => m.success).length +
      (this.game.currentMission.success ? 1 : 0);
    const spyWins = this.game.currentMission.missionNumber - resistanceWins;

    if (resistanceWins > 2 || spyWins > 2) {
      this.game.result = {
        type: 'completed',
        winners: resistanceWins > spyWins ? 'resistance' : 'spies',
        gameOverReason: 'missions',
      };
      return 'gameOver';
    }

    return 'nomination';
  };

  getRoundData = (): MissionResultPublicData => {
    const votes = this.game.currentMission.votes;
    const success = votes.filter(({ succeed }) => succeed).length;
    const fail = votes.filter(({ succeed }) => !succeed).length;

    const data = {
      unconfirmedPlayerNames: this.game.players
        .filter(({ userID }) => !this.confirmedPlayers.has(userID))
        .map(({ userID }) => getUser(userID)?.name),
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

  // TODO Does the Game History change in any other round?
  getUpdatedHistory = (): GameHistory => ({
    ...this.game.history,
    [this.game.currentMission.missionNumber]: {
      ...this.game.currentMission,
      success: !!this.game.currentMission.success,
    },
  });
}
