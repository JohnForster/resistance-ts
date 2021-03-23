import { EventFns } from '../helpers/getEventFns';
import { Instance } from '../helpers/instances';

export const voteResultStep = (
  { waitForAll }: Partial<EventFns>,
  { label }: { label?: number | string } = {},
) => async ({ page }: Instance) => {
  await expect(page).toMatch('Vote Results');
  await expect(page).toMatch('Continue');
  await expect(page).toClick('button', { text: 'Continue' });
  await waitForAll(`voteResultComplete-${label}`);
};
