import { RoundName } from '@shared/types/gameData';
import { VotingResultMessage } from '@shared/types/messages';
import { Round } from '.';
import { GameHistory, Game, PlayerId, Nomination } from '../game';

export class VotingResult implements Round<'votingResult'> {
  public roundName = 'votingResult' as const;
  public confirmedPlayers: Set<PlayerId> = new Set();

  constructor(private readonly game: Game) {}

  get unconfirmedPlayerNames(): string[] {
    return this.game.players
      .filter((p) => !this.confirmedPlayers.has(p.id))
      .map((p) => p.name);
  }

  get nominationResult(): Nomination {
    const missionSoFar = this.game.currentMission;
    const nomination =
      missionSoFar.nominations[missionSoFar.nominations.length - 1];
    return nomination;
  }

  handleMessage = (message: VotingResultMessage): void => {
    this.confirmedPlayers.add(message.playerID);
  };

  validateMessage = (message: VotingResultMessage): boolean =>
    message.confirm === true;

  isReadyToComplete = (): boolean =>
    this.confirmedPlayers.size === this.game.players.length;

  completeRound = (): RoundName => {
    return this.game.currentMission.success === true ? 'mission' : 'nomination';
    // TODO Check if this is game over? Or do this during voting round and send to a separate screen?
  };

  getRoundData = () => ({
    roundName: 'votingResult' as const,
    unconfirmedPlayerNames: this.unconfirmedPlayerNames,
    votes: Array.from(this.nominationResult.votes).map(([playerID, vote]) => ({
      id: playerID,
      playerApproves: vote,
      name: this.game.getPlayer(playerID)?.name,
    })), // ? Do we need to send other player ids... ever?
    voteSucceeded: this.nominationResult.succeeded,
    votesRemaining: this.game.votesRemaining,
  });

  // TODO add hasConfirmed to VotingResultData
  getSecretData = (userID: string) => ({
    hasConfirmed: this.confirmedPlayers.has(userID),
  });

  isFinal = (): boolean => false;

  getUpdatedHistory = (): GameHistory => ({ ...this.game.history });
}
