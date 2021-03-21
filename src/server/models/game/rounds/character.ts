import {
  CharacterRoundPublicData,
  CharacterRoundSecretData,
  GameHistory,
  RoundName,
} from '../../../../shared/types/gameData';
import { CharacterMessage } from '../../../../shared/types/messages';
import { Round } from '.';
import { Game } from '../game';
import shuffle from 'lodash/shuffle';
import { getUser } from '../../user';

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
      .filter((p) => !this.confirmedPlayerIDs.has(p.userID))
      .map((p) => getUser(p.userID)?.name),
  });

  getSecretData = (userID: string): CharacterRoundSecretData => {
    const allegiance = this.game.players.find((p) => p.userID === userID)
      .allegiance;
    const spies =
      allegiance === 'spies'
        ? this.game.players
            .filter((p) => p.allegiance === 'spies')
            .map((p) => getUser(p.userID)?.name)
        : [];

    return {
      allegiance,
      spies,
    };
  };

  isFinal = (): boolean => true;

  getUpdatedHistory = (): GameHistory => ({ ...this.game.history });
}
