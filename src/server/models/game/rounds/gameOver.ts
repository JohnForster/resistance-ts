import {
  GameOverPublicData,
  GameOverSecretData,
  RoundName,
} from '@shared/types/gameData';
import { GameOverMessage } from '@shared/types/messages';
import { getUser } from '../../user';

import { Game } from '../game';
import { Round } from './round';

export class GameOverRound implements Round<'gameOver'> {
  public roundName = 'gameOver' as const;
  private unconfirmedPlayerIds: string[];

  constructor(private readonly game: Game) {
    this.unconfirmedPlayerIds = [...this.game.players.map((p) => p.userID)];
  }

  handleMessage = (message: GameOverMessage): void => {
    this.game.removePlayer(message.playerID);
  };

  validateMessage = ({ confirm }: GameOverMessage): boolean => {
    return confirm === true;
  };

  isReadyToComplete = (): boolean => {
    return this.unconfirmedPlayerIds.length === 0;
  };

  completeRound = (): RoundName => {
    this.game.sendGameOverToAllPlayers();
    return 'lobby';
  };

  getRoundData = (): GameOverPublicData => {
    const gameResult = this.game.result;
    if (gameResult.type === 'ongoing') {
      throw new Error('Game result is set to ongoing during gameOver round');
    }

    if (gameResult.type === 'cancelled') {
      const cancelledBy = getUser(gameResult.cancelledBy).name;
      return {
        reason: 'cancelled',
        cancelledBy,
      };
    }

    const spyIds = this.game.players
      .filter((p) => p.allegiance === 'spies')
      .map((p) => p.userID);

    return {
      winners: gameResult.winners,
      spies: spyIds.map((id) => getUser(id).name),
      reason: gameResult.gameOverReason,
      fullHistory: this.game.history,
    };
  };

  getSecretData = (playerID: string): GameOverSecretData => ({
    allegiance: this.game.players.find((p) => p.userID === playerID).allegiance,
  });

  isFinal = (): boolean => {
    return true;
  };

  getUpdatedHistory = () => {
    return this.game.history;
  };
}
