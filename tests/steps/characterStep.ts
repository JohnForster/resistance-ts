import { EventFns } from '../helpers/getEventFns';
import { Instance } from '../helpers/instances';

export const characterStep = (
  { waitForAll }: Partial<EventFns>,
  { label }: { label?: number | string } = {},
) => async ({ page }: Instance) => {
  await page.waitForTimeout(500);
  await expect(page).toClick('button[name="confirmcharacter"]');
  await waitForAll(`characterComplete-${label}`);
};
