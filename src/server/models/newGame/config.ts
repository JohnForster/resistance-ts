import { NominationRound, RoundConstructor, RoundName } from './rounds';

export const rounds: { [r in RoundName]: RoundConstructor } = {
  nomination: NominationRound,
};
