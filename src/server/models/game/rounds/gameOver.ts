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
    this.unconfirmedPlayerIds = [...this.game.players.map((p) => p.userId)];
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
    // TODO store completed games somewhere?
    return 'lobby';
  };

  getRoundData = (): GameOverPublicData => {
    const gameResult = this.game.result;
    if (gameResult.type === 'ongoing') {
      throw new Error('Game result is set to ongoing during gameOver round');
    }
    const spyIds = this.game.players
      .filter((p) => p.allegiance === 'spies')
      .map((p) => p.userId);

    return {
      winners: gameResult.winners,
      spies: spyIds.map((id) => getUser(id).name),
      reason: gameResult.gameOverReason,
      fullHistory: this.game.history,
    };
  };

  getSecretData = (playerId: string): GameOverSecretData => ({
    allegiance: this.game.players.find((p) => p.userId === playerId).allegiance,
  });

  isFinal = (): boolean => {
    return true;
  };

  getUpdatedHistory = () => {
    return this.game.history;
  };
}
