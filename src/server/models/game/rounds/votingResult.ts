import { GameHistory, Nomination, PlayerId, RoundName } from 'shared';
import { VotingResultMessage } from 'shared';
import { Round } from '.';
import { Game } from '../game';
import { getUser } from '../../user';

export class VotingResult implements Round<'votingResult'> {
  public roundName = 'votingResult' as const;
  public confirmedPlayers: Set<PlayerId> = new Set();

  constructor(private readonly game: Game) {}

  get unconfirmedPlayerNames(): string[] {
    return this.game.players
      .filter(({ userID }) => !this.confirmedPlayers.has(userID))
      .map(({ userID }) => getUser(userID).name);
  }

  get nominationResult(): Nomination {
    const missionSoFar = this.game.currentMission;
    const nomination =
      missionSoFar.nominations[missionSoFar.nominations.length - 1];
    return nomination;
  }

  handleMessage = (message: VotingResultMessage): void => {
    this.confirmedPlayers.add(message.playerID);
    if (!this.game.timer.hasStarted && this.confirmedPlayers.size >= this.game.players.length * 2/3) {
      this.game.startTimer(this.roundName)
    }
  };

  validateMessage = (message: VotingResultMessage): boolean =>
    message.confirm === true;

  isReadyToComplete = (): boolean =>
    this.confirmedPlayers.size === this.game.players.length;

  completeRound = (): RoundName => {
    this.game.advanceLeader();

    if (this.nominationResult.succeeded) {
      this.game.currentMission = {
        ...this.game.currentMission,
        nominatedPlayerIds: [...this.nominationResult.nominatedPlayerIds],
      };

      return 'mission';
    }

    if (this.game.votesRemaining === 0) {
      this.game.result = {
        type: 'completed',
        winners: 'spies',
        gameOverReason: 'nominations',
      };
      return 'gameOver';
    }

    return 'nomination';
  };

  getRoundData = () => ({
    roundName: 'votingResult' as const,
    unconfirmedPlayerNames: this.unconfirmedPlayerNames,
    votes: Array.from(this.nominationResult.votes).map(([playerID, vote]) => ({
      id: playerID,
      playerApproves: vote,
      name: getUser(playerID)?.name,
    })), // ? Do we need to send other player ids... ever?
    voteSucceeded: this.nominationResult.succeeded,
    votesRemaining: this.game.votesRemaining,
  });

  getSecretData = (userID: string) => ({
    hasConfirmed: this.confirmedPlayers.has(userID),
  });

  isFinal = (): boolean => false;

  getUpdatedHistory = (): GameHistory => ({ ...this.game.history });
}
