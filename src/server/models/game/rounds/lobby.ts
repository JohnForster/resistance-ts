import { getUser } from '../../user';
import { Character, GameHistory, RoundName } from 'shared';
import { LobbyMessage } from 'shared';
import { Round } from '.';
import { Game } from '../game';

export class LobbyRound implements Round<'lobby'> {
  public roundName = 'lobby' as const;
  private gameReadyToBegin = false;

  constructor(private readonly game: Game) {}

  // For Reorder
  // checkIDsMatch = (playerIDs: string[]): boolean => {
  //   const gameIDs = this.game.players.map((p) => p.userID);
  //   return (
  //     !gameIDs.some((id) => !playerIDs.includes(id)) ||
  //     !playerIDs.some((id) => !gameIDs.includes(id))
  //   );
  // };

  handleMessage = (message: LobbyMessage): void => {
    if (message.type === 'startGame' && message.playerID === this.game.hostId) {
      this.gameReadyToBegin = true;
      if (!this.validateCharacters(message.characters)) {
        return console.error(
          `Invalid characters sent: ${Object.entries(message.characters)
            .map(([char, bool]) => (bool ? char : undefined))
            .filter(Boolean)
            .join(', ')}`,
        );
      }

      this.game.characters = {
        ...message.characters,
        Assassin: message.characters.Merlin,
      };
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

  validateCharacters = (
    characters: { [key in Exclude<Character, 'Assassin'>]: boolean },
  ) => {
    if (characters.Mordred && !characters.Merlin) return false;
    if (characters.Percival && !characters.Merlin) return false;
    if (characters.Morgana && !characters.Percival) return false;

    const evilCharNames = ['Morgana', 'Mordred', 'Oberon'] as const;
    const numEvilChars = evilCharNames.filter((n) => characters[n]).length;

    // +1 to allow for the Assassin character
    if (numEvilChars + 1 > this.game.rules.numberOfSpies) return false;

    return true;
  };

  validateMessage = (message: LobbyMessage): boolean => {
    return (
      (message.type === 'joinGame' && !!message.playerID) ||
      (message.type === 'startGame' && this.game.host.id === message.playerID)
    );
  };

  isReadyToComplete = (): boolean => this.gameReadyToBegin;

  completeRound = (): RoundName => {
    this.game.randomiseLeader();
    return 'character';
  };

  getRoundData = () => ({
    hostName: this.game.host.name,
    players: this.game.players.map(({ userID }) => getUser(userID)?.name),
  });

  getSecretData = () => ({});

  isFinal = (): boolean => false;

  getUpdatedHistory = (): GameHistory => ({ ...this.game.history });
}
