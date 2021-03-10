import {
  RoundName,
  VotingRoundPublicData,
  VotingRoundSecretData,
} from '@shared/types/gameData';

import { VotingMessage } from '@shared/types/messages';

import { Game, GameHistory, Nomination, Player } from '../game';
import { Round } from './round';

export class VotingRound implements Round<'voting'> {
  public roundName = 'voting' as const;

  public get unconfirmedPlayers(): Player[] {
    return this.game.players.filter((p) => !this.votes.has(p.id));
  }

  private readonly nominatedPlayers: Player[];
  private votes: Map<Player['id'], boolean> = new Map();

  constructor(private readonly game: Game) {
    const nominations = this.game.currentMission.nominations;
    this.nominatedPlayers =
      nominations[nominations.length - 1].nominatedPlayers;
  }

  handleMessage = ({ playerID, playerApproves }: VotingMessage): void => {
    this.votes.set(playerID, playerApproves);
  };

  validateMessage = ({ playerID, playerApproves }: VotingMessage): boolean => {
    return (
      !!this.game.players.find((p) => p.id === playerID) &&
      playerApproves != null
    );
  };

  isReadyToComplete = (): boolean =>
    this.votes.size === this.game.players.length;

  completeRound = (): RoundName => {
    const votesArray = Array.from(this.votes.values());
    const forVotes = votesArray.filter((x) => x).length;
    const againstVotes = votesArray.filter((x) => !x).length;

    const oldNominations = [...this.game.currentMission.nominations];
    const thisNomination: Nomination = {
      ...oldNominations.pop(),
      votes: this.votes,
      succeeded: forVotes > againstVotes,
    };

    this.game.currentMission = {
      ...this.game.currentMission,
      nominations: [...oldNominations, thisNomination],
    };

    this.game.votesRemaining -= 1;

    return 'votingResult';
  };

  getRoundData = (): VotingRoundPublicData => ({
    // TODO player order - who is nominating next
    unconfirmedPlayerNames: this.unconfirmedPlayers.map((p) => p.name),
    nominatedPlayers: this.nominatedPlayers.map((p) => ({
      name: p.name,
      id: p.id,
    })),
  });

  getSecretData = (playerID: string): VotingRoundSecretData => ({
    playerApproves: this.votes.get(playerID),
  });

  isFinal = (): boolean => false;

  getUpdatedHistory = (): GameHistory => ({ ...this.game.history });
}
