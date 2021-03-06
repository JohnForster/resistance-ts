import { missionResultStep } from '../steps/missionResultStep';
import { failedMissionStep, successfulMissionStep } from '../steps/missionStep';
import { nominationStep } from '../steps/nominationStep';
import { voteResultStep } from '../steps/voteResultStep';
import { successfulVoteStep } from '../steps/voteStep';
import { EventFns } from './getEventFns';
import { ForAllFn } from './instances';

export const doFailedRound = async (
  all: ForAllFn,
  eventFns: EventFns,
  _options: Partial<{
    label?: number | string;
    showoffMode?: boolean;
  }> = {},
) => {
  const defaultOptions = {
    label: '',
    showoffMode: false,
  };
  const options = {
    ...defaultOptions,
    ..._options,
  };
  await all(nominationStep(eventFns, options));
  await all(successfulVoteStep(eventFns, options));
  await all(voteResultStep(eventFns, options));
  await all(failedMissionStep(eventFns, options));
  await all(missionResultStep(eventFns, options));
};
