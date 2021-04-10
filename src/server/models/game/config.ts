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
import { AssassinationRound } from './rounds/assassination';

export const rounds: { [r in RoundName]: RoundConstructor } = {
  lobby: LobbyRound,
  character: CharacterRound,
  nomination: NominationRound,
  voting: VotingRound,
  votingResult: VotingResult,
  mission: MissionRound,
  missionResult: MissionResult,
  assassination: AssassinationRound,
  gameOver: GameOverRound,
};
