import { Round, RoundName } from '.';
import { GameHistory, Game, PlayerId, OngoingMission } from '../newGame';
import {
  MissionRoundData,
  MissionRoundSecretData,
} from '../../../../shared/types/gameData';

export interface MissionRoundMessage {
  playerId: PlayerId;
  succeedMission: true;
}

export class MissionRound implements Round<MissionRoundMessage> {
  public roundName = 'mission' as const;
  private missionVotes: Map<PlayerId, boolean> = new Map();

  get mission(): OngoingMission {
    return this.game.currentMission;
  }

  constructor(private readonly game: Game) {}

  handleMessage = (message: MissionRoundMessage): void => {
    this.missionVotes.set(message.playerId, message.succeedMission);
  };

  validateMessage = (message: MissionRoundMessage): boolean => {
    return !!this.mission.nominatedPlayers.find(
      (p) => p.id === message.playerId,
    );
  };

  isReadyToComplete = (): boolean =>
    this.missionVotes.size === this.mission.nominatedPlayers.length;

  completeRound = (): RoundName => {
    this.game.currentMission;
    return 'missionResult'; // TODO return next round data here in a tuple?
  };

  getRoundData = (): MissionRoundData => ({
    roundName: 'mission',
    nominatedPlayers: this.mission.nominatedPlayers.map(({ name, id }) => ({
      name,
      id,
    })),
    // playersLeftToVote: this.nominatedPlayers.length - this.missionVotes.size,
  });

  getSecretData = (playerId: string): MissionRoundSecretData => ({
    hasVoted: !!this.mission.nominatedPlayers.find((p) => p.id === playerId),
  });

  isFinal = (): boolean => false;

  getUpdatedHistory = (): GameHistory => ({ ...this.game.history });
}
