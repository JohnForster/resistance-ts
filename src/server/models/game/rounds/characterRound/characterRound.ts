import { Player } from '../../game';
import { Rules, Character } from '../../../../data/gameRules';
import { shuffle } from 'lodash';
import { CharacterRoundData, CharacterSecretData, RoundName } from '../../../../../shared/types/gameData';
import { Round } from '../round';

interface Teams {
  spies: Player[];
  resistance: Player[];
}

export class CharacterRound implements Round {
  public readonly roundName = RoundName.characterAssignment;
  public isActive = true;

  private readonly players: Player[];
  private readonly rules: Rules;
  private _roundData: CharacterRoundData;

  public get isReadyToStart(): boolean {
    return this._roundData.unconfirmedPlayerNames.length === 0;
  }

  public getRoundData = (): CharacterRoundData => {
    return this._roundData;
  };

  constructor(players: Player[], rules: Rules) {
    this.players = players;
    this.rules = rules;
    this._roundData = { unconfirmedPlayerNames: players.map(p => p.name) };
  }

  // allocateTeams = (characters: Set<Character> = new Set()): void => {
  allocateTeams = (/* characters: { [C in Character]?: boolean } = {} */): void => {
    const remainingPlayers = shuffle([...this.players]);
    const numberOfSpies = this.rules.numberOfSpies;

    remainingPlayers.forEach((player, i) => {
      const allegiance = i < numberOfSpies ? 'spies' : 'resistance';
      player.allegiance = allegiance;
    });

    // Handle special characters
    // if (characters.has(Character.Merlin)) remainingPlayers[remainingPlayers.length - 1].character = Character.Merlin;
    // if (characters.merlin) remainingPlayers[remainingPlayers.length - 1].character = Character.Merlin;

    this.endRound();
  };

  confirmCharacter = (playerID: string): void => {
    const player = this.players.find(p => p.id === playerID);
    if (!player) return console.error(`No player found with id ${playerID}`);
    player.hasConfirmedCharacter = true;
    const unconfirmedPlayers = this.players.filter(p => !p.hasConfirmedCharacter).map(p => p.name);
    this._roundData.unconfirmedPlayerNames = unconfirmedPlayers;
  };

  getSecretData = (playerID: string): CharacterSecretData => {
    const player = this.players.find(p => p.id === playerID);
    const spies = this.players.filter(p => p.allegiance === 'spies');
    if (player.allegiance === 'spies') {
      return {
        allegiance: 'spies',
        spies: spies.map(p => p.name),
      };
    }
    return { allegiance: 'resistance' };
  };

  endRound = (): void => {
    this.isActive = false;
  };
}
