import {
  Character,
  CharacterRoundPublicData,
  CharacterRoundSecretData,
  GameHistory,
  RoundName,
  Spy,
} from '../../../../shared/types/gameData';
import { CharacterMessage } from '../../../../shared/types/messages';
import { Round } from '.';
import { Game, Player } from '../game';
import shuffle from 'lodash/shuffle';
import { getUser } from '../../user';
import { spy } from '../../../utils/spy';

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

    game.log(
      'pack.length, players.length:',
      pack.length,
      this.game.players.length,
    );

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

  getVisibleSpies = (player: Player, spies: Player[]): string[] => {
    // Merlin sees all evil characters except Mordred
    if (player.character === 'Merlin') {
      return spies.map((p) =>
        p.character === 'Mordred' ? null : getUser(p.userID).name,
      );
    }

    // Oberon only sees himself
    if (player.character === 'Oberon') {
      return spies.map((p) =>
        p.userID === player.userID ? getUser(p.userID).name : null,
      );
    }

    // The spies see all other spies except Oberon
    if (player.allegiance === 'spies') {
      return spies.map((p) =>
        p.character === 'Oberon' ? null : getUser(p.userID).name,
      );
    }

    return spies.map((_) => null);
  };

  getSecretData = (userID: string): CharacterRoundSecretData => {
    const player = this.game.players.find((p) => p.userID === userID);
    const { allegiance, character } = player;

    const spies = this.game.players.filter((p) => p.allegiance === 'spies');

    const visibleSpies = this.getVisibleSpies(player, spies).map((name) =>
      spy(name),
    );

    const merlin =
      player.character === 'Percival'
        ? this.game.players
            .filter(
              (p) => p.character === 'Merlin' || p.character === 'Morgana',
            )
            .map((p) => getUser(p.userID).name)
        : [];

    return {
      allegiance,
      character,
      spies: visibleSpies,
      merlin,
    };
  };

  isFinal = (): boolean => true;

  getUpdatedHistory = (): GameHistory => ({ ...this.game.history });
}
