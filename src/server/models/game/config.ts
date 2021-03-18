import { RoundName } from '@shared/types/gameData';
import {
  MissionRound,
  NominationRound,
  RoundConstructor,
  MissionResult,
  VotingRound,
  LobbyRound,
  CharacterRound,
  VotingResult,
} from './rounds';

// export const rounds: { [r in RoundName]: RoundConstructor } = {
export const rounds: Record<RoundName, RoundConstructor> = {
  lobby: LobbyRound,
  character: CharacterRound,
  nomination: NominationRound,
  voting: VotingRound,
  votingResult: VotingResult,
  mission: MissionRound,
  missionResult: MissionResult,
  // gameOver: GameOverRound,
};
