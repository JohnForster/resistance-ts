import {
  Character,
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
import { getCharacterInfo } from '../../../utils/getCharacterInfo';

type CharacterCard = ['spies' | 'resistance', Character | null];

export class CharacterRound implements Round<'character'> {
  public roundName = 'character' as const;

  private confirmedPlayerIDs = new Set<string>();

  constructor(private readonly game: Game) {
    const { numberOfSpies, numberOfResistance } = game.rules;

    const evilCharacterCards: CharacterCard[] = ([
      'Assassin',
      'Morgana',
      'Oberon',
      'Mordred',
    ] as const)
      .filter((n) => game.characters[n])
      .map((char) => ['spies', char]);

    const goodCharacterCards: CharacterCard[] = ([
      'Merlin',
      'Percival',
    ] as const)
      .filter((n) => game.characters[n])
      .map((char) => ['resistance', char]);

    const genericGoodCards: CharacterCard[] = new Array(
      numberOfResistance - goodCharacterCards.length,
    ).fill(['resistance', null]);

    const genericEvilCards: CharacterCard[] = new Array(
      numberOfSpies - evilCharacterCards.length,
    ).fill(['spies', null]);

    const pack: CharacterCard[] = shuffle([
      ...goodCharacterCards,
      ...genericGoodCards,
      ...evilCharacterCards,
      ...genericEvilCards,
    ]);

    this.game.players = this.game.players.map((player, i) => ({
      ...player,
      allegiance: pack[i][0],
      character: pack[i][1],
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
    const characterInfo = getCharacterInfo(this.game.players, userID);
    if (!characterInfo)
      throw new Error(
        `No character information found for user with ID ${userID}`,
      );
    return characterInfo;
  };

  isFinal = (): boolean => true;

  getUpdatedHistory = (): GameHistory => ({ ...this.game.history });
}
