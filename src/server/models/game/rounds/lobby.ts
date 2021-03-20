import { getUser } from '../../user';
import { GameHistory, RoundName } from '@shared/types/gameData';
import { LobbyMessage } from '@shared/types/messages';
import { Round } from '.';
import { Game } from '../game';

export class LobbyRound implements Round<'lobby'> {
  public roundName = 'lobby' as const;
  private gameReadyToBegin = false;

  constructor(private readonly game: Game) {}

  // For Reorder
  // checkIDsMatch = (playerIDs: string[]): boolean => {
  //   const gameIDs = this.game.players.map((p) => p.userId);
  //   return (
  //     !gameIDs.some((id) => !playerIDs.includes(id)) ||
  //     !playerIDs.some((id) => !gameIDs.includes(id))
  //   );
  // };

  handleMessage = (message: LobbyMessage): void => {
    if (message.type === 'startGame' && message.playerID === this.game.hostId) {
      this.gameReadyToBegin = true;
      return;
    }

    // TODO Reorder
    // if (message.type === 'reorder') {
    //   if (this.checkIDsMatch(message.newOrder)) {
    //     const newOrder = message.newOrder.map((id) =>
    //       this.game.players.find((p) => p.id === id),
    //     );
    //     this.game.players = newOrder;
    //   }
    // }

    // Leave game option?
  };

  validateMessage = (message: LobbyMessage): boolean => {
    return (
      (message.type === 'joinGame' && !!message.playerID) ||
      (message.type === 'startGame' && this.game.host.id === message.playerID)
    );
  };

  isReadyToComplete = (): boolean => this.gameReadyToBegin;

  completeRound = (): RoundName => {
    return 'character';
  };

  getRoundData = () => ({
    hostName: this.game.host.name,
    players: this.game.players.map(({ userId }) => getUser(userId)?.name),
  });

  getSecretData = () => ({});

  isFinal = (): boolean => false;

  getUpdatedHistory = (): GameHistory => ({ ...this.game.history });
}
