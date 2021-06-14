import { EventFns } from '../helpers/getEventFns';
import { Instance } from '../helpers/instances';

export const missionResultStep = (
  { waitForAll }: Partial<EventFns>,
  { label, showoffMode }: { label?: number | string; showoffMode: boolean },
) => async ({ page, i }: Instance) => {
  await page.screenshot({
    path: `tests/screens/nomination-${i}.png`,
  })
  await expect(page).toMatch(/Mission No\.\d Results:/);
  await (showoffMode && page.waitForTimeout(4500));
  await expect(page).toClick('button', { text: 'Continue' });
  await waitForAll(`missionResultComplete-${label}`);
};
