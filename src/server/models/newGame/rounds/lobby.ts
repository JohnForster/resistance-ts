import { RoundName } from '@shared/types/gameData';
import { Round } from '.';
import { Game, GameHistory } from '../newGame';

export type LobbyMessage =
  | {
      type: 'joinGame';
      playerId: string;
    }
  | {
      type: 'startGame';
      playerId: string;
    }
  | {
      type: 'reorder';
      playerId: string;
      newOrder: string[];
    };

export class LobbyRound implements Round<'lobby'> {
  public roundName = 'lobby' as const;
  private gameReadyToBegin = false;

  constructor(private readonly game: Game) {}

  checkIdsMatch = (playerIds: string[]): boolean => {
    const gameIds = this.game.players.map((p) => p.id);
    return (
      !gameIds.some((id) => !playerIds.includes(id)) ||
      !playerIds.some((id) => !gameIds.includes(id))
    );
  };

  handleMessage = (message: LobbyMessage): void => {
    if (message.type === 'startGame') {
      this.gameReadyToBegin === true;
      return;
    }

    if (message.type === 'reorder') {
      if (this.checkIdsMatch(message.newOrder)) {
        const newOrder = message.newOrder.map((id) =>
          this.game.players.find((p) => p.id === id),
        );
        this.game.players = newOrder;
      }
    }

    // Leave game option?
  };

  validateMessage = (message: LobbyMessage): boolean => {
    return (
      (message.type === 'joinGame' && !!message.playerId) ||
      (message.type === 'startGame' && this.game.host.id === message.playerId)
    );
  };

  isReadyToComplete = (): boolean => this.gameReadyToBegin;

  completeRound = (): RoundName => {
    return 'nomination';
  };

  getRoundData = () => ({
    hostName: this.game.host.name,
    players: this.game.players.map((p) => p.name),
  });

  getSecretData = () => ({});

  isFinal = (): boolean => false;

  getUpdatedHistory = (): GameHistory => ({ ...this.game.history });
}
