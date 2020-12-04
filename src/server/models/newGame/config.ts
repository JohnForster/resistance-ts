import {
  MissionRound,
  NominationRound,
  RoundConstructor,
  RoundName,
  MissionResult,
  VotingRound,
} from './rounds';

// export const rounds: { [r in RoundName]: RoundConstructor } = {
export const rounds: Record<RoundName, RoundConstructor> = {
  // lobby: LobbyRound,
  // character: CharacterRound,
  nomination: NominationRound,
  voting: VotingRound,
  voteResult: MissionResult,
  mission: MissionRound,
  missionResult: MissionResult,
  // gameOver: GameOverRound,
};
