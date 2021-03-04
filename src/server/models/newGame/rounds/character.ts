// TODO Character round
import {
  CharacterRoundPublicData,
  CharacterRoundSecretData,
  RoundName,
} from '../../../../shared/types/gameData';
import { CharacterMessage } from '../../../../shared/types/messages';
import { Round } from '.';
import { Game, GameHistory } from '../newGame';
import shuffle from 'lodash/shuffle';
export class CharacterRound implements Round<'character'> {
  public roundName = 'character' as const;

  private confirmedPlayerIDs = new Set<string>();

  constructor(private readonly game: Game) {
    const { numberOfSpies } = game.rules;
    // const characters = game.characters
    const randomOrder = shuffle(
      new Array(game.players.length).fill(0).map((_, i) => i),
    );
    this.game.players = this.game.players.map((player, i) => ({
      ...player,
      allegiance: randomOrder[i] < numberOfSpies ? 'spies' : 'resistance',
    }));
  }

  handleMessage = (message: CharacterMessage): void => {
    this.confirmedPlayerIDs.add(message.playerID);
  };

  validateMessage = (message: CharacterMessage): boolean => !!message.playerID;

  isReadyToComplete = (): boolean =>
    this.confirmedPlayerIDs.size === this.game.players.length;

  completeRound = (): RoundName => {
    return 'nomination';
  };

  getRoundData = (): CharacterRoundPublicData => ({
    unconfirmedPlayerNames: this.game.players
      .filter((p) => this.confirmedPlayerIDs.has(p.id))
      .map((p) => p.name),
  });

  getSecretData = (userID: string): CharacterRoundSecretData => ({
    allegiance: this.game.players.find((p) => p.id === userID).allegiance,
  });

  isFinal = (): boolean => false;

  getUpdatedHistory = (): GameHistory => ({ ...this.game.history });
}