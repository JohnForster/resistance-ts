import {
  PublicDataByName,
  SecretDataByName,
  RoundName,
  MessageByName,
  GameHistory,
} from 'shared';
import { Game } from '../game';

export interface RoundConstructor<T extends RoundName = RoundName> {
  new (game: Game): Round<T>;
}

export interface Round<T extends RoundName> {
  roundName: T;

  handleMessage: (message: MessageByName<T>) => void;

  validateMessage: (message: MessageByName<T>) => boolean;

  isReadyToComplete: () => boolean;

  // TODO Pass data for next round here so it doesn't need to be recaulcalted?
  // TODO   e.g. whether the voing round passed or not.
  // completeRound: () => [RoundName, unknown];
  completeRound: () => RoundName;

  getRoundData: () => PublicDataByName<T>;

  getSecretData: (id: string) => Omit<SecretDataByName<T>, 'allegiance'>;

  isFinal: () => boolean;

  getUpdatedHistory: () => GameHistory;
}
