import { Round } from '.';
import {
  GameHistory,
  Game,
  PlayerId,
  OngoingMission,
  CompletedMission,
} from '../game';
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
    const votes = [...this.missionVotes.entries()].map(
      ([playerID, succeed]) => ({
        playerID,
        succeed,
      }),
    );

    const numberOfFailVotes = votes.filter(({ succeed }) => !succeed).length;
    const votesRequiredToFail = this.game.rules.missions[
      this.mission.missionNumber
    ]?.failsRequired;

    if (votesRequiredToFail == null) {
      console.error(
        "Couldn't work out how many fails required for this mission",
      );
    }
    const updatedMission: CompletedMission = {
      ...this.game.currentMission,
      votes,
      success: numberOfFailVotes < votesRequiredToFail,
    };

    this.game.currentMission = updatedMission;
    return 'missionResult';
  };

  getRoundData = (): MissionRoundPublicData => ({
    nominatedPlayers: this.mission.nominatedPlayers.map(({ name, id }) => ({
      name,
      id,
    })),
    // TODO add playersLeftToVote
    // playersLeftToVote: this.nominatedPlayers.length - this.missionVotes.size,
  });

  getSecretData = (playerID: string): MissionRoundSecretData => ({
    hasVoted: !!this.mission.nominatedPlayers.find((p) => p.id === playerID),
  });

  isFinal = (): boolean => false;

  getUpdatedHistory = (): GameHistory => ({ ...this.game.history });
}
