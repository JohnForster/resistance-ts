import { NominationRoundPublicData, RoundName } from '@shared/types/gameData';

import { Rules } from '../../../data/gameRules';
import { Game } from '../newGame';
import { Round } from './round';

interface NominationMessage {
  nominatedPlayerIds: string[];
}

export class NominationRound implements Round<'nomination'> {
  public roundName: 'nomination' = 'nomination';
  private roundRules: Rules['missions'][0];

  private nominatedPlayerIds: string[] = [];

  constructor(private readonly game: Game) {
    this.roundRules = this.game.rules.missions[
      this.game.currentMission.missionNumber
    ];
  }

  handleMessage = (message: NominationMessage): void => {
    const playerIds = this.game.players.map((p) => p.id);
    if (!message.nominatedPlayerIds.every(playerIds.includes)) return;
    this.nominatedPlayerIds = message.nominatedPlayerIds;
  };

  validateMessage = ({ nominatedPlayerIds }: NominationMessage): boolean =>
    Array.isArray(nominatedPlayerIds) &&
    nominatedPlayerIds.length === this.roundRules.players;

  isReadyToComplete = (): boolean => {
    return this.nominatedPlayerIds.length === this.roundRules.players;
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
