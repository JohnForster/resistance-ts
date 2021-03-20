import { EventFns } from '../helpers/getEventFns';
import { Instance } from '../helpers/instances';

export const successfulVoteStep = (
  { waitForAll }: Partial<EventFns>,
  { label }: { label?: number | string } = {},
) => async ({ page }: Instance) => {
  await expect(page).toMatch('has nominated');
  await expect(page).toClick('button', { text: '👍' });
  await expect(page).toClick('button', { text: 'Submit' });
  await waitForAll(`votingComplete-${label}`);
};

export const failedVoteStep = (
  { waitForAll }: Partial<EventFns>,
  { label }: { label?: number | string } = {},
) => async ({ page }: Instance) => {
  await expect(page).toMatch('has nominated');
  await expect(page).toClick('button', { text: '👎' });
  await expect(page).toClick('button', { text: 'Submit' });
  await waitForAll(`votingComplete-${label}`);
};
