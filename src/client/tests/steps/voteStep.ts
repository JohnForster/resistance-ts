import { EventFns } from '../helpers/getEventFns';
import { Instance } from '../helpers/instances';

export const voteStep = ({ waitForAll }: Partial<EventFns>) => async ({
  page,
}: Instance) => {
  await expect(page).toMatch('has nominated');
  await expect(page).toClick('button', { text: '👍' });
  await expect(page).toClick('button', { text: 'Submit' });
  await waitForAll('votingComplete');
};
