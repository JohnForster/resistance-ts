import { storage } from '../../../storage/storage';
import { RoundName } from '@shared/types/gameData';
import { VotingResultMessage } from '@shared/types/messages';
import { Round } from '.';
import { GameHistory, Game, PlayerId, Nomination } from '../game';
import { getUser } from '../../user';

export class VotingResult implements Round<'votingResult'> {
  public roundName = 'votingResult' as const;
  public confirmedPlayers: Set<PlayerId> = new Set();

  constructor(private readonly game: Game) {}

  get unconfirmedPlayerNames(): string[] {
    return this.game.players
      .filter(({ userId }) => !this.confirmedPlayers.has(userId))
      .map(({ userId }) => getUser(userId).name);
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
    if (this.nominationResult.succeeded) {
      this.game.currentMission = {
        ...this.game.currentMission,
        nominatedPlayerIds: [...this.nominationResult.nominatedPlayerIds],
      };

      return 'mission';
    }

    // TODO Check if this is game over? Or do this during voting round and send to a separate screen?
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

  // TODO add hasConfirmed to VotingResultData
  getSecretData = (userID: string) => ({
    hasConfirmed: this.confirmedPlayers.has(userID),
  });

  isFinal = (): boolean => false;

  getUpdatedHistory = (): GameHistory => ({ ...this.game.history });
}
