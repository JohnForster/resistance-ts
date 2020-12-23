import { NominationRoundPublicData, RoundName } from '@shared/types/gameData';
import { NominationMessage } from '@shared/types/messages';

import { Rules } from '../../../data/gameRules';
import { Game } from '../newGame';
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
    const playerIDs = this.game.players.map((p) => p.id);
    if (!message.nominatedPlayerIDs.every(playerIDs.includes)) return;
    this.nominatedPlayerIDs = message.nominatedPlayerIDs;
  };

  validateMessage = ({ nominatedPlayerIDs }: NominationMessage): boolean =>
    Array.isArray(nominatedPlayerIDs) &&
    nominatedPlayerIDs.length === this.roundRules.players;

  isReadyToComplete = (): boolean => {
    return this.nominatedPlayerIDs.length === this.roundRules.players;
  };

  completeRound = (): RoundName => {
    return 'voting';
    // return 'nomination';
  };

  getRoundData = (): NominationRoundPublicData => ({
    leader: this.game.leader.name,
    playersToNominate: this.roundRules.players,
    failsRequired: this.roundRules.failsRequired,
  });

  getSecretData = (): {} => ({});

  isFinal = (): boolean => false;

  getUpdatedHistory: () => {};
}
