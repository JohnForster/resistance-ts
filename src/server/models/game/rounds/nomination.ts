import { NominationRoundPublicData, RoundName } from 'shared';
import { NominationMessage } from 'shared';

import { Rules } from '../../../data/gameRules';
import { Game } from '../game';
import { Round } from './round';

export class NominationRound implements Round<'nomination'> {
  public roundName: 'nomination' = 'nomination';
  private roundRules: Rules['missions'][0];

  private nominatedPlayerIDs: string[] = [];

  constructor(private readonly game: Game) {
    this.roundRules = this.game.rules.missions[
      this.game.currentMission.missionNumber
    ];
  }

  handleMessage = (message: NominationMessage): void => {
    const playerIDs = this.game.players.map((p) => p.userID);
    if (!message.nominatedPlayerIDs.every((name) => playerIDs.includes(name)))
      return console.error(
        'Not all nominated players are part of this game.\n  nominatedPlayerIds:',
        message.nominatedPlayerIDs,
        '\n  playerIDs:',
        playerIDs,
      );
    this.nominatedPlayerIDs = message.nominatedPlayerIDs;
  };

  validateMessage = ({ nominatedPlayerIDs }: NominationMessage): boolean =>
    Array.isArray(nominatedPlayerIDs) &&
    nominatedPlayerIDs.length === this.roundRules.players;

  isReadyToComplete = (): boolean => {
    return this.nominatedPlayerIDs.length === this.roundRules.players;
  };

  completeRound = (): RoundName => {
    const nominatedPlayerIds = this.game.players
      .filter((p) => this.nominatedPlayerIDs.includes(p.userID))
      .map((p) => p.userID);

    if (nominatedPlayerIds.length !== this.nominatedPlayerIDs.length) {
      console.error("Couldn't find all nominated players.");
    }

    const nomination = {
      leaderId: this.game.leader.id,
      nominatedPlayerIds,
      votes: new Map<string, boolean>(),
    };

    this.game.currentMission.nominations.push(nomination);

    return 'voting';
  };

  getRoundData = (): NominationRoundPublicData => ({
    leader: this.game.leader.name,
    playersToNominate: this.roundRules.players,
    failsRequired: this.roundRules.failsRequired,
  });

  getSecretData = (): {} => ({});

  isFinal = (): boolean => false;

  getUpdatedHistory = () => ({ ...this.game.history });
}
