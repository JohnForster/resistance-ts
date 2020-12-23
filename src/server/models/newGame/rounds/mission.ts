import { Round } from '.';
import { GameHistory, Game, PlayerId, OngoingMission } from '../newGame';
import {
  RoundName,
  MissionRoundPublicData,
  MissionRoundSecretData,
} from '@shared/types/gameData';
import { MissionRoundMessage } from '@shared/types/messages';
export class MissionRound implements Round<'mission'> {
  public roundName = 'mission' as const;
  private missionVotes: Map<PlayerId, boolean> = new Map();

  get mission(): OngoingMission {
    return this.game.currentMission;
  }

  constructor(private readonly game: Game) {}

  handleMessage = (message: MissionRoundMessage): void => {
    this.missionVotes.set(message.playerID, message.succeedMission);
  };

  validateMessage = (message: MissionRoundMessage): boolean => {
    return !!this.mission.nominatedPlayers.find(
      (p) => p.id === message.playerID,
    );
  };

  isReadyToComplete = (): boolean =>
    this.missionVotes.size === this.mission.nominatedPlayers.length;

  completeRound = (): RoundName => {
    this.game.currentMission;
    return 'missionResult'; // TODO return next round data here in a tuple?
  };

  getRoundData = (): MissionRoundPublicData => ({
    nominatedPlayers: this.mission.nominatedPlayers.map(({ name, id }) => ({
      name,
      id,
    })),
    // playersLeftToVote: this.nominatedPlayers.length - this.missionVotes.size,
  });

  getSecretData = (playerID: string): MissionRoundSecretData => ({
    hasVoted: !!this.mission.nominatedPlayers.find((p) => p.id === playerID),
  });

  isFinal = (): boolean => false;

  getUpdatedHistory = (): GameHistory => ({ ...this.game.history });
}
