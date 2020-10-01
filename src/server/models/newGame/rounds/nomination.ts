import { NominationRoundData } from '@shared/types/gameData';

import { Rules } from '../../../data/gameRules';
import { Game } from '../newGame';
import { Round, RoundName } from './round';

interface NominationMessage {
  nominatedPlayerIds: string[];
}

interface NominationData {
  nominatedPlayerIds: string[];
}

export class NominationRound implements Round<NominationMessage> {
  public roundName: 'nomination' = 'nomination';
  private roundRules: Rules['missions'][0];

  private data: NominationData = { nominatedPlayerIds: [] };

  constructor(private readonly game: Game) {
    this.roundRules = this.game.rules.missions[this.game.missionNumber];
  }

  handleMessage = (message: NominationMessage): void => {
    const playerIds = this.game.players.map((p) => p.id);
    if (!message.nominatedPlayerIds.every(playerIds.includes)) return;
    this.data.nominatedPlayerIds = message.nominatedPlayerIds;
  };

  validateMessage = ({ nominatedPlayerIds }: NominationMessage): boolean =>
    Array.isArray(nominatedPlayerIds) && nominatedPlayerIds.length === this.roundRules.players;

  roundIsReadyToComplete = (): boolean => {
    return this.data.nominatedPlayerIds.length === this.roundRules.players;
  };

  completeRound = (): RoundName => {
    // return 'voting';
    return 'nomination';
  };

  getRoundData = (): NominationRoundData => ({
    roundName: 'nomination',
    leader: this.game.leader,
    playersToNominate: this.roundRules.players,
    failsRequired: this.roundRules.failsRequired,
  });

  getSecretData = (): {} => ({});

  isFinal = (): boolean => false;

  getHistory: () => {};
}
