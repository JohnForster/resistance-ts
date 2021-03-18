import { EventFns } from '../helpers/getEventFns';
import { Instance } from '../helpers/instances';

export const voteResultStep = ({ waitForAll }: Partial<EventFns>) => async ({
  page,
}: Instance) => {
  await expect(page).toMatch('Vote Results');
  await expect(page).toMatch('Ready');
  await expect(page).toClick('button', { text: 'Ready' });
  await waitForAll('voteResultComplete');
};
