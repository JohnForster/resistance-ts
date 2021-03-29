import { RoundName } from 'shared';
import {
  MissionRound,
  NominationRound,
  RoundConstructor,
  MissionResult,
  VotingRound,
  LobbyRound,
  CharacterRound,
  VotingResult,
  GameOverRound,
} from './rounds';

export const rounds: { [r in RoundName]: RoundConstructor } = {
  lobby: LobbyRound,
  character: CharacterRound,
  nomination: NominationRound,
  voting: VotingRound,
  votingResult: VotingResult,
  mission: MissionRound,
  missionResult: MissionResult,
  gameOver: GameOverRound,
};
