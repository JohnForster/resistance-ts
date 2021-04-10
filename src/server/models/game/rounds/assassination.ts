import {
  AssassinationRoundPublicData,
  AssassinationRoundSecretData,
  GameHistory,
  RoundName,
} from 'shared/types/gameData';
import { AssassinationMessage } from 'shared/types/messages';
import { Round } from '.';
import { Game } from '../game';
import { getUser } from '../../user';

export class AssassinationRound implements Round<'assassination'> {
  public roundName = 'assassination' as const;
  private assassinatedPlayerID = '';

  constructor(private readonly game: Game) {}

  isAssassin = (userID: string) => {
    const player = this.game.players.find((p) => p.userID === userID);
    const isAssassin = player?.character === 'Assassin';
    if (!isAssassin) {
      this.game.log(
        'Assassination message received from wrong player. userID:',
        userID,
      );
    }
    return isAssassin;
  };

  handleMessage = (message: AssassinationMessage): void => {
    this.assassinatedPlayerID = message.targetID;
  };

  validateMessage = (message: AssassinationMessage): boolean => {
    return (
      this.isAssassin(message.playerID) &&
      !!this.game.players.find((p) => p.userID === message.targetID)
    );
  };

  isReadyToComplete = (): boolean => !!this.assassinatedPlayerID;

  completeRound = (): RoundName => {
    const assassinationSuccessful =
      this.game.getPlayer(this.assassinatedPlayerID).character === 'Merlin';
    this.game.assassinatedPlayerID = this.assassinatedPlayerID;
    this.game.result = assassinationSuccessful
      ? {
          type: 'completed',
          winners: 'spies',
          gameOverReason: 'assassination',
        }
      : {
          type: 'completed',
          winners: 'resistance',
          gameOverReason: 'assassination',
        };
    return 'gameOver';
  };

  getRoundData = (): AssassinationRoundPublicData => ({
    spies: this.game.players
      .filter((p) => p.allegiance === 'spies')
      .map((p) => {
        const user = getUser(p.userID);
        return {
          id: user.id,
          name: user.name,
        };
      }),
    resistance: this.game.players
      .filter((p) => p.allegiance === 'resistance')
      .map((p) => {
        const user = getUser(p.userID);
        return {
          id: user.id,
          name: user.name,
        };
      }),
    assassin: getUser(
      this.game.players.find((p) => p.character === 'Assassin').userID,
    ).name,
  });

  getSecretData = (userID: string): AssassinationRoundSecretData => ({
    isAssassin: this.game.getPlayer(userID).character === 'Assassin',
  });

  isFinal = (): boolean => true;

  getUpdatedHistory = (): GameHistory => ({ ...this.game.history });
}
