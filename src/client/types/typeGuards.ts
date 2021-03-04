import { GameData } from '@shared/types/gameData';

export const isLobbyRound = (game: GameData): game is GameData<'lobby'> => {
  return game.stage === 'lobby';
};

export const isCharacterRound = (
  game: GameData,
): game is GameData<'character'> => {
  return game.stage === 'character';
};

export const isNominationRound = (
  game: GameData,
): game is GameData<'nomination'> => {
  return game.stage === 'nomination';
};

export const isVotingRound = (game: GameData): game is GameData<'voting'> => {
  return game.stage === 'voting';
};

export const isVotingResultRound = (
  game: GameData,
): game is GameData<'votingResult'> => {
  return game.stage === 'votingResult';
};

export const isMissionRound = (game: GameData): game is GameData<'mission'> => {
  return game.stage === 'mission';
};

export const isMissionResultRound = (
  game: GameData,
): game is GameData<'missionResult'> => {
  return game.stage === 'missionResult';
};