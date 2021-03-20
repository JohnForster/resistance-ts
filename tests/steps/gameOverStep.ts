import { EventFns } from '../helpers/getEventFns';
import { Instance } from '../helpers/instances';

export const gameOverStep = (
  { waitForAll }: Partial<EventFns>,
  { label }: { label?: number | string } = {},
) => async ({ page }: Instance) => {
  await expect(page).toClick('button[name="returnToMainScreen"]');
  await waitForAll(`gameOverComplete-${label}`);
};
