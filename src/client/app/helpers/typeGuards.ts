import { MissionResultData, RoundData } from '@shared/types/gameData';

export const isMissionResultRound = (roundData: RoundData): roundData is MissionResultData => {
  return !!(roundData as MissionResultData).missionResults;
};
