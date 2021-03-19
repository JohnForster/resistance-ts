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
import { getUser } from '../../user';
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
    return !!this.mission.nominatedPlayerIds.find(
      (id) => id === message.playerID,
    );
  };

  isReadyToComplete = (): boolean =>
    this.missionVotes.size === this.mission.nominatedPlayerIds.length;

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
    nominatedPlayers: this.mission.nominatedPlayerIds.map((id) => ({
      name: getUser(id)?.name,
      id,
    })),
    // TODO add playersLeftToVote
    // playersLeftToVote: this.nominatedPlayers.length - this.missionVotes.size,
  });

  getSecretData = (playerID: string): MissionRoundSecretData => ({
    votedToSucceed: this.missionVotes.get(playerID),
  });

  isFinal = (): boolean => false;

  getUpdatedHistory = (): GameHistory => ({ ...this.game.history });
}
