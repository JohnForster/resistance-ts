import {
  PublicDataByName,
  SecretDataByName,
  RoundName,
} from '@shared/types/gameData';
import { Game, GameHistory } from '../newGame';

export interface RoundConstructor<T extends RoundName = RoundName> {
  new (game: Game): Round<T>;
}

export interface Round<T extends RoundName> {
  roundName: T;

  handleMessage: (message: unknown) => void;

  validateMessage: (message: unknown) => boolean;

  isReadyToComplete: () => boolean;

  // TODO Pass data for next round here so it doesn't need to be recaulcalted?
  // TODO   e.g. whether the voing round passed or not.
  // completeRound: () => [RoundName, unknown];
  completeRound: () => RoundName;

  getRoundData: () => PublicDataByName<T>;

  getSecretData: (id: string) => SecretDataByName<T>;

  isFinal: () => boolean;

  getUpdatedHistory: () => GameHistory;
}

// import { Round, RoundName } from ".";
// import Game from "../../game/game";

// export interface NominationMessage {}

// export class NominationRound implements Round<NominationMessage> {
//   public roundName = '' as const;

//   constructor(private readonly game: Game) {}

//   handleMessage = (message: NominationMessage): void => {};

//   validateMessage = (message: NominationMessage): boolean => {
//     return true;
//   };

//   roundIsReadyToComplete = (): boolean;

//   completeRound = (): RoundName => '';

//   getRoundData = (): any => ({});

//   getSecretData = (id: string): any => ({});

//   isFinal = (): boolean => false;

//   getUpdatedHistory = (): any => {};
// }
