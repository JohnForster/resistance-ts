import { RoundName } from '@shared/types/gameData';
import {
  MissionRound,
  NominationRound,
  RoundConstructor,
  MissionResult,
  VotingRound,
  LobbyRound,
  CharacterRound,
} from './rounds';

// export const rounds: { [r in RoundName]: RoundConstructor } = {
export const rounds: Record<RoundName, RoundConstructor> = {
  lobby: LobbyRound,
  character: CharacterRound,
  nomination: NominationRound,
  voting: VotingRound,
  votingResult: MissionResult,
  mission: MissionRound,
  missionResult: MissionResult,
  // gameOver: GameOverRound,
};
