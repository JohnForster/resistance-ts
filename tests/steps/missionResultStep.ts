import { EventFns } from '../helpers/getEventFns';
import { Instance } from '../helpers/instances';

export const missionResultStep = (
  { waitForAll }: Partial<EventFns>,
  { label, showoffMode }: { label?: number | string; showoffMode: boolean },
) => async ({ page }: Instance) => {
  await expect(page).toMatch(/Mission No\.\d Results:/);
  await (showoffMode && page.waitForTimeout(4500));
  await expect(page).toClick('button', { text: 'Continue' });
  await waitForAll(`missionResultComplete-${label}`);
};
