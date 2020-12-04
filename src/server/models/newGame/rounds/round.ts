import { RoundData, SecretData } from '../../../../shared/types/gameData';
import { Game, GameHistory } from '../newGame';

export type RoundName =
  | 'lobby'
  | 'character'
  | 'nomination'
  | 'voting'
  | 'voteResult'
  | 'mission'
  | 'missionResult'
  | 'gameOver';

export interface RoundConstructor {
  new (game: Game): Round<unknown>;
}

export interface Round<Message> {
  roundName: RoundName;

  handleMessage: (message: Message) => void;

  validateMessage: (message: Message) => boolean;

  isReadyToComplete: () => boolean;

  // TODO Pass data for next round here so it doesn't need to be recaulcalted?
  // TODO   e.g. whether the voing round passed or not.
  // completeRound: () => [RoundName, unknown];
  completeRound: () => RoundName;

  getRoundData: () => RoundData;

  getSecretData: (id: string) => SecretData;

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
