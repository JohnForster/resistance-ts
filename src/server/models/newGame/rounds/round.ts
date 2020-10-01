import { Game } from '../newGame';

// export type RoundName = 'lobby' | 'character' | 'nomination' | 'vote' | 'voteResult' | 'mission' | 'missionResults' | 'gameOver';
export type RoundName = 'nomination';

export interface RoundConstructor {
  new (game: Game): Round;
}

export interface Round<Message = unknown> {
  roundName: RoundName;

  handleMessage: (message: Message) => void;

  validateMessage: (message: Message) => boolean;

  roundIsReadyToComplete: () => boolean;

  completeRound: () => RoundName;

  getRoundData: () => any;

  getSecretData: (id: string) => any;

  isFinal: () => boolean;

  getHistory: () => any;
}
