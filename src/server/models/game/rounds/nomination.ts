import { NominationRoundPublicData, RoundName } from '@shared/types/gameData';
import { NominationMessage } from '@shared/types/messages';

import { Rules } from '../../../data/gameRules';
import { Game } from '../game';
import { Round } from './round';

export class NominationRound implements Round<'nomination'> {
  public roundName: 'nomination' = 'nomination';
  private roundRules: Rules['missions'][0];

  private nominatedPlayerIDs: string[] = [];

  constructor(private readonly game: Game) {
    console.log('this.game.currentMission:', this.game.currentMission);
    console.log('missionNumber:', this.game.currentMission.missionNumber);

    this.roundRules = this.game.rules.missions[
      this.game.currentMission.missionNumber
    ];
  }

  handleMessage = (message: NominationMessage): void => {
    const playerIDs = this.game.players.map((p) => p.id);
    console.log('playerIDs:', playerIDs);
    console.log('nomination message:', message);
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
    const nominatedPlayers = this.game.players.filter((p) =>
      this.nominatedPlayerIDs.includes(p.id),
    );

    if (nominatedPlayers.length !== this.nominatedPlayerIDs.length) {
      console.error("Couldn't find all nominated players.");
    }

    const nomination = {
      leader: this.game.leader,
      nominatedPlayers,
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
